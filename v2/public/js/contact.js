// Contact form: native POST to /api/contact so Turnstile includes a token.
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const interest = params.get('interest');
  if (interest) {
    const sel = form.querySelector('select[name="interest"]');
    if (sel && sel.querySelector(`option[value="${CSS.escape(interest)}"]`)) {
      sel.value = interest;
    }
  }

  form.addEventListener('submit', function () {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = 'Sending...';
      btn.disabled = true;
    }
  });
});

window.addEventListener('pageshow', function (e) {
  if (!e.persisted) return;
  const form = document.getElementById('contact-form');
  const btn = form && form.querySelector('button[type="submit"]');
  if (!btn) return;
  btn.disabled = false;
  btn.textContent = 'Send message';
});
