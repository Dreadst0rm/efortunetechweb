document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('theme-toggle')
  if (!btn) return
  var key = 'efortune-theme'

  function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  function resolvedTheme() {
    var attr = document.documentElement.getAttribute('data-theme')
    if (attr === 'light' || attr === 'dark') return attr
    return systemTheme()
  }

  function labelFor(theme) {
    return theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
  }

  function syncAria(theme) {
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false')
    btn.setAttribute('aria-label', labelFor(theme))
  }

  syncAria(resolvedTheme())

  btn.addEventListener('click', function () {
    var next = resolvedTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem(key, next)
    } catch (_err) {
      /* private mode */
    }
    syncAria(next)
  })
})
