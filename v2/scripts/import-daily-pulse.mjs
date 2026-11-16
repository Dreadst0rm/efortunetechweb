/**
 * Import blog posts from Dreadst0rm/daily-pulse (content/updates/*.json).
 * Run before build: npm run import:blog
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  githubRequestHeaders,
  listCommittedPostDates,
  shouldFailBlogImport,
} from './import-daily-pulse-lib.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'site', 'content', 'blog', 'updates')
const manifestPath = path.join(root, 'site', 'content', 'blog', 'import-manifest.json')

const REPO = process.env.DAILY_PULSE_REPO ?? 'Dreadst0rm/daily-pulse'
const REF = process.env.DAILY_PULSE_REF ?? 'main'
const LOCAL_SRC = process.env.DAILY_PULSE_DIR

async function listRemoteFiles() {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/content/updates?ref=${REF}`,
    { headers: githubRequestHeaders() },
  )
  if (!res.ok) throw new Error(`GitHub list failed: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.filter((e) => e.type === 'file' && e.name.endsWith('.json')).map((e) => e.name)
}

async function fetchRemoteJson(name) {
  const url = `https://raw.githubusercontent.com/${REPO}/${REF}/content/updates/${name}`
  const res = await fetch(url, { headers: githubRequestHeaders() })
  if (!res.ok) throw new Error(`fetch ${name}: ${res.status}`)
  return res.text()
}

async function importFromLocalDir(srcDir) {
  const files = readdirSync(srcDir)
    .filter((f) => f.endsWith('.json'))
    .sort()
  const imported = []
  const failed = []
  for (const name of files) {
    try {
      const text = readFileSync(path.join(srcDir, name), 'utf8')
      writeFileSync(path.join(outDir, name), `${JSON.stringify(JSON.parse(text), null, 2)}\n`)
      imported.push(name.replace(/\.json$/, ''))
    } catch (err) {
      failed.push({ file: name, reason: String(err) })
    }
  }
  return { imported, failed }
}

async function importFromRemote() {
  const files = await listRemoteFiles()
  const imported = []
  const failed = []
  for (const name of files) {
    try {
      const text = await fetchRemoteJson(name)
      JSON.parse(text)
      writeFileSync(path.join(outDir, name), `${JSON.stringify(JSON.parse(text), null, 2)}\n`)
      imported.push(name.replace(/\.json$/, ''))
    } catch (err) {
      failed.push({ file: name, reason: String(err) })
    }
  }
  return { imported, failed }
}

async function main() {
  mkdirSync(outDir, { recursive: true })
  const committed = listCommittedPostDates(outDir)

  let imported = []
  let failed = []
  let remoteFailed = false
  let remoteError = null
  let source = LOCAL_SRC ?? `https://github.com/${REPO}/tree/${REF}/content/updates`

  if (LOCAL_SRC && existsSync(LOCAL_SRC)) {
    ;({ imported, failed } = await importFromLocalDir(LOCAL_SRC))
  } else {
    try {
      ;({ imported, failed } = await importFromRemote())
    } catch (err) {
      remoteFailed = true
      remoteError = err instanceof Error ? err.message : String(err)
      console.warn(`daily-pulse import failed; using ${committed.length} committed blog post(s)`)
      console.warn(remoteError)
      imported = [...committed]
      source = `committed fallback (${source})`
    }
  }

  if (imported.length === 0 && committed.length > 0) {
    imported = [...committed]
    remoteFailed = true
  }

  const manifest = {
    importedAt: new Date().toISOString(),
    source,
    postCount: imported.length,
    dates: [...imported].sort(),
    failed,
    remoteFailed,
    remoteError,
  }
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`imported ${imported.length} posts to site/content/blog/updates`)

  if (failed.length) console.warn('partial import failures:', failed)

  if (shouldFailBlogImport({ importedCount: imported.length, committedCount: committed.length, remoteFailed })) {
    console.error('no blog posts available to build')
    process.exit(1)
  }
}

main()