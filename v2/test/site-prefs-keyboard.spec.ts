import { expect, test } from '@playwright/test'

test('mobile prefs tab order moves forward through panel controls', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.waitForSelector('.bp-site-prefs__toggle')

  await page.locator('.bp-site-prefs__toggle').focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.bp-site-prefs')).toHaveClass(/bp-site-prefs--open/)

  await expect(page.locator('.bp-site-prefs__btn--fill')).toBeFocused()

  await page.keyboard.press('Tab')
  const afterTab = await page.evaluate(() => {
    const el = document.activeElement
    return el && el instanceof HTMLElement
      ? { className: el.className, id: el.id, tag: el.tagName }
      : null
  })
  expect(afterTab?.className).toContain('bp-site-prefs__btn--palette')
})

test('outside tap on focusable target keeps focus on that target', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.locator('.bp-site-prefs__toggle').click()
  await expect(page.locator('.bp-site-prefs')).toHaveClass(/bp-site-prefs--open/)

  const navLink = page.locator('.site-nav__links a').first()
  await navLink.click()
  await expect(page.locator('.bp-site-prefs')).not.toHaveClass(/bp-site-prefs--open/)
  const focusStolenByToggle = await page.evaluate(
    () => document.activeElement?.classList.contains('bp-site-prefs__toggle') === true,
  )
  expect(focusStolenByToggle, 'outside tap should not force focus back to toggle').toBe(false)
})