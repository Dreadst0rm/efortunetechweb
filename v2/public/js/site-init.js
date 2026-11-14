(function () {
  var themeKey = 'efortune-theme'
  var paletteKey = 'efortune-palette'
  var bgKey = 'efortune-bg'
  var bgValid = { dots: 1, mesh: 1 }

  function catalog() {
    return window.EFORTUNE_PALETTES || {}
  }

  function paletteIds() {
    return window.EFORTUNE_PALETTE_IDS || ['default']
  }

  function applyPalette(id) {
    var root = document.documentElement
    var meta = catalog()[id]
    if (!id || id === 'default' || !meta) {
      root.removeAttribute('data-palette')
      return
    }
    if (paletteIds().indexOf(id) === -1) {
      root.removeAttribute('data-palette')
      return
    }
    root.setAttribute('data-palette', id)
    if (meta.mode === 'light' || meta.mode === 'dark') {
      root.setAttribute('data-theme', meta.mode)
    }
  }

  try {
    var storedPalette = localStorage.getItem(paletteKey) || 'default'
    applyPalette(storedPalette)
  } catch (_p) {
    /* private mode */
  }

  if (!document.documentElement.getAttribute('data-theme')) {
    try {
      var storedTheme = localStorage.getItem(themeKey)
      if (storedTheme === 'light' || storedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', storedTheme)
      }
    } catch (_err) {
      /* private mode */
    }
  }

  var bg = 'dots'
  try {
    var params = new URLSearchParams(location.search)
    var q = params.get('bg')
    if (q && bgValid[q]) {
      bg = q
      localStorage.setItem(bgKey, q)
    } else {
      var storedBg = localStorage.getItem(bgKey)
      if (storedBg && bgValid[storedBg]) bg = storedBg
      else if (storedBg === 'topo' || storedBg === 'clean') {
        localStorage.setItem(bgKey, 'dots')
      }
    }
  } catch (_err2) {
    /* private mode */
  }
  document.documentElement.setAttribute('data-bg', bg)
})()