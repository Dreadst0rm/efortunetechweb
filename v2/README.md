# efortune.tech v2 (Blueprint + Cloudflare Worker)

Self-contained v2 site: React/TypeScript source, **prerendered static HTML** at build time, and a single Worker (`efortune-site`) that serves assets, `/api/contact`, and a branded 404.

## Local development

```bash
cd v2
npm ci
npm run build          # dist/ + worker/contact-html.js bundle
npm test
npm run preview:worker # wrangler dev after build
```

During `wrangler dev`, open the printed URL. Set `TURNSTILE_SECRET` in the dashboard or via `wrangler secret put TURNSTILE_SECRET` for live Turnstile checks.

## Layout

| Path | Role |
|------|------|
| `site/` | Blueprint React pages, prerender script, Vitest |
| `worker/` | Contact handler (from `efortune-contact`) + asset-serving Worker |
| `dist/` | Build output (not committed) |
| `public/` | `robots.txt`, `_headers`, `.well-known`, contact `js/contact.js` |

The repo root static site is unchanged until cutover.
