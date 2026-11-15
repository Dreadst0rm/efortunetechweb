import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const outDir = process.env.SCREENSHOT_DIR || '/opt/cursor/artifacts/palette-screenshots'
const baseUrl = process.env.SCREENSHOT_BASE || 'http://127.0.0.1:8787'

const ids = [
  'default',
  'swiss',
  'broadsheet',
  'brutalist',
  'aurora-glass',
  'acid-glitch',
  'air-minimal',
  'synthwave',
  'mono-ink',
  'clay-warm',
  'pixel-arcade',
  'neon-sunrise',
  'terminal',
  'blueprint',
]

const pages = [
  { name: 'home', path: '/index.html' },
  { name: 'contact', path: '/contact.html' },
]

mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })

for (const id of ids) {
  for (const pg of pages) {
    const page = await context.newPage()
    await page.goto(`${baseUrl}${pg.path}`, { waitUntil: 'networkidle' })
    await page.evaluate((paletteId) => {
      const themeKey = 'efortune-theme'
      const paletteKey = 'efortune-palette'
      const catalog = window.EFORTUNE_PALETTES || {}
      if (paletteId === 'default') {
        localStorage.removeItem(paletteKey)
        document.documentElement.removeAttribute('data-palette')
        const t = localStorage.getItem(themeKey) || 'light'
        document.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light')
      } else {
        localStorage.setItem(paletteKey, paletteId)
        const meta = catalog[paletteId]
        document.documentElement.setAttribute('data-palette', paletteId)
        if (meta && meta.mode) document.documentElement.setAttribute('data-theme', meta.mode)
      }
    }, id)
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(200)
    const file = path.join(outDir, `${pg.name}-${id}.png`)
    await page.screenshot({ path: file, fullPage: false })
    await page.close()
    console.log('wrote', file)
  }
}

await browser.close()