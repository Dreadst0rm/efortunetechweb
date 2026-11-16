import { existsSync, readdirSync } from 'node:fs'

export function githubRequestHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'efortune-site-import',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const token = process.env.GITHUB_TOKEN
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

/** @param {string} outDir */
export function listCommittedPostDates(outDir) {
  if (!existsSync(outDir)) return []
  return readdirSync(outDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
    .sort()
}

/**
 * @param {{ importedCount: number, committedCount: number, remoteFailed: boolean }} input
 */
export function shouldFailBlogImport({ importedCount, committedCount, remoteFailed }) {
  if (importedCount > 0) return false
  if (remoteFailed && committedCount > 0) return false
  return true
}