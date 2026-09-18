# AI-DOMAIN.AI — Astro Premium Relaunch: Implementation Report

**Date:** 2026-09-18
**Branch:** `relaunch/astro-premium-2026-09-18` (base: `hotfix/trust-language-mobile` @ 6e4a9c2)
**Repository:** DiaBauer/ai-domains-ai
**Status:** PREVIEW ONLY — not merged, not in production. `main` unchanged (d36729c), ai-domain.ai unchanged.

---

## 1. Architecture

| Layer | Choice |
|---|---|
| Framework | Astro 7.3.3, `output: 'static'`, `trailingSlash: 'always'`, `build.format: 'directory'`, `compressHTML` |
| Integrations | `@astrojs/sitemap` 3.7.4 (i18n en/de, `/api/` filtered), `@astrojs/check` 0.9.10, TypeScript 6.0.3 (strict) |
| Runtime | Node ≥ 22 (built with 24.14.1) |
| Hosting | Vercel (project `ai-domains-ai`, Hobby plan, static output + one Node function `api/contact.js`) |
| Build | `npm run build` → `dist/` (191 pages, ~5.6 MB incl. fonts and OG image); `npm run check`; `npm run qa` |
| Pages | Thin route files in `src/pages/` (EN) and `src/pages/de/` delegate to shared components in `src/components/pages/*.astro` with a `lang` prop — one implementation, two languages |
| Layout | `src/layouts/Base.astro`: head (title/description/canonical/hreflang/OG/Twitter/theme-color/font preloads/sitemap link), inline theme bootstrap, JSON-LD `@graph`, Header, Footer, reveal-on-scroll |
| Legacy | Old single-page site moved to `legacy/` (index.html, robots.txt, sitemap.xml) for reference; not served |

## 2. Route model

- EN (default, x-default) at `/`, DE at `/de/`.
- Routes (each in both languages): `/`, `/domains/`, `/domains/[slug]/` (75), `/categories/[slug]/` (7), `/bundles/`, `/market/`, `/how-it-works/`, `/guides/`, `/guides/[slug]/` (2), `/about/`, `/contact/`, `/faq/`, `/imprint/`, `/privacy/`; plus `/404`.
- Every page carries `<link rel="alternate" hreflang="en|de|x-default">` pointing at a real counterpart; the language switch in the header goes to the same page in the other language (404 excepted: switch goes to the other home).
- Canonicals are absolute `https://ai-domain.ai/...` with trailing slash; the 404 page is `noindex, follow` without canonical/hreflang.

## 3. Data model

- Canonical source: `data/domain-content_2026-09-18.json` (D5 reviewed content, 75 domains: base/tld, category, tier, price EUR, pitch/why/ideas/buyers in EN+DE, registrar, IDN flag).
- Overlays: `data/sedo-live.json` (58 domains verified at Sedo → `buy_now`), `data/bundles.json` (5 real bundles with existing prices), `data/featured.json` (hero 6 / home 9), `data/status-overrides.json` (`available | inquiry | sold`).
- `src/lib/domains.ts` merges these into `DomainRecord[]`, maps raw categories to the 7 category slugs, derives `slug`, `saleMode`, Sedo URL (Punycode for IDN), and runs **build-time integrity checks** (exactly 75 domains, unique domains, unique slugs, every bundle member exists). A violation fails the build.
- Sale modes: `buy_now` → "Buy on Sedo" (Sedo listing, new tab); `inquiry` → "Ask about this domain" (contact form prefilled); `sold` → chip, no CTA, card dimmed, Product JSON-LD without offer.
- Prices: EUR authoritative (Sedo Buy Now prices). USD shown only as "≈" orientation with rate 1.16 (Sep 2026) and the explicit note that the EUR price is paid.

## 4. Design system

- Tokens in `src/styles/global.css`: dark navy default (`#0b1020` family), light off-white (`#f6f4ef`), blue/cyan/gold accents, rules, shadows, `--sweep-*` colours, `--sweep-blend` (screen in dark, multiply in light).
- Typography: Playfair Display (display, headlines, prices) + Space Grotesk (UI, domain names). Self-hosted variable woff2 (latin + latin-ext) in `public/fonts/`, OFL licences included, `font-display: swap`, two preloads. **No Google Fonts at runtime** (checked by QA).
- Shell 1440 px, content measure 1180 px; selective smoked glass (`.glass`) only for hero asset list, finder, price box, stats, forms; premium buttons (primary/secondary/tertiary/gold); cards; chips; evidence rows; FAQ `details`; breadcrumbs; `.rv` reveal-on-scroll with no-JS fallback.
- Header: sticky, small SVG mark + wordmark, nav (Domains / Finder / Bundles / Market / How it works / About / Contact), language link, theme toggle, mobile burger with Escape handling and body scroll lock.
- Footer: brand claim, explore links, operator address, legal links (Imprint / Privacy), bottom line with the short price notice and USD note.

