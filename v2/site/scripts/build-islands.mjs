import { build } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdirSync } from 'node:fs'
import { islandEntries, preactIslandConfig } from '../vite.islands.shared.mjs'

const root = path.dirname(fileURLToPath(import.meta.url))
const siteRoot = path.join(root, '..')
const outDir = path.join(siteRoot, '..', 'dist')
const islandsDir = path.join(outDir, 'assets', 'islands')

mkdirSync(islandsDir, { recursive: true })

await build({
  ...preactIslandConfig,
  build: {
    outDir,
    emptyOutDir: false,
    minify: 'esbuild',
    rollupOptions: {
      input: islandEntries,
      output: {
        entryFileNames: 'assets/islands/[name].js',
        chunkFileNames: 'assets/islands/chunks/[name].js',
        manualChunks(id) {
          if (id.includes('node_modules/preact')) return 'preact'
        },
      },
    },
  },
})
console.log('built Preact islands (shared preact chunk)')

await build({
  root: siteRoot,
  build: {
    outDir,
    emptyOutDir: false,
    rollupOptions: {
      input: path.join(siteRoot, 'src/islands/hero-island.ts'),
      output: {
        entryFileNames: 'assets/islands/hero.js',
        codeSplitting: false,
        format: 'es',
      },
    },
  },
})
console.log('built island hero')
