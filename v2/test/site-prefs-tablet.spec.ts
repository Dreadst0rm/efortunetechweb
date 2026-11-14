import { expect, test } from '@playwright/test'

test('1024x768 keeps desktop hero title scale and centered frame', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto('/')
  await page.waitForSelector('.bp-title')

  const titleSize = await page.locator('.bp-title').evaluate((el) =>
    parseFloat(getComputedStyle(el).fontSize),
  )
  expect(titleSize, 'title should use desktop clamp, not phone 1.35rem cap').toBeGreaterThan(28)

  const heroTextAlign = await page.locator('.bp-hero').evaluate((el) => getComputedStyle(el).textAlign)
  expect(heroTextAlign).toBe('center')

  const frame = await page.locator('.bp-title-frame').boundingBox()
  expect(frame).toBeTruthy()
  const frameCenter = frame!.x + frame!.width / 2
  expect(Math.abs(frameCenter - 512), 'title frame centered in viewport').toBeLessThan(24)
})

test('1024x768 uses collapsed FAB prefs (not full-width desktop pill bar)', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto('/')
  await expect(page.locator('.bp-site-prefs__toggle')).toBeVisible()
})