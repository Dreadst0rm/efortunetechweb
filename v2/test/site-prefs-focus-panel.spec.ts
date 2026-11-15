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

test('Safari-like focusout with null relatedTarget after mesh tap keeps panel open', async ({
  page,
  browserName,
}) => {
  test.skip(browserName === 'webkit', 'covered by webkit project without synthetic focusout')

  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.locator('.bp-site-prefs__toggle').click()
  await expect(page.locator('.bp-site-prefs')).toHaveClass(/bp-site-prefs--open/)

  const mesh = page.locator('.bp-site-prefs__btn[data-bg-opt="mesh"]')
  await mesh.click()
  await expect(page.locator('html')).toHaveAttribute('data-bg', 'mesh')

  await mesh.evaluate((el) => {
    el.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }))
  })
  await page.waitForTimeout(0)
  await expect(page.locator('.bp-site-prefs')).toHaveClass(/bp-site-prefs--open/)
})

test.describe('webkit', () => {
  test.skip(({ browserName }) => browserName !== 'webkit')

  test('tap mesh without focus keeps panel open (webkit)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.locator('.bp-site-prefs__toggle').click()
    await expect(page.locator('.bp-site-prefs')).toHaveClass(/bp-site-prefs--open/)

    await page.evaluate(() => {
      document.querySelectorAll('.bp-site-prefs button').forEach((btn) => {
        btn.addEventListener('mousedown', (ev) => ev.preventDefault(), { capture: true })
      })
    })

    await page.locator('.bp-site-prefs__btn[data-bg-opt="mesh"]').click()
    await expect(page.locator('html')).toHaveAttribute('data-bg', 'mesh')
    await expect(page.locator('.bp-site-prefs')).toHaveClass(/bp-site-prefs--open/)
  })
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
  const outside = await page.evaluate(() => {
    const el = document.activeElement
    return el instanceof HTMLElement ? !el.closest('.bp-site-prefs') : true
  })
  expect(outside).toBe(true)
})

test('mesh tap then keyboard tab closes stale-open panel', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.locator('.bp-site-prefs__toggle').click()
  await expect(page.locator('.bp-site-prefs')).toHaveClass(/bp-site-prefs--open/)

  await page.locator('.bp-site-prefs__btn[data-bg-opt="mesh"]').click()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await expect(page.locator('.bp-site-prefs')).not.toHaveClass(/bp-site-prefs--open/)
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