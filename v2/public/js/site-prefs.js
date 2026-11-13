document.addEventListener('DOMContentLoaded', function () {
  var themeKey = 'efortune-theme'
  var bgKey = 'efortune-bg'

  function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  function resolvedTheme() {
    var attr = document.documentElement.getAttribute('data-theme')
    if (attr === 'light' || attr === 'dark') return attr
    return systemTheme()
  }

  function resolvedBg() {
    var bg = document.documentElement.getAttribute('data-bg')
    return bg === 'mesh' ? 'mesh' : 'dots'
  }

  function syncTurnstile(theme) {
    var nodes = document.querySelectorAll('.cf-turnstile')
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute('data-theme', theme)
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(themeKey, theme)
    } catch (_err) {
      /* private mode */
    }
    syncTurnstile(theme)
    if (fillBtn) {
      fillBtn.textContent = theme === 'dark' ? 'Slate' : 'Grey'
      fillBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Using Slate (dark). Switch to Grey' : 'Using Grey (light). Switch to Slate',
      )
      fillBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false')
    }
  }

  function applyBg(id) {
    document.documentElement.setAttribute('data-bg', id)
    try {
      localStorage.setItem(bgKey, id)
    } catch (_err) {
      /* private mode */
    }
    for (var i = 0; i < bgButtons.length; i++) {
      var on = bgButtons[i].getAttribute('data-bg-opt') === id
      bgButtons[i].setAttribute('aria-pressed', on ? 'true' : 'false')
    }
  }

  var host = document.createElement('div')
  host.className = 'bp-site-prefs'
  host.setAttribute('role', 'group')
  host.setAttribute('aria-label', 'Site appearance')

  var fillBtn = document.createElement('button')
  fillBtn.type = 'button'
  fillBtn.className = 'bp-site-prefs__btn bp-site-prefs__btn--fill'
  fillBtn.addEventListener('click', function () {
    var next = resolvedTheme() === 'dark' ? 'light' : 'dark'
    applyTheme(next)
  })

  var sep = document.createElement('span')
  sep.className = 'bp-site-prefs__sep'
  sep.setAttribute('aria-hidden', 'true')

  var bgRow = document.createElement('div')
  bgRow.className = 'bp-site-prefs__bg'
  bgRow.setAttribute('role', 'group')
  bgRow.setAttribute('aria-label', 'Hero background style')

  var bgButtons = []
  ;['dots', 'mesh'].forEach(function (id) {
    var btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'bp-site-prefs__btn'
    btn.setAttribute('data-bg-opt', id)
    btn.textContent = id === 'dots' ? 'Dots' : 'Mesh'
    btn.setAttribute('aria-pressed', 'false')
    btn.addEventListener('click', function () {
      applyBg(id)
    })
    bgRow.appendChild(btn)
    bgButtons.push(btn)
  })

  host.appendChild(fillBtn)
  host.appendChild(sep)
  host.appendChild(bgRow)
  document.body.appendChild(host)

  applyTheme(resolvedTheme())
  applyBg(resolvedBg())
})
