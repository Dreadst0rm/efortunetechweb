import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = luminance(fg)
  const l2 = luminance(bg)
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}

describe('color theme', () => {
  it('loads site-init before CSS and site-prefs in production', () => {
    const index = readFileSync(path.join(dist, 'index.html'), 'utf8')
    expect(index).toMatch(/palette-catalog\.js/)
    expect(index).toMatch(/site-init\.js/)
    expect(index).toMatch(/site-prefs\.js/)
    expect(index.indexOf('site-init.js')).toBeLessThan(index.indexOf('site.css'))
    expect(index).not.toMatch(/theme-toggle\.js/)
    expect(index).not.toMatch(/id="theme-toggle"/)
    expect(index).not.toMatch(/data-staging-bg/)
  })

  it('defines soft grey light theme and midnight dark tokens', () => {
    const css = readFileSync(path.join(root, 'site/src/styles/theme.css'), 'utf8')
    expect(css).toContain('--color-bg: #e9ecef')
    expect(css).toContain('--color-surface: #f3f4f6')
    expect(css).toContain('--color-bg: #0b1220')
    expect(css).toContain('data-theme')
  })

  it('meets WCAG AA contrast for primary buttons and body text', () => {
    const pairs: [string, string][] = [
      ['#ffffff', '#054a4c'],
      ['#ffffff', '#2563eb'],
      ['#1c1f23', '#e9ecef'],
      ['#054a4c', '#f3f4f6'],
      ['#065e60', '#f3f4f6'],
    ]
    for (const [fg, bg] of pairs) {
      expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('exposes preference scripts in public/', () => {
    expect(existsSync(path.join(root, 'public/js/site-init.js'))).toBe(true)
    expect(existsSync(path.join(root, 'public/js/site-prefs.js'))).toBe(true)
    const prefs = readFileSync(path.join(root, 'public/js/site-prefs.js'), 'utf8')
    expect(prefs).toContain('efortune-theme')
    expect(prefs).toContain('efortune-bg')
    expect(prefs).toContain('Grey')
    expect(prefs).toContain('Slate')
    expect(prefs).toContain('syncTurnstile')
  })
})
