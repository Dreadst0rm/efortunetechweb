import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

type ThemeCase = {
  savedTheme: 'light' | 'dark'
  emulatedScheme: 'light' | 'dark'
  palette?: string
}

const pages = [
  '/',
  '/contact.html',
  '/pricing.html',
  '/case-studies.html',
  '/quarterly-initiative',
  '/hands-on',
  '/resilience-and-recovery',
  '/performance-and-scale',
  '/security-hardening',
  '/monitoring',
  '/ai-practice',
  '/cloud-migration',
  '/zero-trust',
  '/blog/',
] as const

const cases: ThemeCase[] = [
  { savedTheme: 'light', emulatedScheme: 'dark' },
  { savedTheme: 'dark', emulatedScheme: 'light' },
  { savedTheme: 'light', emulatedScheme: 'dark', palette: 'swiss' },
  { savedTheme: 'dark', emulatedScheme: 'light', palette: 'terminal' },
]

async function seedPrefs(page: Page, theme: string, palette?: string) {
  await page.addInitScript(
    ({ themeKey, paletteKey, t, p }) => {
      localStorage.setItem(themeKey, t)
      if (p) localStorage.setItem(paletteKey, p)
    },
    { themeKey: 'efortune-theme', paletteKey: 'efortune-palette', t: theme, p: palette ?? 'default' },
  )
}

for (const config of cases) {
  for (const path of pages) {
    const label = `${path} theme=${config.savedTheme} scheme=${config.emulatedScheme}${
      config.palette ? ` palette=${config.palette}` : ''
    }`
    test(`axe WCAG2AA ${label}`, async ({ page }) => {
      await seedPrefs(page, config.savedTheme, config.palette)
      await page.emulateMedia({ colorScheme: config.emulatedScheme })
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      const results = await new AxeBuilder({ page }).withTags(['wcag2aa', 'wcag21aa']).analyze()

      expect(results.violations, results.violations.map((v) => `${v.id}: ${v.help}`).join('\n')).toEqual(
        [],
      )
    })
  }
}