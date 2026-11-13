/** Build-time flags (prerender). */
export const showBgSwitcher = process.env.SHOW_BG_SWITCHER === 'true'

export const BG_HEAD = `
  <script src="/js/bg-init.js"></script>
  ${showBgSwitcher ? '<script src="/js/bg-switcher.js" defer></script>' : ''}
`.trim()

export function htmlRootAttrs(): string {
  const attrs = ['lang="en"']
  if (showBgSwitcher) attrs.push('data-staging-bg="1"')
  return attrs.join(' ')
}
