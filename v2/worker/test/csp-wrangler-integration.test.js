import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { STATIC_FALLBACK_CONTENT_SECURITY_POLICY } from '../html-csp.js';

const v2Root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const WRANGLER_BIN = join(v2Root, 'node_modules/wrangler/bin/wrangler.js');

function reservePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      server.close((err) => (err ? reject(err) : resolve(port)));
    });
  });
}

function portIsFree(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.once('error', () => resolve(false));
    server.listen(port, '127.0.0.1', () => {
      server.close(() => resolve(true));
    });
  });
}

async function waitForDev(origin, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${origin}/`, { redirect: 'manual' });
      if (res.status === 200 || res.status === 301) return;
    } catch {
      /* starting */
    }
    await new Promise((r) => setTimeout(r, 350));
  }
  throw new Error('wrangler dev did not become ready');
}

function spawnWranglerDev(port) {
  const child = spawn(
    process.execPath,
    [WRANGLER_BIN, 'dev', '--port', String(port), '--local-protocol', 'http', '--ip', '127.0.0.1'],
    {
      cwd: v2Root,
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, FORCE_COLOR: '0' },
    },
  );
  child.stdout?.resume();
  child.stderr?.resume();
  return child;
}

async function stopDevProcessGroup(pid) {
  if (!pid) return;
  const killTree = (signal) => {
    try {
      process.kill(-pid, signal);
    } catch {
      try {
        process.kill(pid, signal);
      } catch {
        /* already gone */
      }
    }
  };
  killTree('SIGTERM');
  await new Promise((r) => setTimeout(r, 400));
  killTree('SIGKILL');
}

function destroyIo(proc) {
  proc.stdout?.destroy();
  proc.stderr?.destroy();
  proc.stdin?.destroy();
}

describe('wrangler dev HTML CSP', { timeout: 45_000 }, () => {
  it('returns nonce CSP on HTML and fallback CSP on static assets', async () => {
    const port = await reservePort();
    assert.equal(await portIsFree(port), true, `port ${port} must be free`);
    const origin = `http://127.0.0.1:${port}`;

    const proc = spawnWranglerDev(port);
    assert.ok(proc.pid, 'wrangler pid');

    try {
      await waitForDev(origin);

      for (const path of ['/contact.html', '/']) {
        const res = await fetch(`${origin}${path}`);
        assert.equal(res.status, 200, path);
        const csp = res.headers.get('content-security-policy') || '';
        assert.match(csp, /'nonce-[^']+'/, `${path} CSP nonce`);
        assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/, `${path} script-src`);
        assert.match((res.headers.get('cache-control') || '').toLowerCase(), /private/, path);
        assert.match(res.headers.get('x-content-type-options') || '', /nosniff/i, path);
        const html = await res.text();
        const nonce = /'nonce-([^']+)'/.exec(csp)?.[1];
        assert.ok(nonce);
        assert.match(html, new RegExp(`nonce="${nonce}"`), `${path} script tags`);
      }

      const asset = await fetch(`${origin}/js/site-init.js`);
      assert.equal(asset.status, 200);
      const csp = asset.headers.get('content-security-policy') || '';
      assert.equal(csp, STATIC_FALLBACK_CONTENT_SECURITY_POLICY);
      assert.doesNotMatch(csp, /'nonce-/);
      assert.match(asset.headers.get('x-content-type-options') || '', /nosniff/i);
      const cache = (asset.headers.get('cache-control') || '').toLowerCase();
      assert.doesNotMatch(cache, /private/);
    } finally {
      destroyIo(proc);
      await stopDevProcessGroup(proc.pid);
    }
  });
});