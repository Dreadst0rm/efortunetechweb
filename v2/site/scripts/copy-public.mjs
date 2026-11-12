import { cpSync, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const dist = path.join(root, 'dist')
const pub = path.join(root, 'public')

if (!existsSync(dist)) mkdirSync(dist, { recursive: true })
cpSync(pub, dist, { recursive: true })
console.log('copied public → dist')
