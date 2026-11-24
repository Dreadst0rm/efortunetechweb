import { beforeEach, describe, expect, it } from 'vitest'
import { applyDigestVisibility } from './blogFilterDom'

function card(display: string) {
  const el = document.createElement('a')
  el.className = 'bp-digest__card'
  el.href = '/blog/updates/' + display + '/'
  el.setAttribute('data-digest-date', display)
  return el
}

describe('applyDigestVisibility', () => {
  beforeEach(() => {
    const style = document.createElement('style')
    style.textContent = `
      .bp-digest__card { display: block; }
      .bp-digest__card[hidden],
      .bp-digest__section[hidden] { display: none; }
    `
    document.head.appendChild(style)

    document.body.innerHTML = `
      <article class="bp-digest">
        <div id="blog-filter-empty" hidden></div>
        <section data-digest-section="latest">
          <h2>Latest</h2>
        </section>
        <section data-digest-section="archive">
          <h2>Archive</h2>
          <ol><li id="archive-slot"></li></ol>
        </section>
      </article>
    `
    const latest = document.querySelector('[data-digest-section="latest"]')!
    const archiveSlot = document.getElementById('archive-slot')!
    latest.append(card('2026-11-01'))
    archiveSlot.append(card('2026-10-01'))
    const li = document.createElement('li')
    li.append(card('2026-09-01'))
    archiveSlot.parentElement!.append(li)
  })

  it('sets hidden on filtered-out cards so display becomes none', () => {
    applyDigestVisibility(document, new Set(['2026-10-01']))
    const hidden = document.querySelector('[data-digest-date="2026-11-01"]') as HTMLElement
    const visible = document.querySelector('[data-digest-date="2026-10-01"]') as HTMLElement
    expect(hidden.hidden).toBe(true)
    expect(window.getComputedStyle(hidden).display).toBe('none')
    expect(visible.hidden).toBe(false)
    expect(window.getComputedStyle(visible).display).not.toBe('none')
  })

  it('hides empty sections and shows empty state when nothing matches', () => {
    const result = applyDigestVisibility(document, new Set())
    const latest = document.querySelector('[data-digest-section="latest"]') as HTMLElement
    const archive = document.querySelector('[data-digest-section="archive"]') as HTMLElement
    const empty = document.getElementById('blog-filter-empty') as HTMLElement
    expect(result.visibleCount).toBe(0)
    expect(result.emptyShown).toBe(true)
    expect(latest.hidden).toBe(true)
    expect(archive.hidden).toBe(true)
    expect(empty.hidden).toBe(false)
  })
})