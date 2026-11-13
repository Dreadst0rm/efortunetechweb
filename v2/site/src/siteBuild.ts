export const SITE_PREFS_HEAD = `
  <script src="/js/site-init.js"></script>
  <script src="/js/site-prefs.js" defer></script>
`.trim()

export function htmlRootAttrs(): string {
  return 'lang="en"'
}
