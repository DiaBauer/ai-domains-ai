#!/usr/bin/env node
// AI-DOMAIN.AI build QA — runs against ./dist after `npm run build`.
// Checks: route inventory, internal links, hreflang pairs, canonical/title/description uniqueness,
// domain invariants (75 domains, identical EN/DE sets, never-translated markup), JSON-LD parse + EUR-only offers,
// sitemap validity, language leakage (heuristic), and the forbidden claim / entity-residue audit.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SITE = 'https://ai-domain.ai';
const fail = [];
const warn = [];
const ok = (m) => console.log('  ok   ' + m);

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const routeOf = (f) => '/' + relative(DIST, f).split(sep).join('/').replace(/index\.html$/, '').replace(/\.html$/, '');
const pages = new Map(htmlFiles.map((f) => [routeOf(f), readFileSync(f, 'utf8')]));
const routes = new Set(pages.keys());
console.log(`\nAI-DOMAIN.AI QA — ${pages.size} HTML pages in dist\n`);

// ---------- 1. route inventory ----------
const expectRoutes = ['/', '/de/', '/domains/', '/de/domains/', '/bundles/', '/de/bundles/', '/market/', '/de/market/', '/how-it-works/', '/de/how-it-works/', '/guides/', '/de/guides/', '/about/', '/de/about/', '/contact/', '/de/contact/', '/faq/', '/de/faq/', '/imprint/', '/de/imprint/', '/privacy/', '/de/privacy/', '/404'];
for (const r of expectRoutes) if (!routes.has(r)) fail.push(`missing route ${r}`);
const detailEn = [...routes].filter((r) => /^\/domains\/[^/]+\/$/.test(r));
const detailDe = [...routes].filter((r) => /^\/de\/domains\/[^/]+\/$/.test(r));
const catEn = [...routes].filter((r) => /^\/categories\/[^/]+\/$/.test(r));
const catDe = [...routes].filter((r) => /^\/de\/categories\/[^/]+\/$/.test(r));
if (detailEn.length !== 75) fail.push(`expected 75 EN detail pages, got ${detailEn.length}`);
if (detailDe.length !== 75) fail.push(`expected 75 DE detail pages, got ${detailDe.length}`);
if (catEn.length !== 7 || catDe.length !== 7) fail.push(`expected 7+7 category pages, got ${catEn.length}+${catDe.length}`);
const slugsEn = detailEn.map((r) => r.split('/')[2]).sort();
const slugsDe = detailDe.map((r) => r.split('/')[3]).sort();
if (JSON.stringify(slugsEn) !== JSON.stringify(slugsDe)) fail.push('EN and DE detail slug sets differ');
ok(`routes: ${detailEn.length}+${detailDe.length} detail, ${catEn.length}+${catDe.length} category, ${expectRoutes.length} fixed`);

// ---------- 2. data invariants ----------
const content = JSON.parse(readFileSync(new URL('../data/domain-content_2026-09-18.json', import.meta.url), 'utf8'));
const contentDomains = (content.domains || content).map((d) => d.domain);
if (contentDomains.length !== 75) fail.push(`content JSON has ${contentDomains.length} domains, expected 75`);
if (new Set(contentDomains).size !== contentDomains.length) fail.push('duplicate domains in content JSON');

// ---------- 3. per-page checks ----------
const attr = (html, re) => (html.match(re) || [])[1];
const titles = new Map();
const descs = new Map();
const internalLinks = new Set();
const forbiddenClaims = [
  /\bIn demand\b/i, /\bGefragt\b/, /No\. ?1 most expensive/i, /\b698 \.ai\b/, /\bguaranteed\b/i, /\bgarantiert\b/i, /\binvestment return\b/i, /\bROI\b/, /\bappreciat(e|ion)\b/i, /\bWertsteigerung\b/i,
  /24[–-]72 hours/i, /24[–-]72 Stunden/i, /\b1[–-]3 days\b/i, /\b1[–-]3 Tage\b/i, /\bescrow\b/i, /\bTreuhand\b/i, /lease[- ]to[- ]own/i, /\binstalment payment\b/i, /\binstallment\b/i, /\bRatenzahlung\b/i, /Preise netto/i, /Prices net\b/i, /\bnetto\b/i,
  /ki\.services/i, /kontakt@ki\.services/i, /\bHamburg\b/, /IP-Management/i, /\bi\.Gr\.\b/, /AI-DOMAINS\.AI/, /ai-domains\.ai\b/i, /\$ ?11[.,]?0{3}\b/, /≈ ?\$ ?11k/i,
];
const claimHits = [];
const enWords = /\b(the|and|with|from|domain name|purchase|available|enquiry)\b/g;
const deWords = /\b(und|nicht|oder|wird|werden|über|Anfrage|Domain-Name|Kaufen)\b/g;

