import { defineConfig, devices } from "@playwright/test";
const live = process.env.E2E_BASE_URL;
export default defineConfig({
  testDir: "tests/e2e",
  webServer: live
    ? undefined
    : {
        command: "npm run dev -- --host 127.0.0.1 --port 4173",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: true,
      },
  use: { baseURL: live || "http://127.0.0.1:4173", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
