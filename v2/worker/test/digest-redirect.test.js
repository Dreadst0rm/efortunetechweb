import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DIGEST_LEGACY_HOST, digestLegacyRedirectUrl, mapDigestLegacyPath } from '../digest-redirect.js';

describe('mapDigestLegacyPath', () => {
  it('maps digest.efortune.tech paths to /digest/ tree', () => {
    assert.equal(mapDigestLegacyPath('/'), '/digest/');
    assert.equal(mapDigestLegacyPath('/about/'), '/digest/');
    assert.equal(mapDigestLegacyPath('/rss.xml'), '/digest/rss.xml');
    assert.equal(mapDigestLegacyPath('/sitemap.xml'), '/sitemap.xml');
    assert.equal(mapDigestLegacyPath('/updates/2026-10-23/'), '/digest/updates/2026-10-23/');
    assert.equal(mapDigestLegacyPath('/updates/2026-10-23'), '/digest/updates/2026-10-23/');
  });
});

describe('digestLegacyRedirectUrl', () => {
  it('returns null for other hosts', () => {
    assert.equal(
      digestLegacyRedirectUrl(new URL('https://efortune.tech/digest/')),
      null,
    );
  });

  it('builds absolute redirect URLs on efortune.tech', () => {
    const url = digestLegacyRedirectUrl(
      new URL(`https://${DIGEST_LEGACY_HOST}/updates/2026-09-06/`),
      'https://efortune.tech',
    );
    assert.equal(url, 'https://efortune.tech/digest/updates/2026-09-06/');
  });
});
