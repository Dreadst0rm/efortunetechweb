/**
 * efortune-site — static Blueprint pages (assets) plus /api/contact.
 */

import { EmailMessage } from 'cloudflare:email';
import { handleContact } from './contact-handler.js';
import { digestLegacyRedirectUrl } from './digest-redirect.js';
import { handleQuickCheck } from './quick-check.js';

async function defaultSendEmail(env, { from, to, raw }) {
  await env.CONTACT_EMAIL.send(new EmailMessage(from, to, raw));
}

function siteOrigin(env, requestUrl) {
  const configured = env?.SITE_ORIGIN;
  if (configured && typeof configured === 'string') {
    return configured.replace(/\/$/, '');
  }
  return requestUrl.origin;
}

/** @param {string} pathname */
function assetPathname(pathname) {
  if (pathname === '/') return '/index.html';
  if (pathname.endsWith('/')) return `${pathname}index.html`;
  if (pathname.includes('.')) return pathname;
  return `${pathname}/index.html`;
}

function isLocalHostname(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.protocol === 'http:' && !isLocalHostname(url.hostname)) {
      const httpsUrl = new URL(request.url);
      httpsUrl.protocol = 'https:';
      return Response.redirect(httpsUrl.toString(), 301);
    }

    const legacyRedirect = digestLegacyRedirectUrl(url, siteOrigin(env, url));
    if (legacyRedirect) {
      return Response.redirect(legacyRedirect, 301);
    }

    if (url.pathname === '/api/contact') {
      return handleContact(request, env, { sendEmail: defaultSendEmail });
    }

    if (url.pathname === '/api/quick-check') {
      return handleQuickCheck(request, env);
    }

    let pathname = assetPathname(url.pathname);
    let assetRequest = new Request(new URL(pathname, url.origin), request);
    let response = await env.ASSETS.fetch(assetRequest);

    if (response.status === 404 && !url.pathname.includes('.')) {
      assetRequest = new Request(new URL(`${url.pathname.replace(/\/$/, '')}.html`, url.origin), request);
      response = await env.ASSETS.fetch(assetRequest);
    }

    if (response.status === 404) {
      const notFound = await env.ASSETS.fetch(
        new Request(new URL('/404.html', url.origin), request),
      );
      if (notFound.ok) {
        return new Response(notFound.body, {
          status: 404,
          headers: notFound.headers,
        });
      }
    }

    if (url.pathname === '/digest/rss.xml' && response.ok) {
      const headers = new Headers(response.headers);
      headers.set('content-type', 'application/rss+xml; charset=utf-8');
      return new Response(response.body, { status: response.status, headers });
    }

    return response;
  },
};
