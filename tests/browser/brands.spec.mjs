import { test, expect } from "@playwright/test";

for (const width of [320, 390, 768, 1440]) {
  test("brands are framed in the restored rotating card " + width, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator("#brands");
    const orbit = section.locator(".brands-orbit");
    await section.evaluate(el => el.scrollIntoView({ block: "center", behavior: "instant" }));
    await expect(orbit).toHaveCSS("opacity", "1");
    await expect(orbit).toHaveCSS("border-top-width", "1px");
    await expect(orbit).toHaveCSS("border-radius", "8px");
    expect(await orbit.evaluate(el => getComputedStyle(el).boxShadow)).not.toBe("none");
    const bounds = await orbit.boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(24);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width - 24);
    expect(bounds.width).toBeLessThanOrEqual(1160);
    expect(bounds.height).toBeLessThan(800);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const content = await section.locator(".brands-orbit__content").boundingBox();
    expect(content.x).toBeGreaterThan(bounds.x);
    expect(content.x + content.width).toBeLessThan(bounds.x + bounds.width);
    expect(content.y + content.height).toBeLessThan(bounds.y + bounds.height);
    const logos = section.locator(".brands-pill img");
    await expect(logos).toHaveCount(24);
    await logos.evaluateAll(images => images.forEach(img => { img.loading = "eager"; }));
    for (const logo of await logos.all()) {
      await expect.poll(() => logo.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
      expect(await logo.evaluate(img => getComputedStyle(img).filter)).not.toBe("none");
    }
    await expect(section.locator("#brand-white-alpha")).toHaveCount(1);
    const ring = section.locator(".brands-ring--outer");
    await expect(ring).toHaveCSS("animation-play-state", "running");
    const transform = await ring.evaluate(el => getComputedStyle(el).transform);
    await expect.poll(() => ring.evaluate(el => getComputedStyle(el).transform)).not.toBe(transform);
    await page.screenshot({ path: testInfo.outputPath("brands.png") });
  });
}

for (const route of ["/", "/en/", "/sl/"]) {
  test("brand card remains readable without motion " + route, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto(route);
    const orbit = page.locator(".brands-orbit");
    await orbit.scrollIntoViewIfNeeded();
    await expect(orbit).toHaveCSS("border-radius", "8px");
    await expect(orbit.locator("h2")).toBeVisible();
    await expect(orbit.locator(".brands-pill img")).toHaveCount(24);
    await expect(orbit.locator(".brands-ring--outer")).toHaveCSS("animation-name", "none");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  });
}
