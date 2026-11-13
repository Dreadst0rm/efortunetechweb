(function () {
  var key = 'efortune-theme'
  try {
    var stored = localStorage.getItem(key)
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-theme', stored)
    }
  } catch (_err) {
    /* private mode */
  }
})()
