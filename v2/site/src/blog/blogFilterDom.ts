/** DOM helpers for blog index filter visibility — keep in sync with BlogIndexPage markup. */

export const DIGEST_CARD_SELECTOR = '[data-digest-date]'
export const DIGEST_SECTION_LATEST = '[data-digest-section="latest"]'
export const DIGEST_SECTION_ARCHIVE = '[data-digest-section="archive"]'
export const DIGEST_EMPTY_ID = 'blog-filter-empty'

export type DigestVisibilityResult = {
  visibleCount: number
  latestSectionHidden: boolean
  archiveSectionHidden: boolean
  emptyShown: boolean
}

export function applyDigestVisibility(
  root: ParentNode,
  visibleDates: Set<string>,
): DigestVisibilityResult {
  const cards = root.querySelectorAll<HTMLElement>(DIGEST_CARD_SELECTOR)
  let visibleCount = 0
  for (const el of cards) {
    const date = el.getAttribute('data-digest-date')
    if (!date) continue
    const show = visibleDates.has(date)
    el.hidden = !show
    if (show) visibleCount++
  }

  const latestSection = root.querySelector<HTMLElement>(DIGEST_SECTION_LATEST)
  const archiveSection = root.querySelector<HTMLElement>(DIGEST_SECTION_ARCHIVE)
  const featured = latestSection?.querySelector<HTMLElement>(DIGEST_CARD_SELECTOR)

  const latestSectionHidden = !featured || featured.hidden
  if (latestSection) latestSection.hidden = latestSectionHidden

  let archiveSectionHidden = true
  if (archiveSection) {
    const archiveCards = archiveSection.querySelectorAll<HTMLElement>(DIGEST_CARD_SELECTOR)
    archiveSectionHidden = ![...archiveCards].some((c) => !c.hidden)
    archiveSection.hidden = archiveSectionHidden
  }

  const emptyEl = root.querySelector<HTMLElement>(`#${DIGEST_EMPTY_ID}`)
  const emptyShown = visibleCount === 0
  if (emptyEl) emptyEl.hidden = !emptyShown

  return {
    visibleCount,
    latestSectionHidden,
    archiveSectionHidden,
    emptyShown,
  }
}