# Cloudflare Web Analytics (CSP-safe)

Automatic Web Analytics injection from the Cloudflare dashboard loads `https://static.cloudflareinsights.com/beacon.min.js` **and** a small inline bootstrap script. Our CSP does **not** allow `'unsafe-inline'` in `script-src`.

## Recommended setup

1. In **Cloudflare → Analytics & logs → Web Analytics**, open the site and **disable automatic JavaScript injection** (use the manual / CSP-friendly option when offered).
2. Copy the **beacon token** for the site.
3. Set the token when building static HTML (not at runtime on the Worker):

   ```bash
   CF_WEB_ANALYTICS_TOKEN=your-token-here npm run build
   ```

   Prerender adds a single external script tag via `site/src/analytics.ts`:

   ```html
   <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"…","spa":false}'></script>
   ```

4. CSP (Worker `buildContentSecurityPolicy(nonce)` on HTML responses) already allows:
   - `script-src … https://static.cloudflareinsights.com`
   - `connect-src … https://cloudflareinsights.com`

If the token is unset, no analytics script is emitted (local builds and CI stay clean).

## Do not use

- Dashboard “automatic” injection with inline loader (blocked by CSP without weakening policy).
- `'unsafe-inline'` or hash workarounds for Cloudflare’s injected loader — use the manual beacon instead.

## Bot Management JavaScript Detections

HTML responses get a **per-request CSP nonce** in the Worker (`html-csp.js`): `script-src` includes `'self'`, `'nonce-…'`, Turnstile, and analytics hosts so Cloudflare can inject JS Detections on `/cdn-cgi/challenge-platform/` without `'unsafe-inline'`. Nonces are added to each `<script>` tag via `HTMLRewriter`. See [Cloudflare JS Detections + CSP](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/javascript-detections/#if-you-have-a-content-security-policy-csp).
