import { build } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdirSync } from 'node:fs'

const root = path.dirname(fileURLToPath(import.meta.url))
const siteRoot = path.join(root, '..')
const outDir = path.join(siteRoot, '..', 'dist')
const islandsDir = path.join(outDir, 'assets', 'islands')

mkdirSync(islandsDir, { recursive: true })

const entries = [
  { name: 'hero', file: 'hero-island.ts', react: false },
  { name: 'case-studies', file: 'case-studies-island.tsx', react: true },
  { name: 'digest', file: 'digest-island.tsx', react: true },
  { name: 'quick-check', file: 'quick-check-island.tsx', react: true },
]

for (const entry of entries) {
  await build({
    root: siteRoot,
    plugins: entry.react ? [react()] : [],
    build: {
      outDir,
      emptyOutDir: false,
      lib: undefined,
      rollupOptions: {
        input: path.join(siteRoot, 'src/islands', entry.file),
        output: {
          entryFileNames: `assets/islands/${entry.name}.js`,
          inlineDynamicImports: true,
          format: 'es',
        },
      },
    },
  })
  console.log('built island', entry.name)
}
