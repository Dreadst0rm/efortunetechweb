import { expect, test, type Page } from '@playwright/test'

async function waitForBlogFilters(page: Page) {
  await page.goto('/blog/')
  await page.waitForSelector('.bp-digest-filters__status')
}

async function visibleCardCount(page: Page) {
  return page.locator('[data-digest-date]').evaluateAll((cards) =>
    cards.filter((el) => {
      const html = el as HTMLElement
      return !html.hidden && window.getComputedStyle(html).display !== 'none'
    }).length,
  )
}

async function expectCardHidden(page: Page, date: string) {
  const card = page.locator(`[data-digest-date="${date}"]`)
  await expect(card).toBeHidden()
  const display = await card.evaluate((el) => window.getComputedStyle(el).display)
  expect(display).toBe('none')
}

test.describe('blog filters', () => {
  test('hides non-matching cards on search', async ({ page }) => {
    await waitForBlogFilters(page)
    const total = await page.locator('[data-digest-date]').count()
    await page.getByPlaceholder('Title or summary').fill('zzzz-no-match')
    await expect(page.getByText('Showing 0 of')).toBeVisible()
    expect(await visibleCardCount(page)).toBe(0)
    await expect(page.locator('#blog-filter-empty')).toBeVisible()
    await expect(page.locator('[data-digest-section="latest"]')).toBeHidden()
    await expect(page.locator('[data-digest-section="archive"]')).toBeHidden()
    await page.getByPlaceholder('Title or summary').fill('')
    await expect(page.getByText(`Showing ${total} of ${total}`)).toBeVisible()
  })

  test('AI topic chip narrows the list', async ({ page }) => {
    await waitForBlogFilters(page)
    const total = await page.locator('[data-digest-date]').count()
    await page.getByRole('button', { name: 'ai', exact: true }).click()
    const status = page.locator('.bp-digest-filters__status')
    const text = await status.textContent()
    const shown = Number(text?.match(/Showing (\d+)/)?.[1] ?? '0')
    expect(shown).toBeGreaterThan(0)
    expect(shown).toBeLessThan(total)
    await expect.poll(() => visibleCardCount(page)).toBe(shown)
  })

  test('security topic hides unrelated posts', async ({ page }) => {
    await waitForBlogFilters(page)
    await page.getByRole('button', { name: 'security', exact: true }).click()
    await expect.poll(() => visibleCardCount(page)).toBeGreaterThan(0)
    await expectCardHidden(page, '2026-09-11')
  })

  test('clear filters restores all posts', async ({ page }) => {
    await waitForBlogFilters(page)
    const total = await page.locator('[data-digest-date]').count()
    await page.getByPlaceholder('Title or summary').fill('zzzz-no-match')
    await expect(page.getByText('Showing 0 of')).toBeVisible()
    await page.locator('.bp-digest-filters .bp-digest-filters__clear').click()
    await expect(page.getByText(`Showing ${total} of ${total}`)).toBeVisible()
    await expect.poll(() => visibleCardCount(page)).toBe(total)
  })

  test('empty-state clear link resets filters', async ({ page }) => {
    await waitForBlogFilters(page)
    const total = await page.locator('[data-digest-date]').count()
    await page.getByPlaceholder('Title or summary').fill('zzzz-no-match')
    await page.locator('#blog-filter-empty-clear').click()
    await expect(page.getByText(`Showing ${total} of ${total}`)).toBeVisible()
  })

  test('back from topic filter restores unfiltered blog', async ({ page }) => {
    await waitForBlogFilters(page)
    const total = await page.locator('[data-digest-date]').count()
    await page.getByRole('button', { name: 'ai', exact: true }).click()
    await expect.poll(() => visibleCardCount(page)).toBeLessThan(total)
    await expect(page).toHaveURL(/\?topic=ai/)
    await page.goBack()
    await expect(page).not.toHaveURL(/topic=/)
    await expect.poll(() => visibleCardCount(page)).toBe(total)
    await expect(page.getByText(`Showing ${total} of ${total}`)).toBeVisible()
  })

  test('back steps through consecutive topic filters', async ({ page }) => {
    await waitForBlogFilters(page)
    const total = await page.locator('[data-digest-date]').count()
    await page.getByRole('button', { name: 'ai', exact: true }).click()
    await expect.poll(() => visibleCardCount(page)).toBeLessThan(total)
    const aiVisible = await visibleCardCount(page)
    await page.getByRole('button', { name: 'security', exact: true }).click()
    await expect.poll(() => visibleCardCount(page)).not.toBe(aiVisible)
    await expect(page).toHaveURL(/topic=/)
    await page.goBack()
    await expect(page).toHaveURL(/\?topic=ai/)
    await expect.poll(() => visibleCardCount(page)).toBe(aiVisible)
    await page.goBack()
    await expect(page).not.toHaveURL(/topic=/)
    await expect.poll(() => visibleCardCount(page)).toBe(total)
  })

  test('shared filtered URL does not push duplicate history on load', async ({ page }) => {
    await page.goto('/blog/?topic=ai')
    await page.waitForSelector('.bp-digest-filters__status')
    const lenAfterLoad = await page.evaluate(() => history.length)
    await page.waitForTimeout(400)
    const lenAfterHydrate = await page.evaluate(() => history.length)
    expect(lenAfterHydrate).toBe(lenAfterLoad)
    await expect(page).toHaveURL(/\?topic=ai/)
    const total = await page.locator('[data-digest-date]').count()
    await expect.poll(() => visibleCardCount(page)).toBeLessThan(total)
  })

  test('browser back and forward restore filter state', async ({ page }) => {
    await waitForBlogFilters(page)
    await page.getByRole('button', { name: 'security', exact: true }).click()
    await expect.poll(() => visibleCardCount(page)).toBeGreaterThan(0)
    const afterTopic = await page.locator('.bp-digest-filters__status').textContent()
    await page.getByPlaceholder('Title or summary').fill('cloud')
    await page.waitForTimeout(200)
    const afterSearch = await page.locator('.bp-digest-filters__status').textContent()
    expect(afterSearch).not.toBe(afterTopic)
    await page.goBack()
    await expect(page.locator('.bp-digest-filters__status')).toHaveText(afterTopic ?? '', {
      timeout: 10_000,
    })
    await page.goForward()
    await expect(page.locator('.bp-digest-filters__status')).toHaveText(afterSearch ?? '', {
      timeout: 10_000,
    })
  })

  test('layout at 320px leaves site prefs pill unobstructed', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 })
    await waitForBlogFilters(page)
    await page.getByRole('button', { name: 'ai', exact: true }).click()
    const toggle = page.locator('.bp-site-prefs__toggle')
    await expect(toggle).toBeVisible()
    const uncovered = await toggle.evaluate((pill) => {
      const r = pill.getBoundingClientRect()
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      return top === pill || pill.contains(top)
    })
    expect(uncovered).toBe(true)
  })
})