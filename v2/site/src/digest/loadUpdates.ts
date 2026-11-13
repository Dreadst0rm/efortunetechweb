import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { digestUpdateSchema, type DigestUpdate } from './schema'

export function loadDigestUpdates(updatesDir: string): DigestUpdate[] {
  const files = readdirSync(updatesDir)
    .filter((f) => f.endsWith('.json'))
    .sort()

  const updates: DigestUpdate[] = []
  for (const file of files) {
    const id = file.replace(/\.json$/, '')
    const raw = JSON.parse(readFileSync(path.join(updatesDir, file), 'utf8')) as unknown
    const data = digestUpdateSchema.parse(raw)
    if (data.date !== id) {
      throw new Error(
        `content/digest/updates/${file}: "date" must match filename (expected "${id}", got "${data.date}")`,
      )
    }
    updates.push({ id, data })
  }

  return updates.sort((a, b) => b.data.date.localeCompare(a.data.date))
}
