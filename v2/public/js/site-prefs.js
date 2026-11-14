document.addEventListener('DOMContentLoaded', function () {
  var themeKey = 'efortune-theme'
  var paletteKey = 'efortune-palette'
  var bgKey = 'efortune-bg'

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

  var host = document.createElement('div')
  host.className = 'bp-site-prefs'
  host.setAttribute('role', 'group')
  host.setAttribute('aria-label', 'Site appearance')

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
  paletteToggle.addEventListener('click', function () {
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
      palettePanel.hidden = true
      paletteToggle.setAttribute('aria-expanded', 'false')
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

  host.appendChild(fillBtn)
  host.appendChild(paletteWrap)
  host.appendChild(sep)
  host.appendChild(bgRow)
  document.body.appendChild(host)

  document.addEventListener('click', function (ev) {
    if (!palettePanel.hidden && !host.contains(ev.target)) {
      palettePanel.hidden = true
      paletteToggle.setAttribute('aria-expanded', 'false')
    }
  })

  refreshFillLabel()
  applyBg(resolvedBg())
  refreshPaletteSelection()
})