import { defineConfig, devices } from "@playwright/test";
// Запуск: npx playwright test (демо-режим без ключей)
export default defineConfig({
  testDir: "tests/e2e",
  webServer: { command: "npm run demo", url: "http://localhost:3000", reuseExistingServer: true, timeout: 120_000 },
  use: { baseURL: "http://localhost:3000" },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "laptop", use: { viewport: { width: 1024, height: 768 } } },
    { name: "tablet", use: { ...devices["iPad Mini"] } },
    { name: "phone", use: { ...devices["iPhone 13"] } },
    { name: "small-phone", use: { viewport: { width: 360, height: 640 }, isMobile: true, hasTouch: true } },
  ],
});
