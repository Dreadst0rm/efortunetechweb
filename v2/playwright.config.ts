import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'test',
  testMatch: 'site-prefs-mobile.spec.ts',
  timeout: 60_000,
  use: {
    baseURL: 'http://127.0.0.1:4317',
    viewport: { width: 375, height: 740 },
  },
  webServer: {
    command: 'npx serve@14.2.4 dist -l 4317',
    url: 'http://127.0.0.1:4317/',
    reuseExistingServer: true,
    timeout: 60_000,
  },
})