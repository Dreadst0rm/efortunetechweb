import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Repo-root layout: contact.html sits next to worker/. SITE_ROOT overrides
// that default (absolute or relative to the worker directory).
const workerDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const siteRoot = process.env.SITE_ROOT
  ? (process.env.SITE_ROOT.startsWith('/') ? process.env.SITE_ROOT : join(workerDir, process.env.SITE_ROOT))
  : join(workerDir, '../dist');

const html = readFileSync(join(siteRoot, 'contact.html'), 'utf8');
const out = `/** Bundled contact.html for Worker error-page re-renders. Generated — do not edit by hand. */\nexport const CONTACT_HTML = ${JSON.stringify(html)};\n`;
writeFileSync(join(workerDir, 'contact-html.js'), out);
console.log('wrote contact-html.js', out.length, 'bytes');
