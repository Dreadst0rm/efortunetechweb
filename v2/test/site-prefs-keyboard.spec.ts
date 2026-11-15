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

  await page.keyboard.press('Shift+Tab')
  await expect(page.locator('.bp-site-prefs__btn--fill')).toBeFocused()

  await page.locator('.bp-site-prefs__toggle').focus()
  await page.keyboard.press('Shift+Tab')
  await expect(page.locator('.bp-site-prefs')).not.toHaveClass(/bp-site-prefs--open/)
  const notToggle = await page.evaluate(
    () => !(document.activeElement instanceof HTMLElement) ||
      !document.activeElement.classList.contains('bp-site-prefs__toggle'),
  )
  expect(notToggle).toBe(true)

  await page.locator('.bp-site-prefs__toggle').focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.bp-site-prefs')).toHaveClass(/bp-site-prefs--open/)

  await page.keyboard.press('Escape')
  await expect(page.locator('.bp-site-prefs')).not.toHaveClass(/bp-site-prefs--open/)
  await expect(page.locator('.bp-site-prefs__toggle')).toBeFocused()
})

test('outside tap on non-navigating control keeps focus there', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/contact.html')
  await page.locator('.bp-site-prefs__toggle').click()
  await expect(page.locator('.bp-site-prefs')).toHaveClass(/bp-site-prefs--open/)

  const name = page.locator('input[name="name"]')
  await name.click()
  await expect(page.locator('.bp-site-prefs')).not.toHaveClass(/bp-site-prefs--open/)
  await expect(name).toBeFocused()
})