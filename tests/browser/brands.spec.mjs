import { test, expect } from "@playwright/test";

for (const width of [320, 390, 768, 1440]) {
  test("brands are full width, compact and rotating " + width, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator("#brands");
    const orbit = section.locator(".brands-orbit");
    await section.evaluate(el => el.scrollIntoView({ block: "center", behavior: "instant" }));
    await expect(orbit).toHaveCSS("opacity", "1");
    await expect(orbit).toHaveCSS("border-top-width", "0px");
    await expect(orbit).toHaveCSS("border-radius", "0px");
    await expect(orbit).toHaveCSS("box-shadow", "none");
    const bounds = await orbit.boundingBox();
    expect(bounds.x).toBe(0);
    expect(bounds.width).toBe(width);
    expect(bounds.height).toBeLessThan(500);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const visual = await section.locator(".brands-orbit__visual").boundingBox();
    const content = await section.locator(".brands-orbit__content").boundingBox();
    expect(visual.y + visual.height).toBeLessThan(content.y);
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
