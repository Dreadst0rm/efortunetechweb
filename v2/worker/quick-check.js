import { isAllowedOrigin, parseAllowedHosts } from './contact-validation.js';
import { isQuickCheckHostname } from './quick-check-hostname.js';

const DOH = 'https://cloudflare-dns.com/dns-query';

export const QUICK_CHECK_JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  'content-security-policy': "default-src 'none'",
};

const RATE_LIMIT_RETRY_SEC = 60;

const CHECK_COPY = {
  spf: {
    pass: 'We found an SPF record. Mail providers can see which servers may send for this domain.',
    warn: 'No SPF record showed up. Outbound mail may be harder to authenticate.',
    fail: 'We could not check SPF for this domain.',
  },
  dmarc: {
    pass: 'DMARC is published with a policy.',
    warn: 'DMARC is missing or has no policy yet. Spoofing reports may be limited.',
    fail: 'We could not check DMARC for this domain.',
  },
  mx: {
    pass: 'MX records are present. This domain is set up to receive email.',
    warn: 'No MX records found. Inbound mail may not be routed.',
    fail: 'We could not check MX for this domain.',
  },
  mta_sts: {
    pass: 'MTA-STS is published. Mail transport can enforce TLS rules for this domain.',
    warn: 'No MTA-STS record found. Transport policy is not advertised.',
    fail: 'We could not check MTA-STS for this domain.',
  },
  tls_rpt: {
    pass: 'TLS reporting is configured. TLS failures can be reported.',
    warn: 'No TLS-RPT record found. You may not get TLS failure reports.',
    fail: 'We could not check TLS-RPT for this domain.',
  },
  dnssec: {
    pass: 'The resolver returned the DNSSEC AD flag for this lookup.',
    warn: 'DNSSEC validation did not show as successful on this query.',
    fail: 'We could not read DNSSEC status for this domain.',
  },
};

/**
 * @param {unknown} body
 * @param {number} status
 * @param {Record<string, string>} [extra]
 */
export function jsonQuickCheckResponse(body, status, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...QUICK_CHECK_JSON_HEADERS, ...extra },
  });
}

/** @param {string} data */
export function isNullMxRdata(data) {
  const raw = String(data ?? '').trim().replace(/\s+/g, ' ');
  if (raw === '0 .' || raw === '0' || raw === '0 .') return true;
  const parts = raw.split(' ');
  if (parts.length >= 2) {
    const pref = parts[0];
    const host = parts.slice(1).join(' ').replace(/\.$/, '').trim();
    return pref === '0' && (host === '' || host === '.');
  }
  return false;
}

/** @param {unknown[]} answers */
export function classifyMxAnswers(answers) {
  if (!Array.isArray(answers) || answers.length === 0) {
    return { status: 'warn', message: CHECK_COPY.mx.warn };
  }
  const rdatas = answers
    .filter((a) => a && a.type === 15)
    .map((a) => String(a.data ?? ''));

  if (rdatas.length === 0) {
    return { status: 'warn', message: CHECK_COPY.mx.warn };
  }

  const allNull = rdatas.every((d) => isNullMxRdata(d));
  if (allNull) {
    return {
      status: 'fail',
      message: 'Null MX is set (0 .). This domain does not accept email.',
    };
  }

  const hasReal = rdatas.some((d) => !isNullMxRdata(d));
  if (hasReal) {
    return { status: 'pass', message: CHECK_COPY.mx.pass };
  }

  return { status: 'warn', message: CHECK_COPY.mx.warn };
}

/** @param {string[]} txts */
export function classifyDmarcTxts(txts) {
  const record = txts.find((t) => /v=DMARC1/i.test(t));
  if (!record) {
    return { status: 'warn', message: CHECK_COPY.dmarc.warn };
  }

  const policyMatch = /(?:^|;)\s*p\s*=\s*(none|quarantine|reject)/i.exec(record);
  const policy = policyMatch ? policyMatch[1].toLowerCase() : null;

  if (!policy) {
    return {
      status: 'warn',
      message: 'DMARC is published but has no p= policy (none, quarantine, or reject).',
    };
  }

  const label =
    policy === 'none'
      ? 'none (monitoring only)'
      : policy === 'quarantine'
        ? 'quarantine'
        : 'reject';

  if (policy === 'none') {
    return {
      status: 'warn',
      message: `DMARC policy is ${label}. Spoofed mail may still be delivered.`,
    };
  }

  return {
    status: 'pass',
    message: `DMARC policy is ${label}.`,
  };
}

/**
 * @param {string} name
 * @param {string} type
 * @param {typeof fetch} fetchImpl
 * @param {number} timeoutMs
 */
