import { test, expect } from "@playwright/test";

const key = "eletwave-analytics-consent";
const id = "G-LN42Y4382J";
const official = "https://www.eletwave.com";
const saved = (value, savedAt = Date.now()) => ({ version: 1, value, savedAt });

// Serve our actual files at the official origin, but replace Google with a local
// protocol stub. These tests must never send visitor or quote data to Google.
async function setup(page, { preference, blockedStorage = false, delayedTag = false } = {}) {
  const base = test.info().project.use.baseURL;
  const tags = [];
  const events = [];
  let releaseTag;
  const gate = delayedTag ? new Promise(resolve => { releaseTag = resolve; }) : Promise.resolve();
  await page.route(official + "/**", async route => {
    const url = new URL(route.request().url());
    const response = await route.fetch({ url: new URL(url.pathname + url.search, base).href });
    await route.fulfill({ response });
  });
  await page.route("https://www.google-analytics.com/**", async route => {
    events.push(JSON.parse(new URL(route.request().url()).searchParams.get("payload")));
    await route.fulfill({ status: 204, headers: { "access-control-allow-origin": "*" } });
  });
  await page.route("https://www.googletagmanager.com/**", async route => {
    tags.push(route.request().url());
    await gate;
    await route.fulfill({ contentType: "application/javascript", body: `
      (() => {
        let consent = "denied";
        const process = args => {
          if (args[0] === "consent") consent = args[2].analytics_storage;
          if (window["ga-disable-${id}"] || consent !== "granted") return;
          if (args[0] === "config") {
            document.cookie = "_ga=test; Path=/; Domain=.eletwave.com; Secure";
            document.cookie = "_ga_LN42Y4382J=test; Path=/; Secure";
          }
          if (args[0] === "event") fetch("https://www.google-analytics.com/g/collect?payload=" + encodeURIComponent(JSON.stringify([args[1], args[2]])));
        };
        window.dataLayer.forEach(process);
        const push = window.dataLayer.push.bind(window.dataLayer);
        window.dataLayer.push = (...items) => { items.forEach(process); return push(...items); };
        window.__analyticsStubReady = true;
      })();
    ` });
  });
  await page.addInitScript(({ key, preference, blockedStorage }) => {
    if (preference !== undefined) localStorage.setItem(key, typeof preference === "string" ? preference : JSON.stringify(preference));
    if (blockedStorage) {
      Storage.prototype.setItem = function () { throw new DOMException("Blocked", "SecurityError"); };
    }
  }, { key, preference, blockedStorage });
  return { tags, events, releaseTag };
}

async function accept(page) {
  await page.locator('[data-consent="granted"]').click();
  await expect(page.locator("#analytics-consent")).toBeHidden();
}

async function keepLinksOnPage(page) {
  await page.evaluate(() => {
    document.addEventListener("click", event => {
      if (event.target.closest("a[href]")) event.preventDefault();
    });
    document.addEventListener("auxclick", event => event.preventDefault());
  });
}

for (const [route, title, reject] of [
  ["/", "Statistiche del sito", "Rifiuta"],
  ["/en/", "Website statistics", "Decline"],
  ["/sl/", "Statistika spletne strani", "Zavrni"],
]) {
  for (const width of [320, 390, 768, 1440]) {
    test(`consent layout and default network block ${route} ${width}`, async ({ page }, testInfo) => {
      const { tags, events } = await setup(page);
      await page.setViewportSize({ width, height: 844 });
      await page.goto(official + route);
      const banner = page.locator("#analytics-consent");
      await expect(banner.getByRole("heading")).toHaveText(title);
      await expect(banner.getByRole("button", { name: reject, exact: true })).toBeVisible();
      const buttons = banner.locator("[data-consent]");
      const boxes = await buttons.evaluateAll(nodes => nodes.map(node => {
        const box = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return { x: box.x, right: box.right, height: box.height, width: box.width, background: style.backgroundColor, color: style.color, clipped: node.scrollWidth > node.clientWidth + 1 };
      }));
      expect(boxes[0].background).toBe(boxes[1].background);
      expect(boxes[0].color).toBe(boxes[1].color);
      expect(Math.abs(boxes[0].width - boxes[1].width)).toBeLessThan(1);
      for (const box of boxes) {
        expect(box.x).toBeGreaterThanOrEqual(15);
        expect(box.right).toBeLessThanOrEqual(width - 15);
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.clipped).toBe(false);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      expect((await banner.boundingBox()).height).toBeLessThan(290);
      await keepLinksOnPage(page);
      await page.locator('.hero__actions a[href*="wa.me"]').click();
      await page.locator('.hero__actions a[href$="preventivo.html"]').click();
      expect(tags).toEqual([]);
      expect(events).toEqual([]);
      expect(await page.evaluate(() => typeof window.gtag)).toBe("undefined");
      if ([390, 1440].includes(width)) await page.screenshot({ path: testInfo.outputPath("consent.png") });
    });
  }
}