## 5. Hero light sweep (Variant A)

- `src/components/LogoMark.astro`: inline SVG generated from the brand file `ai-domain-weiss-animiert.svg`. The logo shapes are reused as `<mask id="aid-logo-mask">`; a skewed gradient band `<rect class="aid-band">` slides through the mask (CSS keyframes, 22 s cycle, first pass at 3.8 s, 3 iterations, `mix-blend-mode: var(--sweep-blend)`). Because the band is masked by the logo's own shapes, **no rectangular bounding box can ever appear**.
- Headline phrase: `<em class="sweep-text">the category / die Kategorie</em>` in `Hero.astro` uses a background-clip text gradient sweep (delay 4.9 s), synchronised with the logo.
- Disabled ≤ 720 px and under `prefers-reduced-motion`; the one-time logo draw-in animation also respects reduced motion. Header uses a static small mark.

## 6. Theme handling

- `data-theme` on `<html>`; default follows `prefers-color-scheme`; toggle in the header. `sessionStorage['aid-theme']` is written **only after an explicit toggle** (documented in privacy §7 as a deviation from the L1 draft — L1 review requested). No cookies, no localStorage, no analytics, no third-party requests → no cookie banner.

## 7. Contact form

- Client (`ContactPage.astro`): progressive enhancement; prefill from URL params `?domain=`, `?bundle=`, `?domains=`, `?subject=` (URL state only, nothing stored); validation messages EN/DE; states: sending / success / not connected (503) / error.
- Server (`api/contact.js`, ES module): POST only, JSON or urlencoded, honeypot `_gotcha` (pretends success), per-instance rate limit 5 / 10 min per IP, field limits, 400 invalid, **503 `not_configured` when `RESEND_API_KEY` / `CONTACT_FROM` / `CONTACT_TO` are missing**, Resend API call with `reply_to`, 9 s timeout, no logging of message content, no database.
- Preview state: env vars are **not** set → the form shows "The form is not connected yet. Please write to info@ai-domain.ai." (verified on the preview).

## 8. Legal freeze

- `src/config/legal.ts` holds operator data, nullable `wIdNr` / `ustIdNr` / `phone` / `sellerStatusStatement` (rendered only when set), `contentResponsible` (§ 18 Abs. 2 MStV), `vsbgStatement` (variant B), supervisory authority (TLfDI, address flagged `verified: false`), `priceNotice` (L1-C P1 SAFE NOW wording), `usdNotice`, `themeStorage`, `lastReviewed`.
- Imprint (DE authoritative, EN with "German version prevails") and Privacy (12 sections incl. hosting/Vercel, contact form/Resend, mailbox, Sedo links, third-country transfers, rights) are built from the L1 drafts. No AGB, no VAT statement, no "Preise netto", no OS-platform link, no KI.services residue (QA-checked).

## 9. SEO / structured data

- Unique title + description per page (190 pages, uniqueness enforced by QA), canonical, hreflang, OG/Twitter incl. `og-default.jpg` (1200×630, generated from the brand assets), theme-color per scheme, favicon SVG.
- JSON-LD `@graph`: WebSite (always), Organization (home/about), BreadcrumbList, CollectionPage (directory/categories/bundles), FAQPage (faq), Product with EUR `Offer` **only for `buy_now`** domains; no ratings/reviews.
- `sitemap-index.xml` + `sitemap-0.xml` (190 URLs, xhtml:link hreflang entries), `robots.txt` (Allow /, Disallow /api/, Sitemap line). Preview hosts get `X-Robots-Tag: noindex, nofollow` via `vercel.json` (host condition `(.*)\.vercel\.app`).

## 10. Performance / accessibility

