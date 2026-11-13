import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root,
  build: {
    outDir: path.join(root, '..', 'dist'),
    emptyOutDir: false,
    lib: {
      entry: path.join(root, 'src/styles-entry.ts'),
      formats: ['es'],
      fileName: 'unused',
    },
    rollupOptions: {
      output: {
        assetFileNames: 'assets/site.css',
        entryFileNames: '_skip/[name].js',
      },
    },
  },
})
