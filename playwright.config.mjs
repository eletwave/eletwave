import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: process.env.SITE_URL || "http://127.0.0.1:4183",
    browserName: "chromium",
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
  },
  webServer: process.env.SITE_URL ? undefined : {
    command: "node scripts/serve.mjs",
    url: "http://127.0.0.1:4183",
    reuseExistingServer: !process.env.CI,
  },
});
