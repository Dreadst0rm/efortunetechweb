(function () {
  var valid = { dots: 1, mesh: 1, topo: 1, clean: 1 }
  var def = 'dots'
  var key = 'efortune-bg'
  var bg = def
  try {
    var params = new URLSearchParams(location.search)
    var q = params.get('bg')
    if (q && valid[q]) {
      bg = q
      localStorage.setItem(key, q)
    } else {
      var stored = localStorage.getItem(key)
      if (stored && valid[stored]) bg = stored
    }
  } catch (_err) {
    /* private mode */
  }
  document.documentElement.setAttribute('data-bg', bg)
})()
