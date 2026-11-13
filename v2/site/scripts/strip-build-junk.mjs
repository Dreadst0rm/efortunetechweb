import { rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist')
rmSync(path.join(dist, 'unused.js'), { force: true })
rmSync(path.join(dist, '_skip'), { recursive: true, force: true })
