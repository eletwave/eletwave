import { test, expect } from "@playwright/test";

for (const [width, height] of [[320, 568], [390, 568], [390, 844], [768, 1024], [1440, 900], [1920, 1080]]) {
  test("photographic hero remains readable " + width + "x" + height, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const image = page.locator(".hero__image");
    await expect(image).toHaveAttribute("src", "./assets/eletwave-copertina-fotovoltaico.jpg");
    await expect(image).toHaveAttribute("fetchpriority", "high");
    await expect.poll(() => image.evaluate(el => el.complete && el.naturalWidth === 1280)).toBe(true);
    await expect(image).toHaveCSS("object-fit", "cover");
    await expect(page.locator(".hero__overlay")).toHaveCSS("background-color", "rgba(0, 0, 0, 0.6)");
    for (const text of await page.locator(".hero h1, .hero p").all()) {
      await expect(text).toHaveCSS("color", "rgb(255, 255, 255)");
    }
    await expect(page.locator(".hero .button--primary")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(page.locator(".hero .button--primary")).toHaveAttribute("href", "./preventivo.html");
    await expect(page.locator(".hero .button--ghost")).toHaveAttribute("href", "https://wa.me/393930036372");
    const overflow = await page.locator(".hero__content").evaluate(el => {
      const bounds = el.getBoundingClientRect();
      return [...el.querySelectorAll("h1, p, a")].some(child => {
        const rect = child.getBoundingClientRect();
        return rect.left < bounds.left - 1 || rect.right > bounds.right + 1 || child.scrollWidth > child.clientWidth + 1;
      });
    });
    expect(overflow).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const hero = await page.locator("#hero").boundingBox();
    const photo = await image.boundingBox();
    expect(hero.y + hero.height).toBeLessThanOrEqual(height - 12);
    expect(photo.width).toBe(hero.width);
    expect(photo.height).toBe(hero.height);
    await page.screenshot({ path: testInfo.outputPath("hero.png") });
  });
}

for (const route of ["/en/", "/sl/"]) {
  test("hero photo appears in translated homepage " + route, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator(".hero__image")).toHaveAttribute("src", "../assets/eletwave-copertina-fotovoltaico.jpg");
    await expect(page.locator(".hero h1")).toBeVisible();
  });
}
