import { test, expect } from "@playwright/test";

for (const width of [320, 390, 1440]) {
  for (const [route, code] of [["/", "it"], ["/en/", "en"], ["/sl/", "sl"]]) {
    test("full language names and Manager styling " + width + route, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(route);
      await page.locator(".topbar__menu").click();
      const switcher = page.locator(".topbar__lang--menu");
      await expect(switcher.locator("a")).toHaveText(["Italiano", "English", "Slovenščina"]);
      await expect(switcher.locator(`[data-lang=${code}]`)).toHaveAttribute("aria-current", "page");
      await expect(switcher.locator(".topbar__lang-pill")).toHaveCSS("background-color", "rgb(255, 255, 255)");
      await expect(switcher.locator(`[data-lang=${code}]`)).toHaveCSS("color", "rgb(23, 24, 28)");
      const clipped = await switcher.locator("a").evaluateAll(links => links.some(el => el.scrollWidth > el.clientWidth));
      expect(clipped).toBe(false);
      const target = code === "en" ? "sl" : "en";
      await switcher.locator(`[data-lang=${target}]`).click();
      await expect(page.locator("html")).toHaveAttribute("lang", target);
      await page.locator(".topbar__menu").click();
      await expect(switcher.locator(`[data-lang=${target}]`)).toHaveAttribute("aria-current", "page");
      await page.screenshot({ path: testInfo.outputPath("language-menu.png") });
    });
  }
}
