import { expect, test } from '@playwright/test'

test('panel padding click keeps mobile prefs open', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.locator('.bp-site-prefs__toggle').click()
  await expect(page.locator('.bp-site-prefs')).toHaveClass(/bp-site-prefs--open/)

  const panel = page.locator('.bp-site-prefs__panel')
  const box = await panel.boundingBox()
  expect(box).toBeTruthy()
  await page.mouse.click(box!.x + 4, box!.y + box!.height / 2)
  await expect(page.locator('.bp-site-prefs')).toHaveClass(/bp-site-prefs--open/)
})

test('Safari-like mousedown without focus still applies mesh and palette', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.locator('.bp-site-prefs__toggle').click()
  await expect(page.locator('.bp-site-prefs')).toHaveClass(/bp-site-prefs--open/)

  await page.evaluate(() => {
    document.querySelectorAll('.bp-site-prefs button').forEach((btn) => {
      btn.addEventListener(
        'mousedown',
        (ev) => {
          ev.preventDefault()
        },
        { capture: true },
      )
    })
  })

  const mesh = page.locator('.bp-site-prefs__btn[data-bg-opt="mesh"]')
  await mesh.click()
  await expect(page.locator('html')).toHaveAttribute('data-bg', 'mesh')
  await expect(page.locator('.bp-site-prefs')).toHaveClass(/bp-site-prefs--open/)

  await page.locator('.bp-site-prefs__btn--palette').click()
  const swatch = page.locator('.bp-site-prefs__swatch[data-palette-opt="swiss"]')
  await swatch.click()
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'swiss')
  await expect(page.locator('.bp-site-prefs')).toHaveClass(/bp-site-prefs--open/)
})

test('Tab past last panel control closes mobile prefs', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.locator('.bp-site-prefs__toggle').focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.bp-site-prefs')).toHaveClass(/bp-site-prefs--open/)

  await expect(page.locator('.bp-site-prefs__btn--fill')).toBeFocused()
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Tab')
  }
  await expect(page.locator('.bp-site-prefs')).not.toHaveClass(/bp-site-prefs--open/)
  await expect(page.locator('.bp-site-prefs__toggle')).toBeFocused()
})

test('keyboard swatch selection keeps focus on swatch until panel closes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.locator('.bp-site-prefs__toggle').focus()
  await page.keyboard.press('Enter')
  await page.locator('.bp-site-prefs__btn--palette').focus()
  await page.keyboard.press('Enter')
  const swatch = page.locator('.bp-site-prefs__swatch[data-palette-opt="terminal"]')
  await swatch.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'terminal')
  await expect(page.locator('.bp-site-prefs')).toHaveClass(/bp-site-prefs--open/)
  await expect(swatch).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(page.locator('.bp-site-prefs')).not.toHaveClass(/bp-site-prefs--open/)
  await expect(page.locator('.bp-site-prefs__toggle')).toBeFocused()
})