for (const [route, html] of pages) {
  const lang = attr(html, /<html[^>]*\blang="([a-z]{2})"/);
  const isDe = route.startsWith('/de/');
  if (route !== '/404' && lang !== (isDe ? 'de' : 'en')) fail.push(`${route}: html lang=${lang}`);
  const title = attr(html, /<title>([^<]*)<\/title>/);
  const desc = attr(html, /<meta name="description" content="([^"]*)"/);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  if (!title) fail.push(`${route}: no <title>`);
  if (!desc || desc.length < 50) fail.push(`${route}: description missing/short`);
  if (desc && desc.length > 170) warn.push(`${route}: description ${desc.length} chars`);
  if (route !== '/404') {
    if (canonical !== SITE + route) fail.push(`${route}: canonical ${canonical}`);
    if (titles.has(title)) fail.push(`${route}: duplicate title with ${titles.get(title)}`);
    titles.set(title, route);
    if (descs.has(desc)) fail.push(`${route}: duplicate description with ${descs.get(desc)}`);
    descs.set(desc, route);
    // hreflang: en, de, x-default all present and pointing at existing routes
    const alts = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]);
    const need = ['en', 'de', 'x-default'];
    for (const n of need) if (!alts.some(([h]) => h === n)) fail.push(`${route}: hreflang ${n} missing`);
    for (const [, href] of alts) {
      const p = href.replace(SITE, '');
      if (!routes.has(p)) fail.push(`${route}: hreflang target ${p} does not exist`);
    }
    const de = alts.find(([h]) => h === 'de')?.[1].replace(SITE, '');
    const en = alts.find(([h]) => h === 'en')?.[1].replace(SITE, '');
    if (isDe && de !== route) fail.push(`${route}: hreflang de should be self`);
    if (!isDe && en !== route) fail.push(`${route}: hreflang en should be self`);
  }
  // JSON-LD
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let j;
    try { j = JSON.parse(m[1]); } catch (e) { fail.push(`${route}: JSON-LD parse error ${e.message}`); continue; }
    const graph = j['@graph'] || [j];
    for (const node of graph) {
      if (node['@type'] === 'Product') {
        if (node.aggregateRating || node.review) fail.push(`${route}: Product carries ratings/reviews`);
        if (node.offers) {
          if (node.offers.priceCurrency !== 'EUR') fail.push(`${route}: offer currency ${node.offers.priceCurrency}`);
          if (typeof node.offers.price !== 'number') fail.push(`${route}: offer price not numeric`);
        }
      }
    }
  }
  // internal links
  for (const m of html.matchAll(/\bhref="([^"#?]*)(?:[#?][^"]*)?"/g)) {
    const h = m[1];
    if (!h || h.startsWith('http') || h.startsWith('mailto:') || h.startsWith('tel:') || h.startsWith('data:')) continue;
    if (h.startsWith('/')) internalLinks.add(h);
  }
  // domain-name invariant: every .dn must carry translate="no"
  const dnCount = (html.match(/class="dn notranslate"/g) || []).length;
  const dnNo = (html.match(/class="dn notranslate" translate="no"/g) || []).length;
  if (dnCount !== dnNo) fail.push(`${route}: ${dnCount - dnNo} domain-name spans without translate="no"`);
  // claim audit on visible text (strip tags + head)
  const body = html.replace(/^[\s\S]*<body[^>]*>/, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  const text = body.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
  for (const re of forbiddenClaims) { const m = text.match(re); if (m) claimHits.push(`${route}: "${m[0]}"`); }
  // language leakage heuristic (visible text, excluding domain names + Sedo standard sentence duplicates)
  const sample = text.replace(/[a-z0-9-]+\.(ai|com|de|ch|net|org|uk|eu|app|bayern|world|international|technology|tools|services|training|vision|academy|help|online|money|finance|news|live|info|direct|place)\b/gi, '');
  const enHits = (sample.match(enWords) || []).length;
  const deHits = (sample.match(deWords) || []).length;
  if (isDe && enHits > deHits * 0.5 + 4 && route !== '/de/imprint/') warn.push(`${route}: possible EN leakage (en=${enHits}, de=${deHits})`);
  if (!isDe && route !== '/404' && deHits > 6 && route !== '/imprint/' && route !== '/privacy/') warn.push(`${route}: possible DE leakage (de=${deHits}, en=${enHits})`);
}
ok(`titles unique (${titles.size}), descriptions unique (${descs.size}), canonicals + hreflang pairs valid`);

// ---------- 4. broken internal links ----------
const exists = (p) => {
  if (routes.has(p)) return true;
  if (p.endsWith('/') && routes.has(p)) return true;
  if (!p.endsWith('/') && routes.has(p + '/')) return false; // must use trailing slash
  const f = join(DIST, ...p.split('/').filter(Boolean));
  return existsSync(f);
};
const broken = [...internalLinks].filter((p) => !exists(p) && !p.startsWith('/api/'));
for (const b of broken) fail.push(`broken/non-canonical internal link: ${b}`);
const noSlash = [...internalLinks].filter((p) => !p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p) && !p.startsWith('/api/'));
for (const p of noSlash) fail.push(`internal link without trailing slash: ${p}`);
ok(`${internalLinks.size} distinct internal link targets resolve`);

