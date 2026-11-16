import { describe, expect, it } from 'vitest'
import {
  githubRequestHeaders,
  listCommittedPostDates,
  shouldFailBlogImport,
} from '../scripts/import-daily-pulse-lib.mjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const updatesDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'site',
  'content',
  'blog',
  'updates',
)

describe('import-daily-pulse lib', () => {
  it('adds Authorization when GITHUB_TOKEN is set', () => {
    const prev = process.env.GITHUB_TOKEN
    process.env.GITHUB_TOKEN = 'test-token'
    try {
      const headers = githubRequestHeaders()
      expect(headers.Authorization).toBe('Bearer test-token')
    } finally {
      if (prev === undefined) delete process.env.GITHUB_TOKEN
      else process.env.GITHUB_TOKEN = prev
    }
  })

  it('lists committed post dates from the repo', () => {
    const dates = listCommittedPostDates(updatesDir)
    expect(dates.length).toBeGreaterThanOrEqual(27)
  })

  it('does not fail build when remote import fails but committed posts exist', () => {
    expect(
      shouldFailBlogImport({ importedCount: 27, committedCount: 27, remoteFailed: true }),
    ).toBe(false)
    expect(
      shouldFailBlogImport({ importedCount: 0, committedCount: 27, remoteFailed: true }),
    ).toBe(false)
    expect(
      shouldFailBlogImport({ importedCount: 0, committedCount: 0, remoteFailed: true }),
    ).toBe(true)
    expect(
      shouldFailBlogImport({ importedCount: 5, committedCount: 0, remoteFailed: false }),
    ).toBe(false)
  })
})