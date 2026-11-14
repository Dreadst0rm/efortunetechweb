import { expect, test } from '@playwright/test'

const WIDTHS = [320, 360, 375, 390, 414, 480] as const
const HEIGHTS = [568, 667, 740] as const

type Box = { x: number; y: number; width: number; height: number }

function overlaps(a: Box, b: Box): boolean {
  if (!a.width || !b.width) return false
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  )
}

function toBox(raw: { x: number; y: number; width: number; height: number } | null): Box | null {
  return raw && raw.width > 0 && raw.height > 0 ? raw : null
}

for (const width of WIDTHS) {
  for (const height of HEIGHTS) {
    test(`mobile display options at ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')
      await page.waitForSelector('.bp-site-prefs__toggle')

      const header = toBox(await page.locator('header.site-nav').boundingBox())
      const kicker = toBox(await page.locator('.bp-kicker').boundingBox())
      expect(header).toBeTruthy()
      expect(kicker).toBeTruthy()
      expect(kicker!.y).toBeGreaterThanOrEqual(header!.y + header!.height - 1)

      await page.evaluate(() => window.scrollTo(0, 0))

      const toggle = toBox(await page.locator('.bp-site-prefs__toggle').boundingBox())
      expect(toggle).toBeTruthy()
      expect(toggle!.width).toBeGreaterThanOrEqual(44)
      expect(toggle!.height).toBeGreaterThanOrEqual(44)
      expect(toggle!.y + toggle!.height).toBeLessThanOrEqual(height + 1)

      const primary = toBox(await page.locator('a.bp-hero__btn--primary').boundingBox())
      const secondary = toBox(await page.locator('a.bp-hero__btn--secondary').boundingBox())
      const sub = toBox(await page.locator('.bp-sub').boundingBox())
      const linkedIn = toBox(await page.locator('.bp-hero__track a').boundingBox())

      if (primary) expect(overlaps(toggle!, primary), 'toggle vs primary CTA').toBe(false)
      if (secondary) expect(overlaps(toggle!, secondary), 'toggle vs secondary CTA').toBe(false)
      if (sub) expect(overlaps(toggle!, sub), 'toggle vs subhead').toBe(false)
      if (linkedIn) expect(overlaps(toggle!, linkedIn), 'toggle vs LinkedIn').toBe(false)

      await page.locator('.bp-site-prefs__toggle').click()
      await expect(page.locator('.bp-site-prefs')).toHaveClass(/bp-site-prefs--open/)

      const panel = toBox(await page.locator('.bp-site-prefs__panel').boundingBox())
      expect(panel).toBeTruthy()
      expect(panel!.y).toBeGreaterThanOrEqual(0)
      expect(panel!.x).toBeGreaterThanOrEqual(0)
      expect(panel!.x + panel!.width).toBeLessThanOrEqual(width + 1)
      expect(panel!.y + panel!.height).toBeLessThanOrEqual(height + 1)

      await page.locator('.bp-site-prefs__btn--palette').click()
      const palettePanel = page.locator('.bp-site-prefs__palette-panel')
      await expect(palettePanel).toBeVisible()

      const swatches = palettePanel.locator('.bp-site-prefs__swatch')
      const swatchCount = await swatches.count()
      expect(swatchCount).toBeGreaterThanOrEqual(4)
      for (let i = 0; i < swatchCount; i++) {
        const sw = toBox(await swatches.nth(i).boundingBox())
        expect(sw, `swatch ${i} visible`).toBeTruthy()
        expect(sw!.y).toBeGreaterThanOrEqual(0)
        expect(sw!.x).toBeGreaterThanOrEqual(0)
        expect(sw!.x + sw!.width).toBeLessThanOrEqual(width + 1)
        expect(sw!.y + sw!.height).toBeLessThanOrEqual(height + 1)
        await swatches.nth(i).click({ trial: true })
      }

      const meshBtn = page.locator('.bp-site-prefs__btn[data-bg-opt="mesh"]')
      const meshBox = toBox(await meshBtn.boundingBox())
      if (meshBox) {
        expect(meshBox.width).toBeGreaterThanOrEqual(24)
        expect(meshBox.height).toBeGreaterThanOrEqual(24)
        await meshBtn.click({ trial: true })
      }
    })
  }
}