test("decline persists between pages, reopening and Escape do not grant consent", async ({ page }) => {
  const { tags, events } = await setup(page);
  await page.goto(official);
  await page.locator('[data-consent="denied"]').click();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).value, key)).toBe("denied");
  await page.goto(official + "/preventivo.html");
  await expect(page.locator("#analytics-consent")).toBeHidden();
  await page.locator(".analytics-preferences").click();
  await expect(page.locator('[data-consent="denied"]')).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#analytics-consent")).toBeHidden();
  await expect(page.locator(".analytics-preferences")).toBeFocused();
  expect(tags).toEqual([]);
  expect(events).toEqual([]);
});

test("closing the first banner saves a refusal", async ({ page }) => {
  const { tags } = await setup(page);
  await page.goto(official);
  await page.getByRole("button", { name: "Chiudi e rifiuta" }).click();
  await expect(page.locator("#analytics-consent")).toBeHidden();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).value, key)).toBe("denied");
  expect(tags).toEqual([]);
});

test("accept records one page view and the two CTA events, without changing links or blocking clicks", async ({ page }) => {
  const { tags, events } = await setup(page);
  await page.goto(official + "/?email=private@example.com#private-name", { referer: "https://example.org/private/customer?email=secret@example.org" });
  await accept(page);
  await expect.poll(() => events.length).toBe(1);
  expect(tags).toEqual(["https://www.googletagmanager.com/gtag/js?id=" + id]);
  expect(events[0]).toEqual(["page_view", { send_to: id, page_location: official + "/", page_referrer: "https://example.org/", page_title: "ELETWAVE | Impianti elettrici, fotovoltaico e sicurezza", language: "it" }]);
  await keepLinksOnPage(page);
  const whatsapp = page.locator('.hero__actions a[href*="wa.me"]');
  const original = await whatsapp.getAttribute("href");
  await whatsapp.click();
  await page.locator('.hero__actions a[href$="preventivo.html"]').click();
  await expect.poll(() => events.length).toBe(3);
  expect(events.map(event => event[0])).toEqual(["page_view", "click_whatsapp", "click_preventivo"]);
  expect(events[1][1].link_position).toBe("hero");
  expect(await whatsapp.getAttribute("href")).toBe(original);
  expect(JSON.stringify(events)).not.toMatch(/private|secret|example\.com|customer|email=/);
  await page.locator(".analytics-preferences").click();
  await accept(page);
  expect(tags).toHaveLength(1);
  expect(events).toHaveLength(3);
});

test("revoking clears cookies, stops events and preserves quote data", async ({ page }) => {
  const { events } = await setup(page, { preference: saved("granted") });
  await page.goto(official + "/preventivo.html");
  await expect.poll(() => events.length).toBe(1);
  await page.locator('[data-choice="consiglio"]').click();
  await expect(page.locator("#question-input")).toBeVisible();
  await page.locator("#question-input").fill("Dettaglio privato da mantenere");
  expect((await page.context().cookies()).some(cookie => cookie.name === "_ga")).toBe(true);
  await page.locator(".analytics-preferences").click();
  await page.locator('[data-consent="denied"]').click();
  await expect(page.locator("#question-input")).toHaveValue("Dettaglio privato da mantenere");
  expect((await page.context().cookies()).filter(cookie => cookie.name.startsWith("_ga"))).toEqual([]);
  expect(await page.evaluate(id => window["ga-disable-" + id], id)).toBe(true);
  await keepLinksOnPage(page);
  await page.locator('.aside-contact a[href*="wa.me"]').first().click();
  expect(events).toHaveLength(1);
});

