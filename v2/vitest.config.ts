import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    pool: 'forks',
    setupFiles: './site/src/test/setup.ts',
    include: ['site/**/*.test.{ts,tsx}', 'test/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'site/src'),
    },
  },
})
