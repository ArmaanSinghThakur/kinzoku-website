import { defineConfig } from "@playwright/test";

// The site's automatic checks (npm test). Builds the site into .next-test with a test Analytics ID
// and starts it on port 3100 through server.ts, the way it runs on the server. Needs the local
// services: npm run services:up. Tests run one after another because they share the database,
// the mail catcher and rate limits, and some stop a service on purpose.
const port = 3100;
export const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "tests",
  globalSetup: "./tests/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 90_000,
  expect: { timeout: 8_000 },
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL,
    // Edge on Windows laptops; Playwright's own Chromium on the release server (Phase 5).
    channel: process.env.CI ? undefined : "msedge",
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run build && node dist/server.mjs",
    url: `${baseURL}/api/health`,
    timeout: 300_000,
    reuseExistingServer: false,
    stdout: "pipe",
    env: {
      PORT: String(port),
      SITE_URL: baseURL,
      NEXT_DIST_DIR: ".next-test",
      NEXT_PUBLIC_GA_ID: "G-TEST000000",
    },
  },
});
