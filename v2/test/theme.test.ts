import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

/** WCAG relative luminance for sRGB hex */
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
  it('ships theme scripts and nav toggle in prerendered HTML', () => {
    const index = readFileSync(path.join(dist, 'index.html'), 'utf8')
    expect(index).toMatch(/theme-init\.js/)
    expect(index).toMatch(/theme-toggle\.js/)
    expect(index).toMatch(/id="theme-toggle"/)
    expect(index.indexOf('theme-init.js')).toBeLessThan(index.indexOf('site.css'))
  })

  it('defines light and dark token sets in theme CSS', () => {
    const css = readFileSync(
      path.join(root, 'site/src/styles/theme.css'),
      'utf8',
    )
    expect(css).toContain('--color-bg: #f5f6f7')
    expect(css).toContain('--color-bg: #0b1220')
    expect(css).toContain('data-theme')
  })

  it('meets WCAG AA contrast for primary buttons (4.5:1)', () => {
    const pairs: [string, string][] = [
      ['#ffffff', '#0a7375'],
      ['#ffffff', '#2563eb'],
    ]
    for (const [fg, bg] of pairs) {
      expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('exposes theme init in public/', () => {
    expect(existsSync(path.join(root, 'public/js/theme-init.js'))).toBe(true)
    expect(existsSync(path.join(root, 'public/js/theme-toggle.js'))).toBe(true)
  })
})