test("dynamic quote WhatsApp records only the event and placement, never customer data", async ({ page }) => {
  const { events } = await setup(page, { preference: saved("granted") });
  await page.goto(official + "/preventivo.html");
  await expect.poll(() => events.length).toBe(1);
  await page.locator('[data-choice="consiglio"]').click();
  await page.locator("#question-input").fill("Impianto del cliente riservato");
  await page.locator("#next-step").click();
  for (let index = 0; index < 4; index++) await page.locator("#quiz-stage [data-choice]").first().click();
  await page.locator("#name").fill("Cliente Riservato");
  await page.locator("#city").fill("Comune Riservato");
  await page.locator("#email").fill("cliente-riservato@example.com");
  await page.locator("#consent").check();
  await page.locator("#next-step").click();
  const link = page.locator('[data-send="whatsapp"]');
  await expect(link).toHaveAttribute("href", /text=/);
  await keepLinksOnPage(page);
  await link.click();
  await expect.poll(() => events.length).toBe(2);
  expect(events[1][0]).toBe("click_whatsapp");
  expect(events[1][1].link_position).toBe("quote_review");
  const commands = await page.evaluate(() => window.dataLayer.map(command => Array.from(command)));
  expect(JSON.stringify(commands)).not.toMatch(/Riservato|riservato|cliente-|text=|wa\.me|form_|link_url/);
});

test("revocation while the tag is loading discards queued events", async ({ page }) => {
  const { events, releaseTag } = await setup(page, { delayedTag: true });
  await page.goto(official);
  await accept(page);
  await keepLinksOnPage(page);
  await page.locator('.hero__actions a[href*="wa.me"]').click();
  await page.locator(".analytics-preferences").click();
  await page.locator('[data-consent="denied"]').click();
  releaseTag();
  await expect.poll(() => page.evaluate(() => window.__analyticsStubReady)).toBe(true);
  expect(events).toEqual([]);
});

for (const [name, makePreference] of [
  ["malformed JSON", () => "invalid-json"],
  ["expired", () => saved("granted", Date.now() - 200 * 86400000)],
  ["old version", () => ({ ...saved("granted"), version: 0 })],
  ["future date", () => saved("granted", Date.now() + 86400000)],
]) {
  test("invalid or expired stored consent is not accepted: " + name, async ({ page }) => {
    const preference = makePreference();
    const { tags } = await setup(page, { preference });
    await page.goto(official);
    await expect(page.locator("#analytics-consent")).toBeVisible();
    expect(tags).toEqual([]);
  });
}

test("storage failure keeps this page's choice and the site usable", async ({ page }) => {
  const { events } = await setup(page, { blockedStorage: true });
  await page.goto(official);
  await accept(page);
  await expect.poll(() => events.length).toBe(1);
  await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
  await expect(page.locator("#analytics-consent")).toBeHidden();
  await keepLinksOnPage(page);
  await page.locator('.hero__actions a[href*="wa.me"]').click();
  await expect.poll(() => events.length).toBe(2);
});

test("a refusal in another tab is applied without reloading", async ({ page }) => {
  const { events } = await setup(page, { preference: saved("granted") });
  await page.goto(official);
  await expect.poll(() => events.length).toBe(1);
  await page.evaluate(({ key, preference }) => {
    localStorage.setItem(key, JSON.stringify(preference));
    window.dispatchEvent(new StorageEvent("storage", { key }));
  }, { key, preference: saved("denied") });
  expect(await page.evaluate(id => window["ga-disable-" + id], id)).toBe(true);
  await keepLinksOnPage(page);
  await page.locator('.hero__actions a[href*="wa.me"]').click();
  expect(events).toHaveLength(1);
});

test("a malformed previous choice does not disable cross-tab revocation after acceptance", async ({ page }) => {
  const { events } = await setup(page, { preference: "invalid-json" });
  await page.goto(official);
  await accept(page);
  await expect.poll(() => events.length).toBe(1);
  await page.evaluate(({ key, preference }) => {
    localStorage.setItem(key, JSON.stringify(preference));
    window.dispatchEvent(new StorageEvent("storage", { key }));
  }, { key, preference: saved("denied") });
  expect(await page.evaluate(id => window["ga-disable-" + id], id)).toBe(true);
});

test("local and temporary preview hosts never load Google, even after acceptance", async ({ page }) => {
  const { tags, events } = await setup(page);
  await page.goto("/");
  await accept(page);
  expect(tags).toEqual([]);
  expect(events).toEqual([]);
});
