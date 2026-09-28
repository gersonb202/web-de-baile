import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  ...(isCI ? { workers: 1 } : {}),
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // WebServer solo en CI (en local: `pnpm run preview` arrancado manualmente)
  ...(isCI
    ? {
        webServer: {
          command: 'pnpm run build && pnpm run preview',
          url: 'http://localhost:4321',
          reuseExistingServer: false,
          timeout: 120 * 1000,
        },
      }
    : {}),
});
