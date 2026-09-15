import { test, expect } from "@playwright/test";

for (const [width, route] of [[320, "/"], [390, "/"], [768, "/"], [1440, "/"], [390, "/en/"], [390, "/sl/"]]) {
  test("full-width contact section " + width + " " + route, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(route + "#contatti");
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator("#contatti");
    await section.evaluate(el => el.scrollIntoView({ block: "start", behavior: "instant" }));
    const bounds = await section.boundingBox();
    expect(bounds.x).toBe(0);
    expect(bounds.width).toBe(width);
    expect(bounds.height).toBeLessThan(730);
    await expect(section.locator(".contact__inner")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(section.locator(".contact__inner")).toHaveCSS("border-radius", "0px");
    await expect(section.locator(".contact__inner")).toHaveCSS("box-shadow", "none");
    await expect(section.locator('a[href="tel:+393930036372"]')).toBeVisible();
    await expect(section.locator('a[href="mailto:info@eletwave.com"]')).toHaveCount(1);
    await expect(section.locator('a[href="https://wa.me/393930036372"]')).toHaveAttribute("rel", "noopener noreferrer");
    await expect(section.locator(".contact__socials a")).toHaveCount(3);
    for (const link of await section.locator("a").all()) {
      const box = await link.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(20);
      expect(box.x + box.width).toBeLessThanOrEqual(width - 20);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await page.screenshot({ path: testInfo.outputPath("contact.png") });
    await section.locator('a[href$="preventivo.html"]').click();
    await expect(page).toHaveURL(/\/preventivo\.html$/);
  });
}
