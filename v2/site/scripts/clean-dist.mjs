import { rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist')
rmSync(dist, { recursive: true, force: true })
console.log('cleaned dist')
