import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'test',
  testMatch: 'site-prefs-mobile.spec.ts',
  timeout: 45_000,
  use: {
    baseURL: 'http://127.0.0.1:4317',
    viewport: { width: 375, height: 740 },
  },
  webServer: {
    command: 'npx --yes serve dist -l 4317',
    url: 'http://127.0.0.1:4317/',
    reuseExistingServer: true,
    timeout: 30_000,
  },
})