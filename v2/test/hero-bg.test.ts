import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

describe('hero background treatments', () => {
  it('loads bg-init before CSS on all pages', () => {
    const index = readFileSync(path.join(dist, 'index.html'), 'utf8')
    expect(index).toMatch(/bg-init\.js/)
    expect(index.indexOf('bg-init.js')).toBeLessThan(index.indexOf('site.css'))
    expect(index).toContain('bp-hero__bg')
    expect(index).not.toMatch(/bp-draw-grid/)
  })

  it('includes hero background CSS module', () => {
    const css = readFileSync(path.join(root, 'site/src/styles/hero-backgrounds.css'), 'utf8')
    expect(css).toContain("html[data-bg='dots']")
    expect(css).toContain("html[data-bg='mesh']")
    expect(css).toContain("html[data-bg='topo']")
    expect(css).toContain("html[data-bg='clean']")
  })

  it('gates staging switcher to SHOW_BG_SWITCHER builds', () => {
    const index = readFileSync(path.join(dist, 'index.html'), 'utf8')
    if (index.includes('bg-switcher.js')) {
      expect(index).toMatch(/data-staging-bg="1"/)
    } else {
      expect(index).not.toMatch(/data-staging-bg="1"/)
    }
    expect(existsSync(path.join(root, 'public/js/bg-init.js'))).toBe(true)
  })
})