// ---------- 5. domain sets EN vs DE identical ----------
const namesOn = (route) => new Set([...(pages.get(route) || '').matchAll(/class="dn notranslate" translate="no" lang="zxx">([\s\S]*?)<\/span>/g)].map((m) => m[1].replace(/<[^>]+>/g, '')));
const dirEn = namesOn('/domains/');
const dirDe = namesOn('/de/domains/');
if (dirEn.size !== 75) fail.push(`EN directory renders ${dirEn.size} domain names, expected 75`);
if ([...dirEn].some((n) => !dirDe.has(n)) || dirEn.size !== dirDe.size) fail.push('EN/DE directory domain-name sets differ');
const missingFromDir = contentDomains.filter((d) => !dirEn.has(d));
if (missingFromDir.length) fail.push(`content domains missing in directory: ${missingFromDir.join(', ')}`);
ok('75 domain names rendered identically in EN and DE directories, all with translate="no"');

// ---------- 6. sitemap ----------
const smIndex = join(DIST, 'sitemap-index.xml');
if (!existsSync(smIndex)) fail.push('sitemap-index.xml missing');
else {
  const idx = readFileSync(smIndex, 'utf8');
  const parts = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  let urls = [];
  for (const p of parts) {
    const f = join(DIST, p.replace(SITE + '/', ''));
    if (!existsSync(f)) { fail.push(`sitemap part missing: ${p}`); continue; }
    const xml = readFileSync(f, 'utf8');
    urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
    const xh = xml.match(/xhtml:link/g)?.length || 0;
    if (!xh) warn.push(`sitemap ${p} has no xhtml:link hreflang entries`);
  }
  const bad = urls.filter((u) => !u.startsWith(SITE + '/') || !u.endsWith('/'));
  if (bad.length) fail.push(`sitemap URLs not canonical: ${bad.slice(0, 5).join(', ')}`);
  const notInSitemap = [...routes].filter((r) => r !== '/404' && !urls.includes(SITE + r));
  if (notInSitemap.length) fail.push(`routes missing from sitemap: ${notInSitemap.slice(0, 8).join(', ')}`);
  const apiInSitemap = urls.filter((u) => u.includes('/api/'));
  if (apiInSitemap.length) fail.push('sitemap contains /api/ entries');
  ok(`sitemap: ${urls.length} URLs, all routes covered, all canonical`);
}

// ---------- 7. robots + static assets ----------
const robots = existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '';
if (!/Sitemap: https:\/\/ai-domain\.ai\/sitemap-index\.xml/.test(robots)) fail.push('robots.txt sitemap line missing');
if (!existsSync(join(DIST, 'og-default.jpg'))) fail.push('og-default.jpg missing');
for (const f of ['fonts/playfair-display-latin.woff2', 'fonts/space-grotesk-latin.woff2', 'fonts/OFL-PlayfairDisplay.txt', 'fonts/OFL-SpaceGrotesk.txt', 'favicon.svg']) if (!existsSync(join(DIST, f))) fail.push(`asset missing: ${f}`);
const googleFonts = htmlFiles.filter((f) => /fonts\.googleapis|fonts\.gstatic/.test(readFileSync(f, 'utf8')));
if (googleFonts.length) fail.push(`${googleFonts.length} pages reference Google Fonts at runtime`);
const external = new Set();
for (const html of pages.values()) for (const m of html.matchAll(/<(?:script|link|img)[^>]+(?:src|href)="(https?:\/\/[^"]+)"/g)) external.add(new URL(m[1]).host);
if ([...external].some((h) => !/^(sedo\.com|ai-domain\.ai)$/.test(h))) warn.push(`external asset hosts: ${[...external].join(', ')}`);
ok('robots.txt, OG image, self-hosted fonts + licences present, no runtime Google Fonts');

// ---------- 8. claim / entity audit ----------
if (claimHits.length) for (const h of claimHits) fail.push(`forbidden claim/entity: ${h}`);
else ok('claim + entity audit: 0 hits');

// ---------- report ----------
console.log('');
for (const w of warn) console.log('  warn ' + w);
for (const f of fail) console.log('  FAIL ' + f);
console.log(`\n${fail.length} failures, ${warn.length} warnings\n`);
process.exit(fail.length ? 1 : 0);
