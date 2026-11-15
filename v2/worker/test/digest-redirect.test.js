import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import {
  DIGEST_ORIGIN,
  digestOffsiteRedirectUrl,
  mapOnsiteDigestPath,
} from '../digest-redirect.js';

describe('mapOnsiteDigestPath', () => {
  it('maps on-site /digest/* paths to digest.efortune.tech', () => {
    assert.equal(mapOnsiteDigestPath('/digest/'), `${DIGEST_ORIGIN}/`);
    assert.equal(mapOnsiteDigestPath('/digest'), `${DIGEST_ORIGIN}/`);
    assert.equal(mapOnsiteDigestPath('/digest/rss.xml'), `${DIGEST_ORIGIN}/rss.xml`);
    assert.equal(
      mapOnsiteDigestPath('/digest/updates/2026-10-23/'),
      `${DIGEST_ORIGIN}/updates/2026-10-23/`,
    );
    assert.equal(mapOnsiteDigestPath('/digest/updates/2026-10-23'), `${DIGEST_ORIGIN}/updates/2026-10-23/`);
  });

  it('returns null for non-digest paths', () => {
    assert.equal(mapOnsiteDigestPath('/'), null);
    assert.equal(mapOnsiteDigestPath('/contact.html'), null);
  });
});

describe('digestOffsiteRedirectUrl', () => {
  it('redirects efortune.tech /digest/ URLs only', () => {
    assert.equal(
      digestOffsiteRedirectUrl(new URL('https://efortune.tech/digest/')),
      `${DIGEST_ORIGIN}/`,
    );
    assert.equal(
      digestOffsiteRedirectUrl(new URL('https://digest.efortune.tech/')),
      null,
    );
    assert.equal(
      digestOffsiteRedirectUrl(new URL('https://efortune.tech/digest/updates/2026-09-06/')),
      `${DIGEST_ORIGIN}/updates/2026-09-06/`,
    );
  });

  it('preserves query strings', () => {
    assert.equal(
      digestOffsiteRedirectUrl(new URL('https://efortune.tech/digest/?tag=ai')),
      `${DIGEST_ORIGIN}/?tag=ai`,
    );
  });
});