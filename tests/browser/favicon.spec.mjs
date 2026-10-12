import { test, expect } from "@playwright/test";

for (const [route, width] of [["/", 1440], ["/en/", 390], ["/sl/", 390], ["/preventivo.html", 390]]) {
  test("favicon is reachable and decodes " + route, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(route);
    const icon = page.locator("link[rel=icon]");
    await expect(icon).toHaveAttribute("sizes", "528x528");
    const url = await icon.evaluate(el => el.href);
    const response = await page.request.get(url);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/png");
    const size = await page.evaluate(async url => {
      const image = new Image();
      image.src = url;
      await image.decode();
      return { width: image.naturalWidth, height: image.naturalHeight };
    }, url);
    expect(size).toEqual({ width: 528, height: 528 });
  });
}
