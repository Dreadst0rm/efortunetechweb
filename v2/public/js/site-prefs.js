document.addEventListener('DOMContentLoaded', function () {
  var themeKey = 'efortune-theme'
  var paletteKey = 'efortune-palette'
  var bgKey = 'efortune-bg'
  var mobileMq = window.matchMedia('(max-width: 1024px)')

  function isMobilePrefs() {
    return mobileMq.matches
  }

  function paletteIds() {
    return window.EFORTUNE_PALETTE_IDS || ['default']
  }

  function paletteCatalog() {
    return window.EFORTUNE_PALETTES || { default: { id: 'default', label: 'Grey / Slate', mode: null } }
  }

  function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  function resolvedPalette() {
    var id = document.documentElement.getAttribute('data-palette')
    if (!id) return 'default'
    return paletteIds().indexOf(id) >= 0 ? id : 'default'
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
    var ts = typeof window !== 'undefined' ? window.turnstile : null
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i]
      el.setAttribute('data-theme', theme)
      if (!ts || typeof ts.reset !== 'function') continue
      var wid = el.getAttribute('data-widget-id')
      if (wid) {
        try {
          ts.reset(wid)
        } catch (_tsErr) {
          /* widget not ready */
        }
      }
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
    refreshFillLabel()
  }

  function applyPalette(id) {
    var catalog = paletteCatalog()
    if (!catalog[id]) id = 'default'
    var meta = catalog[id]
    var root = document.documentElement
    if (id === 'default') {
      root.removeAttribute('data-palette')
    } else {
      root.setAttribute('data-palette', id)
    }
    try {
      localStorage.setItem(paletteKey, id)
    } catch (_err2) {
      /* private mode */
    }
    refreshFillLabel()
    refreshPaletteSelection()
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

  function refreshFillLabel() {
    if (!fillBtn) return
    var pal = resolvedPalette()
    if (pal !== 'default') {
      var label = paletteCatalog()[pal].label
      fillBtn.textContent = label.length > 10 ? label.slice(0, 9) + '…' : label
      fillBtn.setAttribute('aria-label', 'Using ' + label + ' palette. Click for Grey or Slate')
      fillBtn.setAttribute('aria-pressed', 'true')
      return
    }
    var theme = resolvedTheme()
    fillBtn.textContent = theme === 'dark' ? 'Slate' : 'Grey'
    fillBtn.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Using Slate (dark). Switch to Grey' : 'Using Grey (light). Switch to Slate',
    )
    fillBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false')
  }

  function refreshPaletteSelection() {
    var current = resolvedPalette()
    for (var j = 0; j < paletteButtons.length; j++) {
      var bid = paletteButtons[j].getAttribute('data-palette-opt')
      paletteButtons[j].setAttribute('aria-selected', bid === current ? 'true' : 'false')
    }
  }

  function closePaletteSubpanel() {
    palettePanel.hidden = true
    paletteToggle.setAttribute('aria-expanded', 'false')
  }

  function closeMobilePanel() {
    host.classList.remove('bp-site-prefs--open')
    mobileToggle.setAttribute('aria-expanded', 'false')
    closePaletteSubpanel()
  }

  function canTakeFocus(el) {
    if (!el || el === document.documentElement) return false
    if (el.closest && el.closest('.bp-site-prefs')) return true
    if (typeof el.matches !== 'function') return false
    return el.matches(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
  }

  function openMobilePanel() {
    host.classList.add('bp-site-prefs--open')
    mobileToggle.setAttribute('aria-expanded', 'true')
    fillBtn.focus()
  }

  var host = document.createElement('div')
  host.className = 'bp-site-prefs'
  host.setAttribute('role', 'group')
  host.setAttribute('aria-label', 'Site appearance')

  var mobileToggle = document.createElement('button')
  mobileToggle.type = 'button'
  mobileToggle.className = 'bp-site-prefs__toggle'
  mobileToggle.textContent = '◐'
  mobileToggle.setAttribute('aria-label', 'Display options')
  mobileToggle.setAttribute('aria-expanded', 'false')
  mobileToggle.setAttribute('aria-controls', 'bp-site-prefs-panel')
  mobileToggle.addEventListener('click', function (ev) {
    ev.stopPropagation()
    if (host.classList.contains('bp-site-prefs--open')) {
      closeMobilePanel()
      mobileToggle.focus()
    } else {
      openMobilePanel()
    }
  })

  var controlsPanel = document.createElement('div')
  controlsPanel.id = 'bp-site-prefs-panel'
  controlsPanel.className = 'bp-site-prefs__panel'

  var fillBtn = document.createElement('button')
  fillBtn.type = 'button'
  fillBtn.className = 'bp-site-prefs__btn bp-site-prefs__btn--fill'
  fillBtn.addEventListener('click', function () {
    var pal = resolvedPalette()
    if (pal !== 'default') {
      applyPalette('default')
      return
    }
    var next = resolvedTheme() === 'dark' ? 'light' : 'dark'
    applyTheme(next)
  })

  var paletteWrap = document.createElement('div')
  paletteWrap.className = 'bp-site-prefs__palette-wrap'

  var paletteToggle = document.createElement('button')
  paletteToggle.type = 'button'
  paletteToggle.className = 'bp-site-prefs__btn bp-site-prefs__btn--palette'
  paletteToggle.textContent = 'Colors'
  paletteToggle.setAttribute('aria-expanded', 'false')
  paletteToggle.setAttribute('aria-haspopup', 'true')
  paletteToggle.setAttribute('aria-controls', 'bp-site-prefs-palette-panel')
  paletteToggle.addEventListener('click', function (ev) {
    ev.stopPropagation()
    var open = palettePanel.hidden
    palettePanel.hidden = !open
    paletteToggle.setAttribute('aria-expanded', open ? 'true' : 'false')
  })

  var palettePanel = document.createElement('div')
  palettePanel.id = 'bp-site-prefs-palette-panel'
  palettePanel.className = 'bp-site-prefs__palette-panel'
  palettePanel.hidden = true
  palettePanel.setAttribute('role', 'listbox')
  palettePanel.setAttribute('aria-label', 'Color palettes')

  var paletteButtons = []
  paletteIds().forEach(function (id) {
    var meta = paletteCatalog()[id]
    if (!meta) return
    var btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'bp-site-prefs__swatch'
    btn.setAttribute('data-palette-opt', id)
    btn.setAttribute('role', 'option')
    btn.setAttribute('title', meta.label)
    btn.setAttribute('aria-label', meta.label)
    var sw = meta.swatch || ['#ccc', '#999', '#111']
    btn.style.setProperty('--bp-swatch-bg', sw[0])
    btn.style.setProperty('--bp-swatch-accent', sw[1])
    btn.style.setProperty('--bp-swatch-ink', sw[2])
    btn.addEventListener('click', function () {
      applyPalette(id)
      if (isMobilePrefs()) {
        btn.focus()
      } else {
        closePaletteSubpanel()
      }
    })
    palettePanel.appendChild(btn)
    paletteButtons.push(btn)
  })

  paletteWrap.appendChild(paletteToggle)
  paletteWrap.appendChild(palettePanel)

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

  controlsPanel.appendChild(fillBtn)
  controlsPanel.appendChild(paletteWrap)
  controlsPanel.appendChild(sep)
  controlsPanel.appendChild(bgRow)

  host.appendChild(mobileToggle)
  host.appendChild(controlsPanel)
  document.body.appendChild(host)

  var pointerDownInsideHost = false

  host.addEventListener(
    'pointerdown',
    function (ev) {
      pointerDownInsideHost = host.contains(ev.target)
    },
    true,
  )

  document.addEventListener('click', function (ev) {
    if (host.contains(ev.target)) return
    if (isMobilePrefs() && host.classList.contains('bp-site-prefs--open')) {
      closeMobilePanel()
      if (!canTakeFocus(ev.target)) mobileToggle.focus()
      return
    }
    if (!palettePanel.hidden) closePaletteSubpanel()
  })

  host.addEventListener(
    'focusout',
    function (ev) {
      if (!isMobilePrefs() || !host.classList.contains('bp-site-prefs--open')) return
      if (!ev.target || !host.contains(ev.target)) return
      window.setTimeout(function () {
        if (!host.classList.contains('bp-site-prefs--open')) return
        var active = document.activeElement
        if (active && host.contains(active)) return
        if (pointerDownInsideHost) return
        closeMobilePanel()
        mobileToggle.focus()
      }, 0)
    },
    true,
  )

  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape') return
    if (isMobilePrefs() && host.classList.contains('bp-site-prefs--open')) {
      ev.preventDefault()
      closeMobilePanel()
      mobileToggle.focus()
      return
    }
    if (!palettePanel.hidden) {
      closePaletteSubpanel()
      paletteToggle.focus()
    }
  })

  mobileMq.addEventListener('change', function () {
    closeMobilePanel()
    closePaletteSubpanel()
  })

  refreshFillLabel()
  applyBg(resolvedBg())
  refreshPaletteSelection()
})