import { test, expect } from "@playwright/test";

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
