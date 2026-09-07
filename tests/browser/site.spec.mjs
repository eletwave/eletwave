import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const context = { window: {} };
vm.runInNewContext(await readFile("preventivo-data.js", "utf8"), context);
const { branches } = context.window.EletwaveQuoteData;
const choiceLabel = option => Array.isArray(option) ? option[0] : option;

async function answerQuestion(page, question) {
  const heading = page.locator("#quiz-stage h2");
  await expect(heading).toHaveText(question.title);
  if (question.type === "text" || question.type === "textarea") {
    await page.locator("#question-input").fill("Dettaglio di prova <test> & verifica");
    if (question.type === "text") await page.locator("#question-input").press("Enter");
    else await page.locator("#next-step").click();
  } else if (question.type === "multi") {
    const label = choiceLabel(question.options[0]);
    await page.getByLabel(label, { exact: true }).check();
    await expect(page.getByLabel(label, { exact: true })).toBeChecked();
    await page.locator("#next-step").click();
  } else {
    await expect(page.locator("#next-step")).toBeVisible({ visible: question.key === "Upload disponibili" });
    await page.locator(".option-card--single").filter({ has: page.locator("strong", { hasText: choiceLabel(question.options[0]) }) }).first().click();
    if (question.key === "Upload disponibili") {
      await expect(page.locator(".question-help")).toHaveText(question.body);
      await page.locator("#next-step").click();
    }
  }
}

for (const [categoryId, category] of Object.entries(branches)) {
  for (const [branchId, branch] of Object.entries(category.subcategories)) {
    test("preventivo " + categoryId + "/" + branchId, async ({ page }) => {
      const errors = [];
      page.on("pageerror", e => errors.push(e.message));
      await page.goto("/preventivo.html");
      await expect(page.locator("#next-step")).toBeHidden();
      await page.locator('[data-value="' + categoryId + '"]').click();
      await expect(page.locator("#quiz-stage h2")).toBeFocused();
      await page.locator('[data-value="' + branchId + '"]').click();
      for (const q of branch.questions) await answerQuestion(page, q);
      await expect(page.locator("#quiz-stage h2")).toHaveText("Dati per ricontattarti.");
      await expect(page.locator("[data-send=whatsapp]")).not.toHaveAttribute("href");
      await page.getByLabel("Nome e cognome", { exact: false }).fill("Test Eletwave");
      await page.getByLabel("Email", { exact: true }).fill("test@example.com");
      await page.locator("#consent").check();
      await expect(page.locator("[data-send=whatsapp]")).toHaveAttribute("aria-disabled", "false");
      await expect(page.locator("#message-preview")).toHaveValue(new RegExp(branch.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      await expect(page.locator("#next-step")).toBeHidden();
      await page.getByLabel("Note finali").fill("Dato da conservare");
      await page.locator("#prev-step").click();
      await answerQuestion(page, branch.questions.at(-1));
      await expect(page.getByLabel("Note finali")).toHaveValue("Dato da conservare");
      expect(errors).toEqual([]);
    });
  }
}

for (const width of [320, 360, 390, 768, 861, 1024, 1080, 1081, 1440]) {
  test("layout and menu " + width, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await expect(page.locator(".topbar__brand")).toBeVisible();
    const measurements = await page.evaluate(() => {
      const brand = document.querySelector(".topbar__brand").getBoundingClientRect();
      return { width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, center: brand.x + brand.width / 2 };
    });
    expect(measurements.scroll).toBeLessThanOrEqual(measurements.width);
    if (width <= 1080) {
      expect(Math.abs(measurements.center - measurements.width / 2)).toBeLessThan(2);
      await page.locator(".topbar__menu").click();
      await expect(page.locator("#topbar-nav")).toBeVisible();
      await expect(page.locator("main")).toHaveAttribute("inert", "");
      await page.keyboard.press("Escape");
      await expect(page.locator("#topbar-nav")).toBeHidden();
      await expect(page.locator(".topbar__menu")).toBeFocused();
    }
    for (const image of await page.locator(".service-card img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(el => el.naturalWidth)).toBeGreaterThan(0);
    }
    const clippedText = await page.locator("main h1, main h2, main h3, main p").evaluateAll(nodes =>
      nodes.filter(el => el.clientWidth && el.scrollWidth > el.clientWidth + 1).map(el => el.textContent.trim()));
    expect(clippedText).toEqual([]);
    if ([360, 1024, 1440].includes(width)) {
      await page.locator("#brands").scrollIntoViewIfNeeded();
      await page.locator("#hero").scrollIntoViewIfNeeded();
      await page.screenshot({ path: testInfo.outputPath("home.png"), fullPage: true });
      for (const [name, selector] of Object.entries({ hero: "#hero", about: "#chi-siamo", services: "#servizi", brands: "#brands", contact: "#contatti" })) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        await page.screenshot({ path: testInfo.outputPath(name + "-viewport.png") });
      }
    }
    for (const route of ["/preventivo.html", "/privacy-policy.html", "/cookie-policy.html", "/en/", "/sl/"]) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), route).toBeLessThanOrEqual(1);
    }
  });
}

test("language links work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await page.locator(".topbar__lang--desktop [data-lang=en]").click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("#chi-siamo .reveal").first()).toHaveCSS("opacity", "1");
  await page.locator(".topbar__lang--desktop [data-lang=sl]").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "sl");
  await context.close();
});

test("contact validation, full long request and copy fallback on mobile", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/preventivo.html");
  const categoryId = Object.keys(branches)[0];
  const branchId = Object.keys(branches[categoryId].subcategories)[0];
  const branch = branches[categoryId].subcategories[branchId];
  await page.locator('[data-value="' + categoryId + '"]').click();
  await page.locator('[data-value="' + branchId + '"]').click();
  for (const q of branch.questions) await answerQuestion(page, q);
  await page.locator("#name").fill("Cliente Prova");
  await page.locator("#email").fill("non-valida");
  await page.locator("#consent").check();
  await expect(page.locator("[data-send=email]")).not.toHaveAttribute("href");
  await page.locator("#email").fill("prova@example.com");
  await page.locator("#phone").fill("abc1234567");
  await expect(page.locator("[data-send=email]")).not.toHaveAttribute("href");
  await page.locator("#phone").fill("+39 333 1234567");
  await expect(page.locator("[data-send=email]")).toHaveAttribute("aria-disabled", "false");
  const longText = "è & ".repeat(375);
  await page.locator("#notes").fill(longText);
  await expect(page.locator("#long-message-notice")).toBeVisible();
  await expect(page.locator("[data-send=whatsapp]")).toHaveAttribute("href", "https://wa.me/393930036372");
  expect(await page.locator("#message-preview").inputValue()).toContain(longText.trim());
  await page.evaluate(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("Denied")) } }); });
  await page.locator("#copy-request").click();
  await expect(page.locator("#message-preview")).toBeFocused();
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#download-request").click();
  const download = await downloadPromise;
  expect(await readFile(await download.path(), "utf8")).toContain(longText.trim());
  await page.screenshot({ path: testInfo.outputPath("quote-mobile.png"), fullPage: true });
});
