import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = process.env.SCREENSHOT_DIR || '/opt/cursor/artifacts/quarterly-initiative-heroes'
const baseUrl = process.env.SCREENSHOT_BASE || 'http://127.0.0.1:4317'

const shots = [
  { page: 'home', path: '/index.html', viewport: 'desktop' },
  { page: 'home', path: '/index.html', viewport: 'mobile' },
  { page: 'quarterly-initiative', path: '/quarterly-initiative', viewport: 'desktop' },
  { page: 'quarterly-initiative', path: '/quarterly-initiative', viewport: 'mobile' },
]

const themes = ['light', 'dark']

mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    localStorage.setItem('efortune-theme', t)
    document.documentElement.setAttribute('data-theme', t)
  }, theme)
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(150)
}

for (const shot of shots) {
  const size =
    shot.viewport === 'desktop'
      ? { width: 1280, height: 900 }
      : { width: 390, height: 844 }
  const context = await browser.newContext({ viewport: size })
  const page = await context.newPage()
  await page.goto(`${baseUrl}${shot.path}`, { waitUntil: 'networkidle' })

  for (const theme of themes) {
    await setTheme(page, theme)
    const hero = page.locator('.bp-hero').first()
    await hero.waitFor({ state: 'visible' })
    const file = path.join(
      outDir,
      `${shot.page}-${shot.viewport}-${theme}.png`,
    )
    await hero.screenshot({ path: file })
    console.log('wrote', file)
  }

  await context.close()
}

await browser.close()