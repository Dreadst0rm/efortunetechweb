/**
 * Import blog posts from Dreadst0rm/daily-pulse (content/updates/*.json).
 * Run before build: npm run import:blog
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'site', 'content', 'blog', 'updates')
const manifestPath = path.join(root, 'site', 'content', 'blog', 'import-manifest.json')

const REPO = process.env.DAILY_PULSE_REPO ?? 'Dreadst0rm/daily-pulse'
const REF = process.env.DAILY_PULSE_REF ?? 'main'
const LOCAL_SRC = process.env.DAILY_PULSE_DIR

async function listRemoteFiles() {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/content/updates?ref=${REF}`,
    { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'efortune-site-import' } },
  )
  if (!res.ok) throw new Error(`GitHub list failed: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.filter((e) => e.type === 'file' && e.name.endsWith('.json')).map((e) => e.name)
}

async function fetchRemoteJson(name) {
  const url = `https://raw.githubusercontent.com/${REPO}/${REF}/content/updates/${name}`
  const res = await fetch(url, { headers: { 'User-Agent': 'efortune-site-import' } })
  if (!res.ok) throw new Error(`fetch ${name}: ${res.status}`)
  return res.text()
}

function listLocalFiles(dir) {
  return import('node:fs').then(({ readdirSync }) =>
    readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .sort(),
  )
}

async function main() {
  mkdirSync(outDir, { recursive: true })
  let files
  const failed = []
  const imported = []

  if (LOCAL_SRC && existsSync(LOCAL_SRC)) {
    files = await listLocalFiles(LOCAL_SRC)
    for (const name of files) {
      const text = readFileSync(path.join(LOCAL_SRC, name), 'utf8')
      writeFileSync(path.join(outDir, name), `${JSON.stringify(JSON.parse(text), null, 2)}\n`)
      imported.push(name.replace(/\.json$/, ''))
    }
  } else {
    files = await listRemoteFiles()
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
  }

  const manifest = {
    importedAt: new Date().toISOString(),
    source: LOCAL_SRC ?? `https://github.com/${REPO}/tree/${REF}/content/updates`,
    postCount: imported.length,
    dates: imported.sort(),
    failed,
  }
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`imported ${imported.length} posts to site/content/blog/updates`)
  if (failed.length) {
    console.warn('failed:', failed)
    process.exitCode = 1
  }
}

main()