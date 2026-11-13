# Digest content (v2)

## Add a new issue

1. Create `v2/site/content/digest/updates/YYYY-MM-DD.json` using the schema below (copy a recent file as a template).
2. Ensure the `date` field matches the filename stem exactly.
3. Use only `http://` or `https://` URLs in `sources` (no `javascript:` or `data:`).
4. From `v2/`, run `npm run build` — Zod validation runs when issues load; the build fails on bad data.
5. Deploy with the **efortune-site v2** workflow (`workflow_dispatch`) when Ed approves (not automatic on merge).

### Schema

| Field | Required | Notes |
|-------|----------|--------|
| `date` | yes | `YYYY-MM-DD`, real calendar day, must match filename |
| `title` | yes | Issue headline |
| `summary` | yes | TL;DR on the issue page |
| `tone` | no | Short stance label |
| `sections` | yes | `{ heading, bullets[], sources?[] }` |
| `sources` | per section | `{ label, url }` with http(s) URL only |
| `bottomLine` | yes | Closing action line |

Published URLs (trailing slash):

- Index: `/digest/`
- Issue: `/digest/updates/YYYY-MM-DD/`
- Feed: `/digest/rss.xml`

RSS and sitemap links use `SITE_ORIGIN` in `wrangler.jsonc` (default `https://efortune.tech`). Override for staging previews if needed.

## Legacy redirect map (`digest.efortune.tech`)

When the request `Host` is `digest.efortune.tech`, the Worker responds with **301** to `SITE_ORIGIN` (no routes are defined in `wrangler.jsonc` yet; logic is ready):

| Legacy path | New location |
|-------------|----------------|
| `/`, `/about/`, `/about` | `https://efortune.tech/digest/` |
| `/rss.xml` | `https://efortune.tech/digest/rss.xml` |
| `/sitemap.xml` | `https://efortune.tech/sitemap.xml` |
| `/updates/YYYY-MM-DD/`, `/updates/YYYY-MM-DD` | `https://efortune.tech/digest/updates/YYYY-MM-DD/` |
| Other paths under legacy host | `https://efortune.tech/digest{path}` (normalized trailing slash) |

After cutover, attach the `digest.efortune.tech` hostname to the same Worker (or DNS redirect) so these mappings apply in production.
