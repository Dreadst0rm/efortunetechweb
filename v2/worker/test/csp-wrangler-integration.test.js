import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const v2Root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DEV_PORT = 19876;
const DEV_ORIGIN = `http://127.0.0.1:${DEV_PORT}`;

async function waitForWranglerReady(timeoutMs = 45_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${DEV_ORIGIN}/`, { redirect: 'manual' });
      if (res.status === 200 || res.status === 301) return;
    } catch {
      /* server still starting */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error('wrangler dev did not become ready');
}

describe('wrangler dev HTML CSP', { timeout: 60_000 }, () => {
  it('returns nonce CSP on /contact.html and /', async () => {
    const proc = spawn(
      'npx',
      ['wrangler', 'dev', '--port', String(DEV_PORT), '--local-protocol', 'http', '--ip', '127.0.0.1'],
      { cwd: v2Root, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, FORCE_COLOR: '0' } },
    );

    proc.stdout.on('data', () => {});
    proc.stderr.on('data', () => {});

    try {
      await waitForWranglerReady();

      for (const path of ['/contact.html', '/']) {
        const res = await fetch(`${DEV_ORIGIN}${path}`);
        assert.equal(res.status, 200, path);
        const csp = res.headers.get('content-security-policy') || '';
        assert.match(csp, /'nonce-[^']+'/, `${path} CSP`);
        assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/, `${path} script-src`);
        const cache = (res.headers.get('cache-control') || '').toLowerCase();
        assert.match(cache, /private/, `${path} cache-control`);
        assert.match(cache, /no-cache/, `${path} cache-control`);
        const html = await res.text();
        const nonce = /'nonce-([^']+)'/.exec(csp)?.[1];
        assert.ok(nonce, 'nonce in csp');
        assert.match(html, new RegExp(`nonce="${nonce}"`), `${path} script tags`);
      }
    } finally {
      proc.kill('SIGTERM');
      await Promise.race([once(proc, 'exit'), new Promise((r) => setTimeout(r, 5000))]);
    }
  });
});