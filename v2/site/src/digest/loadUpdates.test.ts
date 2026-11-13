import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { loadDigestUpdates } from './loadUpdates'
import { digestUpdateSchema } from './schema'

const updatesDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'content',
  'digest',
  'updates',
)

describe('loadDigestUpdates', () => {
  it('loads and validates 25 issues with matching filenames', () => {
    const updates = loadDigestUpdates(updatesDir)
    expect(updates).toHaveLength(25)
    for (const u of updates) {
      expect(u.id).toBe(u.data.date)
      digestUpdateSchema.parse(u.data)
    }
  })
})
