/** Home hero: trigger blueprint draw-in when hero enters view (no-op if reduced motion). */
function initHeroDraw() {
  const hero = document.querySelector('.bp-hero')
  const svg = document.querySelector('.bp-hero-draw')
  if (!hero || !svg) return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    hero.classList.add('bp-hero--ready')
    return
  }

  const start = () => {
    hero.classList.add('bp-hero--draw-active')
    window.setTimeout(() => hero.classList.add('bp-hero--ready'), 3200)
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            start()
            io.disconnect()
          }
        }
      },
      { threshold: 0.2 },
    )
    io.observe(hero)
  } else {
    start()
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroDraw)
} else {
  initHeroDraw()
}
