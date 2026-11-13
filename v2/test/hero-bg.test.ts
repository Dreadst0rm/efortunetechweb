import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

describe('hero background treatments', () => {
  it('loads site-init before CSS and includes hero bg layer', () => {
    const index = readFileSync(path.join(dist, 'index.html'), 'utf8')
    expect(index).toMatch(/site-init\.js/)
    expect(index.indexOf('site-init.js')).toBeLessThan(index.indexOf('site.css'))
    expect(index).toContain('bp-hero__bg')
    expect(index).toContain('bp-title-frame')
    expect(index).not.toMatch(/bp-draw-grid/)
  })

  it('includes dots and mesh background CSS only', () => {
    const css = readFileSync(path.join(root, 'site/src/styles/hero-backgrounds.css'), 'utf8')
    expect(css).toContain("html[data-bg='dots']")
    expect(css).toContain("html[data-bg='mesh']")
    expect(css).not.toContain("html[data-bg='topo']")
    expect(css).not.toContain("html[data-bg='clean']")
    expect(css).toContain('.bp-site-prefs')
  })

  it('ships production prefs pill script', () => {
    const index = readFileSync(path.join(dist, 'index.html'), 'utf8')
    expect(index).toMatch(/site-prefs\.js/)
    expect(existsSync(path.join(root, 'public/js/site-init.js'))).toBe(true)
  })
})
