import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const siteRoot = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('vite').UserConfig} */
export const preactIslandConfig = {
  root: siteRoot,
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom/client': 'preact/compat/client',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
  plugins: [react({ jsxRuntime: 'automatic' })],
}

export const islandEntries = {
  'case-studies': path.join(siteRoot, 'src/islands/case-studies-island.tsx'),
  digest: path.join(siteRoot, 'src/islands/digest-island.tsx'),
  'quick-check': path.join(siteRoot, 'src/islands/quick-check-island.tsx'),
}
