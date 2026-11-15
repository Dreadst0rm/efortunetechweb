import { cpSync, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const dist = path.join(root, 'dist')
const pub = path.join(root, 'public')

if (!existsSync(dist)) mkdirSync(dist, { recursive: true })
cpSync(pub, dist, { recursive: true })

const assetsDir = path.join(dist, 'assets')
const srcAssets = path.join(root, 'site', 'src', 'assets')
const photoAssets = ['ed-fortune.jpg', 'ed-fortune.webp', 'og-card.jpg']

mkdirSync(assetsDir, { recursive: true })
for (const name of photoAssets) {
  const src = path.join(srcAssets, name)
  if (existsSync(src)) {
    cpSync(src, path.join(assetsDir, name))
  }
}

console.log('copied public → dist')