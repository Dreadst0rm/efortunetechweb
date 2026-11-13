document.addEventListener('DOMContentLoaded', function () {
  if (document.documentElement.getAttribute('data-staging-bg') !== '1') return

  var options = [
    { id: 'dots', label: 'Dots' },
    { id: 'mesh', label: 'Mesh' },
    { id: 'topo', label: 'Topo' },
    { id: 'clean', label: 'Clean' },
  ]
  var key = 'efortune-bg'

  function current() {
    var bg = document.documentElement.getAttribute('data-bg')
    return bg === 'mesh' || bg === 'topo' || bg === 'clean' ? bg : 'dots'
  }

  function apply(id) {
    document.documentElement.setAttribute('data-bg', id)
    try {
      localStorage.setItem(key, id)
    } catch (_err) {
      /* private mode */
    }
    for (var i = 0; i < buttons.length; i++) {
      var on = buttons[i].getAttribute('data-bg-opt') === id
      buttons[i].setAttribute('aria-pressed', on ? 'true' : 'false')
    }
  }

  var host = document.createElement('div')
  host.className = 'bp-bg-switcher'
  host.setAttribute('role', 'group')
  host.setAttribute('aria-label', 'Hero background preview')

  var buttons = []
  for (var j = 0; j < options.length; j++) {
    ;(function (opt) {
      var btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'bp-bg-switcher__btn'
      btn.setAttribute('data-bg-opt', opt.id)
      btn.textContent = opt.label
      btn.setAttribute('aria-pressed', 'false')
      btn.addEventListener('click', function () {
        apply(opt.id)
      })
      host.appendChild(btn)
      buttons.push(btn)
    })(options[j])
  }

  document.body.appendChild(host)
  apply(current())
})
