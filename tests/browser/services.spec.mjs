import { test, expect } from "@playwright/test";

const photos = ["eletwave-quadro-elettrico.jpg", "eletwave-fotovoltaico-installazione.jpg", "eletwave-wallbox.jpg", "eletwave-videosorveglianza.jpg", "ChatGPT Image 23 gen 2026, 18_09_07.webp", "eletwave-videocitofonia.jpg"];

for (const width of [320, 390, 768, 1440]) {
  test("original service rows enter from alternating sides " + width, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const cards = page.locator(".service-card");
    await expect(cards).toHaveCount(6);
    await expect(page.locator(".service-chapter, .service-index, .service-gallery, canvas")).toHaveCount(0);
    for (const [index, card] of (await cards.all()).entries()) {
      if (await card.evaluate(el => el.classList.contains("is-pending"))) {
        await expect.poll(() => card.evaluate(el => Math.sign(new DOMMatrixReadOnly(getComputedStyle(el).transform).m41))).toBe(index % 2 ? -1 : 1);
      }
      await card.evaluate(el => el.scrollIntoView({ block: "center", behavior: "instant" }));
      await expect(card).not.toHaveClass(/is-pending/);
      await expect(card).toHaveCSS("opacity", "1");
      await expect.poll(() => card.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41)).toBe(0);
      await expect(card.locator("img")).toHaveCount(1);
      expect(await card.locator("img").getAttribute("src")).toBe("./assets/" + photos[index]);
      await expect.poll(() => card.locator("img").evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
      await expect(card.locator("h3")).toBeVisible();
      await expect(card.locator("span")).toBeVisible();
      expect((await card.boundingBox()).height).toBeLessThan(390);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      await page.screenshot({ path: testInfo.outputPath("service-" + index + ".png") });
      const before = await card.boundingBox();
      await page.evaluate(() => scrollBy({ top: 100, behavior: "instant" }));
      expect(Math.abs((await card.boundingBox()).y - before.y + 100)).toBeLessThan(2);
    }
    await cards.first().evaluate(el => el.scrollIntoView({ behavior: "instant" }));
    await expect(cards.first()).toHaveCSS("opacity", "1");
  });
}

for (const route of ["/", "/en/", "/sl/"]) {
  test("service photos remain visible without motion " + route, async ({ page }) => {
    await page.goto(route + "#servizi");
    await expect(page.locator(".service-card.is-pending")).toHaveCount(0);
    await expect(page.locator(".service-card img")).toHaveCount(6);
    await expect(page.locator(".service-card img[data-i18n-alt]")).toHaveCount(5);
    for (const img of await page.locator(".service-card img[data-i18n-alt]").all()) {
      await expect(img).toHaveAttribute("alt", /.+/);
    }
  });
}
