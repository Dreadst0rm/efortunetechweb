import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

function luminance(hex: string): number {
  const h = hex.replace(/^#/, '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = luminance(fg)
  const l2 = luminance(bg)
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}

function parseCssBlock(css: string, selector: string): Record<string, string> {
  const re = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]+)\\}`)
  const match = re.exec(css)
  if (!match) throw new Error(`missing block: ${selector}`)
  const tokens: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const m = /--color-([\w-]+):\s*([^;]+);/.exec(line)
    if (m) tokens[m[1]] = m[2].trim()
  }
  return tokens
}

function parsePaletteBlock(css: string, id: string): Record<string, string> {
  const re = new RegExp(`html\\[data-palette='${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'\\]\\s*\\{([^}]+)\\}`)
  const match = re.exec(css)
  if (!match) throw new Error(`missing palette block: ${id}`)
  const tokens: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const m = /--color-([\w-]+):\s*([^;]+);/.exec(line)
    if (m) tokens[m[1]] = m[2].trim()
  }
  return tokens
}

const paletteContrast: Record<string, [string, string][]> = {
  swiss: [
    ['#111111', '#fafafa'],
    ['#6b6b6b', '#fafafa'],
    ['#c41e12', '#fafafa'],
    ['#ffffff', '#c41e12'],
  ],
  broadsheet: [
    ['#201a12', '#f6f1e7'],
    ['#6d6353', '#f6f1e7'],
    ['#701611', '#f6f1e7'],
    ['#ffffff', '#701611'],
  ],
  brutalist: [
    ['#0a0a0a', '#f4f1e8'],
    ['#4a4a4a', '#f4f1e8'],
    ['#6b5200', '#f4f1e8'],
    ['#0a0a0a', '#ffd60a'],
  ],
  'aurora-glass': [
    ['#eef2ff', '#070b18'],
    ['#93a0c4', '#070b18'],
    ['#7dd3fc', '#070b18'],
    ['#04121f', '#0284c7'],
  ],
  'acid-glitch': [
    ['#f7ecff', '#0b0011'],
    ['#b795cf', '#0b0011'],
    ['#ff5ce5', '#0b0011'],
    ['#ffffff', '#9d007f'],
  ],
  'air-minimal': [
    ['#1d1d1f', '#ffffff'],
    ['#6e6e73', '#ffffff'],
    ['#3730a3', '#ffffff'],
    ['#ffffff', '#4338ca'],
  ],
  synthwave: [
    ['#fdf2ff', '#150b30'],
    ['#c9a8ec', '#150b30'],
    ['#f9a8e8', '#150b30'],
    ['#ffffff', '#be185d'],
  ],
  'mono-ink': [
    ['#000000', '#ffffff'],
    ['#555555', '#ffffff'],
    ['#ffffff', '#000000'],
  ],
  'clay-warm': [
    ['#3b2a20', '#f7efe6'],
    ['#6d5648', '#f7efe6'],
    ['#8c3a22', '#f7efe6'],
    ['#fff7f2', '#8c3a22'],
  ],
  'pixel-arcade': [
    ['#d9f7e8', '#101418'],
    ['#7fa392', '#101418'],
    ['#3ddc84', '#101418'],
    ['#ffffff', '#166534'],
  ],
  'neon-sunrise': [
    ['#e8eaf6', '#141033'],
    ['#a8b0d8', '#141033'],
    ['#ffd166', '#141033'],
    ['#141033', '#b8860b'],
  ],
  terminal: [
    ['#7dffb0', '#050505'],
    ['#4d9f6a', '#050505'],
    ['#33ff66', '#050505'],
    ['#ffffff', '#166534'],
  ],
  blueprint: [
    ['#e8f4ff', '#0a1628'],
    ['#7a9bb8', '#0a1628'],
    ['#59f2ff', '#0a1628'],
    ['#0a1628', '#0891b2'],
  ],
}

describe('remix palettes', () => {
  it('loads palette catalog before site-init in built HTML', () => {
    const index = readFileSync(path.join(dist, 'index.html'), 'utf8')
    expect(index).toMatch(/palette-catalog\.js/)
    expect(index.indexOf('palette-catalog.js')).toBeLessThan(index.indexOf('site-init.js'))
  })

  it('defines a CSS block for every catalog palette except default', () => {
    const catalogSrc = readFileSync(path.join(root, 'public/js/palette-catalog.js'), 'utf8')
    const css = readFileSync(path.join(root, 'site/src/styles/palettes.css'), 'utf8')
    const idRe = /id:\s*'([^']+)'/g
    const ids = new Set<string>()
    let m: RegExpExecArray | null
    while ((m = idRe.exec(catalogSrc))) {
      ids.add(m[1])
    }
    expect(ids.size).toBeGreaterThanOrEqual(14)
    for (const id of ids) {
      if (id === 'default') continue
      expect(css, id).toContain(`html[data-palette='${id}']`)
    }
  })

  it('meets WCAG AA contrast for palette text and CTAs', () => {
    for (const [palette, pairs] of Object.entries(paletteContrast)) {
      for (const [fg, bg] of pairs) {
        const ratio = contrastRatio(fg, bg)
        expect(ratio, `${palette} ${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  it('remix nav Contact CTA rule uses --color-cta-bg (not accent)', () => {
    const palettes = readFileSync(path.join(root, 'site/src/styles/palettes.css'), 'utf8')
    expect(palettes).toMatch(
      /html\[data-palette\]:not\(\[data-palette='default'\]\)\s*\.site-nav__cta\s*\{[^}]*background:\s*var\(--color-cta-bg\)/,
    )
    expect(palettes).not.toMatch(
      /html\[data-palette\]:not\(\[data-palette='default'\]\)\s*\.site-nav__cta\s*\{[^}]*background:\s*var\(--color-accent\)/,
    )
  })

  it('meets WCAG AA contrast for nav Contact CTA (remix palettes and default Grey/Slate)', () => {
    const palettesCss = readFileSync(path.join(root, 'site/src/styles/palettes.css'), 'utf8')
    const themeCss = readFileSync(path.join(root, 'site/src/styles/theme.css'), 'utf8')
    const catalogSrc = readFileSync(path.join(root, 'public/js/palette-catalog.js'), 'utf8')

    const light = parseCssBlock(themeCss, "html[data-theme='light']")
    expect(contrastRatio(light['cta-text'], light['cta-bg'])).toBeGreaterThanOrEqual(4.5)

    const darkTheme = parseCssBlock(themeCss, "html[data-theme='dark']")
    expect(contrastRatio('#0b1220', darkTheme.accent)).toBeGreaterThanOrEqual(4.5)

    const idRe = /id:\s*'([^']+)'/g
    const ids: string[] = []
    let m: RegExpExecArray | null
    while ((m = idRe.exec(catalogSrc))) {
      if (m[1] !== 'default') ids.push(m[1])
    }
    for (const id of ids) {
      const tokens = parsePaletteBlock(palettesCss, id)
      const bg = tokens['cta-bg']
      const fg = tokens['cta-text'] ?? tokens.bg
      const ratio = contrastRatio(fg, bg)
      expect(ratio, `nav CTA ${id}: ${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('restores saved theme before palette on load', () => {
    const init = readFileSync(path.join(root, 'public/js/site-init.js'), 'utf8')
    expect(init.indexOf('efortune-theme')).toBeLessThan(init.indexOf('efortune-palette'))
    expect(init).not.toMatch(/setAttribute\('data-theme',\s*meta\.mode\)/)
  })

  it('defines semantic contrast tokens on every remix palette', () => {
    const palettesCss = readFileSync(path.join(root, 'site/src/styles/palettes.css'), 'utf8')
    const catalogSrc = readFileSync(path.join(root, 'public/js/palette-catalog.js'), 'utf8')
    const idRe = /id:\s*'([^']+)'/g
    const ids: string[] = []
    let m: RegExpExecArray | null
    while ((m = idRe.exec(catalogSrc))) {
      if (m[1] !== 'default') ids.push(m[1])
    }
    const required = ['hero-title-stroke', 'pass', 'warn', 'fail', 'diagram-focus'] as const
    const themes = ['light', 'dark'] as const
    for (const id of ids) {
      const tokens = parsePaletteBlock(palettesCss, id)
      for (const key of required) {
        expect(tokens[key], `${id} --color-${key}`).toBeTruthy()
      }
      const bg = tokens.bg
      for (const theme of themes) {
        expect(
          contrastRatio(tokens['hero-title-stroke'], bg),
          `${id} stroke on bg (${theme} theme saved)`,
        ).toBeGreaterThanOrEqual(4.5)
        expect(contrastRatio(tokens.pass, bg), `${id} pass on bg (${theme})`).toBeGreaterThanOrEqual(4.5)
        expect(contrastRatio(tokens.warn, bg), `${id} warn on bg (${theme})`).toBeGreaterThanOrEqual(4.5)
        expect(contrastRatio(tokens.fail, bg), `${id} fail on bg (${theme})`).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  it('persists palette key in site-prefs', () => {
    const prefs = readFileSync(path.join(root, 'public/js/site-prefs.js'), 'utf8')
    expect(prefs).toContain('efortune-palette')
    expect(prefs).not.toMatch(/applyTheme\(meta\.mode\)/)
    expect(prefs).toContain("setAttribute('aria-selected'")
    expect(existsSync(path.join(root, 'public/js/palette-catalog.js'))).toBe(true)
  })
})