- Static HTML, one shared CSS bundle (~19 KB) + per-page CSS, two small inline scripts (theme bootstrap, reveal), ~1 KB module scripts for header/directory/contact; no framework runtime; fonts preloaded; immutable caching for `/fonts/` and `/_astro/`.
- Skip link, landmarks, one H1 per page, labelled controls, `aria-expanded`/`aria-controls` on the burger, `aria-pressed` on the theme toggle, `aria-live` form status, focus styles, colour contrast on both themes, reduced-motion support, keyboard-closable menu.

## 11. QA performed

- `npx astro build` → 191 pages; `npx astro check` → 0 errors, 0 warnings, 0 hints.
- `node scripts/qa.mjs` → **0 failures**, 7 warnings (descriptions between 171 and 178 chars — acceptable). Checks: route inventory, 75+75 detail pages, 7+7 categories, identical EN/DE slug sets, unique titles/descriptions, canonicals, hreflang pairs to existing targets, all 197 internal link targets resolve with trailing slash, JSON-LD parses (EUR-only numeric offers, no ratings), 75 domain names rendered identically in EN and DE with `translate="no"`, sitemap covers all routes with canonical URLs and no `/api/`, robots/OG/fonts/licences present, no runtime Google Fonts, forbidden-claim + entity-residue audit (In demand, Gefragt, No. 1 most expensive, 698 .ai, guaranteed, ROI, appreciation, 24–72 hours, 1–3 days, escrow, lease-to-own, instalment, Preise netto, Prices net, KI.services, kontakt@ki.services, Hamburg, IP-Management, i.Gr., AI-DOMAINS.AI, ≈ $11k) → 0 hits.
- Browser QA (local `dist` server + Vercel preview): home EN/DE in dark and light, 1400×900 desktop, 375×812 and 390×844 mobile (28 routes checked for horizontal overflow → none); directory finder/filters/search/empty state; detail pages buy_now / inquiry / IDN in both languages; market both themes; bundles; contact prefill + validation + 503/500/200 states; imprint/privacy; mobile menu open/close/Escape; light sweep visible on desktop, hidden on mobile; no console errors.

## 12. Vercel preview

- Latest preview: `dpl_3fnr3FYabK856M8CtT32LXP9gdBp` (READY, target = preview, commit bafca0f) → `https://ai-domains-9wx2zw6i1-bestkaufs-projects.vercel.app`; branch alias (always latest build): `https://ai-domains-ai-git-relaunch-astro-prem-af770b-bestkaufs-projects.vercel.app`. Earlier: `dpl_EVnWn3EU1XViuEo4BxouvDhJ4DcG` ERROR (invalid vercel.json), `dpl_7gZ2nbzJimod2FftrPNDiLAsDjkm` READY but function crashed (CommonJS in ESM package).
- Vercel Authentication stays `all_except_custom_domains`; a temporary share link (23 h) was generated for review — see the final report.
- Verified on the latest preview: `/api/contact` POST → 503 `not_configured`, GET → 405, invalid body → 400; contact form shows the "not connected" message. Headers: `x-robots-tag: noindex, nofollow`, `x-content-type-options`, `x-frame-options`, `referrer-policy`, `permissions-policy`, HSTS (Vercel).

## 13. Commits on the branch

1. `6eb27c6` Astro premium relaunch: EN/DE multipage site, data layer, legal freeze
2. `75573cf` fix: escape regex in vercel.json host condition (invalid JSON broke the preview build)
3. `bafca0f` fix: contact function as ES module (package type module made module.exports fail on Vercel)
4. docs: implementation report + production launch checklist (this file)

## 14. Deviations / decisions taken autonomously

- OG image is JPEG (`og-default.jpg`, 89 KB) instead of PNG (880 KB) — same 1200×630 layout.
- Theme preference in `sessionStorage` (not cookie, not localStorage) — flagged for L1 review, documented in privacy §7.
- Meta descriptions kept between 120 and ~178 chars; a few detail/guide descriptions slightly exceed 160 chars for completeness.
- 404 page is bilingual on one route (Astro convention), `noindex`, language switch → other home.
- `sold` workflow prepared via `data/status-overrides.json`; no domain is currently marked sold.

## 15. Known production blockers (see PRODUCTION-LAUNCH-CHECKLIST.md)

Mailbox `info@ai-domain.ai` not created · Resend domain/API key/env vars not configured (region decision open) · legal review of imprint/privacy pending · Domain Counsel seller/tax wording open · W-IdNr check · TLfDI address unverified · Diana's visual/content approval · Vercel plan (Hobby is non-commercial; Pro upgrade is Diana's decision).
