import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  DIGEST_HOST,
  EFORTUNE_ORIGIN,
  digestOffsiteRedirectUrl,
  mapDigestHostPathToBlog,
  mapLegacyDigestPathToBlog,
} from '../digest-redirect.js';

describe('mapLegacyDigestPathToBlog', () => {
  it('maps on-site /digest/* to /blog/*', () => {
    assert.equal(mapLegacyDigestPathToBlog('/digest/'), '/blog/');
    assert.equal(mapLegacyDigestPathToBlog('/digest'), '/blog/');
    assert.equal(mapLegacyDigestPathToBlog('/digest/rss.xml'), '/blog/rss.xml');
    assert.equal(mapLegacyDigestPathToBlog('/digest/updates/2026-10-23/'), '/blog/updates/2026-10-23/');
    assert.equal(mapLegacyDigestPathToBlog('/digest/updates/2026-10-23'), '/blog/updates/2026-10-23/');
  });

  it('returns null for non-digest paths', () => {
    assert.equal(mapLegacyDigestPathToBlog('/'), null);
    assert.equal(mapLegacyDigestPathToBlog('/contact.html'), null);
  });
});

describe('mapDigestHostPathToBlog', () => {
  it('maps digest.efortune.tech paths to blog paths', () => {
    assert.equal(mapDigestHostPathToBlog('/'), '/blog/');
    assert.equal(mapDigestHostPathToBlog('/rss.xml'), '/blog/rss.xml');
    assert.equal(mapDigestHostPathToBlog('/updates/2026-09-06/'), '/blog/updates/2026-09-06/');
    assert.equal(mapDigestHostPathToBlog('/about/'), '/about.html');
  });
});

describe('digestOffsiteRedirectUrl', () => {
  it('redirects efortune.tech /digest/ to /blog/ on same host', () => {
    assert.equal(
      digestOffsiteRedirectUrl(new URL('https://efortune.tech/digest/')),
      'https://efortune.tech/blog/',
    );
    assert.equal(
      digestOffsiteRedirectUrl(new URL('https://efortune.tech/digest/updates/2026-09-06/')),
      'https://efortune.tech/blog/updates/2026-09-06/',
    );
  });

  it('redirects digest.efortune.tech host to efortune.tech blog', () => {
    assert.equal(digestOffsiteRedirectUrl(new URL(`https://${DIGEST_HOST}/`)), `${EFORTUNE_ORIGIN}/blog/`);
    assert.equal(
      digestOffsiteRedirectUrl(new URL(`https://${DIGEST_HOST}/updates/2026-11-13/`)),
      `${EFORTUNE_ORIGIN}/blog/updates/2026-11-13/`,
    );
    assert.equal(
      digestOffsiteRedirectUrl(new URL(`https://${DIGEST_HOST}/rss.xml`)),
      `${EFORTUNE_ORIGIN}/blog/rss.xml`,
    );
  });

  it('preserves query strings', () => {
    assert.equal(
      digestOffsiteRedirectUrl(new URL('https://efortune.tech/digest/?tag=ai')),
      'https://efortune.tech/blog/?tag=ai',
    );
  });
});