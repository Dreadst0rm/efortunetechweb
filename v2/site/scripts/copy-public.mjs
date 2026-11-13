import { cpSync, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const dist = path.join(root, 'dist')
const pub = path.join(root, 'public')

if (!existsSync(dist)) mkdirSync(dist, { recursive: true })
cpSync(pub, dist, { recursive: true })
const heroSrc = path.join(root, 'site', 'src', 'assets', 'hero.png')
const assetsDir = path.join(dist, 'assets')
if (existsSync(heroSrc)) {
  mkdirSync(assetsDir, { recursive: true })
  cpSync(heroSrc, path.join(assetsDir, 'hero.png'))
}
console.log('copied public → dist')
