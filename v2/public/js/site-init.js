(function () {
  var themeKey = 'efortune-theme'
  var bgKey = 'efortune-bg'
  var bgValid = { dots: 1, mesh: 1 }

  try {
    var storedTheme = localStorage.getItem(themeKey)
    if (storedTheme === 'light' || storedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', storedTheme)
    }
  } catch (_err) {
    /* private mode */
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
