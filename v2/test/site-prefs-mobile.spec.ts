import { expect, test } from '@playwright/test'

const WIDTHS = [320, 360, 375, 390, 480] as const

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
  test(`site prefs pill and panel at ${width}x740`, async ({ page }) => {
    await page.setViewportSize({ width, height: 740 })
    await page.goto('/')
    await page.waitForSelector('.bp-site-prefs')

    const pill = toBox(await page.locator('.bp-site-prefs').boundingBox())
    expect(pill).toBeTruthy()
    expect(pill!.y + pill!.height).toBeGreaterThan(640)

    const heroCta = toBox(await page.locator('a.bp-hero__btn--primary').boundingBox())
    const navCta = toBox(await page.locator('.site-nav__cta').boundingBox())
    if (heroCta) expect(overlaps(pill!, heroCta), 'pill vs hero CTA').toBe(false)
    if (navCta) expect(overlaps(pill!, navCta), 'pill vs nav Contact').toBe(false)

    const navLinks = page.locator('.site-nav__links a')
    const linkCount = await navLinks.count()
    for (let i = 0; i < linkCount; i++) {
      const linkBox = toBox(await navLinks.nth(i).boundingBox())
      if (linkBox) expect(overlaps(pill!, linkBox), `pill vs nav link ${i}`).toBe(false)
    }

    await page.locator('.bp-site-prefs__btn--palette').click()
    const panel = page.locator('.bp-site-prefs__palette-panel')
    await expect(panel).toBeVisible()

    const panelBox = toBox(await panel.boundingBox())
    expect(panelBox).toBeTruthy()
    expect(panelBox!.y).toBeGreaterThanOrEqual(0)
    expect(panelBox!.y + panelBox!.height).toBeLessThanOrEqual(740 + 1)

    const swatches = panel.locator('.bp-site-prefs__swatch')
    const swatchCount = await swatches.count()
    expect(swatchCount).toBeGreaterThanOrEqual(4)
    for (let i = 0; i < swatchCount; i++) {
      const sw = toBox(await swatches.nth(i).boundingBox())
      expect(sw, `swatch ${i} visible`).toBeTruthy()
      expect(sw!.y).toBeGreaterThanOrEqual(0)
      expect(sw!.x).toBeGreaterThanOrEqual(0)
      expect(sw!.x + sw!.width).toBeLessThanOrEqual(width + 1)
      expect(sw!.y + sw!.height).toBeLessThanOrEqual(740 + 1)
    }

    const meshBtn = page.locator('.bp-site-prefs__btn[data-bg-opt="mesh"]')
    const meshBox = toBox(await meshBtn.boundingBox())
    if (meshBox) {
      expect(meshBox.width).toBeGreaterThanOrEqual(24)
      expect(meshBox.height).toBeGreaterThanOrEqual(24)
    }
  })
}