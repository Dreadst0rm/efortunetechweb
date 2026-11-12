/**
 * efortune-site — static Blueprint pages (assets) plus /api/contact.
 */

import { EmailMessage } from 'cloudflare:email';
import { handleContact } from './contact-handler.js';

async function defaultSendEmail(env, { from, to, raw }) {
  await env.CONTACT_EMAIL.send(new EmailMessage(from, to, raw));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      return handleContact(request, env, { sendEmail: defaultSendEmail });
    }

    let pathname = url.pathname;
    if (pathname === '/') pathname = '/index.html';

    let assetRequest = new Request(new URL(pathname, url.origin), request);
    let response = await env.ASSETS.fetch(assetRequest);

    if (response.status === 404 && !pathname.includes('.')) {
      assetRequest = new Request(new URL(`${pathname}.html`, url.origin), request);
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

    return response;
  },
};