async function dohQuery(name, type, fetchImpl, timeoutMs) {
  const url = `${DOH}?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`;
  const res = await fetchImpl(url, {
    headers: { accept: 'application/dns-json' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`doh_http_${res.status}`);
  const data = await res.json();
  return data;
}

/** @param {unknown[]} answers */
function txtAnswers(answers) {
  if (!Array.isArray(answers)) return [];
  const out = [];
  for (const a of answers) {
    if (!a || a.type !== 16) continue;
    if (Array.isArray(a.data)) {
      out.push(a.data.map((p) => String(p)).join(''));
    } else {
      out.push(String(a.data ?? '').replace(/^"|"$/g, ''));
    }
  }
  return out;
}

/**
 * @param {string} domain
 * @param {{ fetchImpl?: typeof fetch; timeoutMs?: number; cache?: Cache }} opts
 */
export async function runQuickCheck(domain, { fetchImpl = fetch, timeoutMs = 5000, cache } = {}) {
  const cacheKey = `https://quick-check.internal/${domain}`;
  if (cache) {
    const hit = await cache.match(cacheKey);
    if (hit) return hit.json();
  }

  const results = [];

  const push = (id, status, message) => {
    const msg = message ?? CHECK_COPY[id][status];
    results.push({ id, status, message: msg });
  };

  try {
    const txt = await dohQuery(domain, 'TXT', fetchImpl, timeoutMs);
    const txts = txtAnswers(txt.Answer);
    const spf = txts.some((t) => /v=spf1/i.test(t));
    push('spf', spf ? 'pass' : 'warn');
    push('dnssec', txt.AD === true ? 'pass' : 'warn');

    const dmarc = await dohQuery(`_dmarc.${domain}`, 'TXT', fetchImpl, timeoutMs);
    const dmarcTxts = txtAnswers(dmarc.Answer);
    const dmarcResult = classifyDmarcTxts(dmarcTxts);
    push('dmarc', dmarcResult.status, dmarcResult.message);

    const mx = await dohQuery(domain, 'MX', fetchImpl, timeoutMs);
    const mxResult = classifyMxAnswers(mx.Answer);
    push('mx', mxResult.status, mxResult.message);

    const mta = await dohQuery(`_mta-sts.${domain}`, 'TXT', fetchImpl, timeoutMs);
    const mtaTxts = txtAnswers(mta.Answer);
    push('mta_sts', mtaTxts.some((t) => /v=STSv1/i.test(t)) ? 'pass' : 'warn');

    const tls = await dohQuery(`_smtp._tls.${domain}`, 'TXT', fetchImpl, timeoutMs);
    const tlsTxts = txtAnswers(tls.Answer);
    push(
      'tls_rpt',
      tlsTxts.some((t) => /v=TLSRPTv1/i.test(t)) ? 'pass' : 'warn',
    );
  } catch {
    for (const id of Object.keys(CHECK_COPY)) {
      const existing = results.find((r) => r.id === id);
      if (!existing) push(id, 'fail');
    }
  }

  const body = { domain, checks: results, checkedAt: new Date().toISOString() };
  if (cache) {
    await cache.put(
      cacheKey,
      new Response(JSON.stringify(body), {
        headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=300' },
      }),
    );
  }
  return body;
}

/**
 * @param {Request} req
 * @param {Record<string, unknown>} env
 * @param {{ fetchImpl?: typeof fetch }} opts
 */
export async function handleQuickCheck(req, env, { fetchImpl } = {}) {
  const allowedHosts = parseAllowedHosts(env?.ALLOWED_HOSTS);
  const origin = req.headers.get('origin');
  if (origin && !isAllowedOrigin(origin, req.url, allowedHosts)) {
    return jsonQuickCheckResponse({ error: 'forbidden' }, 403);
  }

  if (req.method !== 'POST') {
    return jsonQuickCheckResponse({ error: 'method_not_allowed' }, 405, { allow: 'POST' });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return jsonQuickCheckResponse({ error: 'invalid_json' }, 400);
  }

  const domain = typeof payload?.domain === 'string' ? payload.domain.trim().toLowerCase() : '';
  if (!isQuickCheckHostname(domain)) {
    return jsonQuickCheckResponse({ error: 'invalid_domain' }, 400);
  }

  const ip = req.headers.get('cf-connecting-ip') || 'unknown';
  const cache = caches.default;
  const rateKey = `https://quick-check-rate.internal/${ip}`;
  const prior = await cache.match(rateKey);
  let count = 0;
  if (prior) {
    count = Number(await prior.text()) || 0;
  }
  if (count >= 12) {
    return jsonQuickCheckResponse(
      { error: 'rate_limited' },
      429,
      { 'retry-after': String(RATE_LIMIT_RETRY_SEC) },
    );
  }
  await cache.put(
    rateKey,
    new Response(String(count + 1), {
      headers: { 'cache-control': 'public, max-age=60' },
    }),
  );

  const result = await runQuickCheck(domain, { fetchImpl, cache });
  return jsonQuickCheckResponse(result, 200);
}
