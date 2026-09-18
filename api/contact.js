// AI-DOMAIN.AI contact form — Vercel Node Function (D2: website → function → Resend → info@ai-domain.ai).
// No form database, no tracking, no logging of message content, IP only transient for rate limiting.
// Fails gracefully (503) when RESEND_API_KEY / CONTACT_FROM / CONTACT_TO are not configured — never breaks the build.
// Env (set in Vercel, never in the repo): RESEND_API_KEY, CONTACT_FROM (verified @ai-domain.ai sender), CONTACT_TO (info@ai-domain.ai).

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map(); // per-instance best-effort rate limit
const SUBJECTS = new Set(['buy', 'bundle', 'payment', 'other']);
const SUBJECT_LABEL = { buy: 'Kaufanfrage / buying enquiry', bundle: 'Paket / bundle', payment: 'Zahlungsoptionen / payment options', other: 'Sonstiges / other' };

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function str(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  const ct = String(req.headers['content-type'] || '');
  if (ct.includes('application/json')) { try { return JSON.parse(raw); } catch { return {}; } }
  if (ct.includes('application/x-www-form-urlencoded')) return Object.fromEntries(new URLSearchParams(raw).entries());
  try { return JSON.parse(raw); } catch { return {}; }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { ok: false });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return send(res, 429, { ok: false });
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();

  const b = await readBody(req);
  if (str(b._gotcha, 10)) return send(res, 200, { ok: true }); // honeypot: pretend success

  const name = str(b.name, 120);
  const email = str(b.email, 200);
  const message = str(b.message, 4000);
  const domain = str(b.domain, 80);
  const subject = str(b.subject, 20);
  const lang = str(b.lang, 2) === 'de' ? 'de' : 'en';
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return send(res, 400, { ok: false });
  if (subject && !SUBJECTS.has(subject)) return send(res, 400, { ok: false });

  const { RESEND_API_KEY, CONTACT_FROM, CONTACT_TO } = process.env;
  if (!RESEND_API_KEY || !CONTACT_FROM || !CONTACT_TO) return send(res, 503, { ok: false, reason: 'not_configured' });

  const text = [
    'Anfrage über ai-domain.ai / enquiry via ai-domain.ai',
    '',
    `Name: ${name}`,
    `E-Mail: ${email}`,
    `Anliegen / subject: ${SUBJECT_LABEL[subject] || '-'}`,
    `Domain: ${domain || '-'}`,
    `Sprache / language: ${lang}`,
    '',
    message,
    '',
  ].join('\n');

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9000);
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: ctrl.signal,
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        reply_to: email,
        subject: `Anfrage über ai-domain.ai${domain ? ' — ' + domain : ''}`,
        text,
      }),
    });
    return send(res, r.ok ? 200 : 502, { ok: r.ok });
  } catch {
    return send(res, 502, { ok: false });
  } finally {
    clearTimeout(timer);
  }
};
