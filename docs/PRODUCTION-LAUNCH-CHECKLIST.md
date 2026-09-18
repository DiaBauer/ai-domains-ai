# AI-DOMAIN.AI — Production Launch Checklist (Astro relaunch)

**Branch:** `relaunch/astro-premium-2026-09-18` · **Date:** 2026-09-18
**Rule:** nothing below is done by the assistant without Diana's explicit go. No merge, no production deploy, no DNS/Sedo/Vercel-billing/Resend changes until every BLOCKER is cleared.

Legend: **BLOCKER** = must be cleared before merge/production · **REQUIRED** = must be done at launch · **RECOMMENDED** = should be done soon after.

---

## A. External prerequisites — WAITING FOR DIANA

| # | Item | Level | Owner | Status |
|---|---|---|---|---|
| A1 | Create mailbox **info@ai-domain.ai** (provider of Diana's choice) and confirm it receives mail; then set `mailboxConfirmed: true` in `src/config/contact.ts` and, if applicable, `mailboxProvider` in `src/config/legal.ts` (privacy §5 names the provider) | BLOCKER | Diana | open |
| A2 | Resend: create account/verify sending domain `ai-domain.ai` (SPF/DKIM DNS records at GoDaddy), choose **data region (EU vs US)** — affects privacy §9 wording; create API key | BLOCKER | Diana | open — region decision pending |
| A3 | Vercel env vars for the project (Preview + Production): `RESEND_API_KEY`, `CONTACT_FROM` (verified @ai-domain.ai sender), `CONTACT_TO` (info@ai-domain.ai) — never in the repo | BLOCKER | Diana (assistant can set on instruction) | open |
| A4 | Legal review of `/imprint/` and `/privacy/` (DE authoritative) by a professional; confirm TLfDI address (`verified: false` in `src/config/legal.ts`), theme `sessionStorage` note (§7), Resend region/third-country wording (§9) | BLOCKER | Diana / adviser | open |
| A5 | Domain Counsel / tax adviser: seller-status statement (`sellerStatusStatement`), USt-IdNr or W-IdNr (`ustIdNr`/`wIdNr` — render automatically when set), final price/tax wording (`priceNotice`) | BLOCKER | Diana / adviser | open |
| A6 | Vercel plan: Hobby is for non-commercial use — decide on **Pro upgrade** before commercial launch (Diana's decision; not changed by the assistant) | BLOCKER | Diana | open |
| A7 | Diana's visual + content approval of the preview (share link in the final report; branch alias `ai-domains-ai-git-relaunch-astro-prem-af770b-bestkaufs-projects.vercel.app`) | BLOCKER | Diana | open |

## B. Content / data checks before merge

| # | Item | Level | Status |
|---|---|---|---|
| B1 | Confirm the 58 Sedo Buy Now domains in `data/sedo-live.json` are still live at the listed EUR prices; move any newly verified domain from `inquiry` to `buy_now` | REQUIRED | to verify on launch day |
| B2 | Confirm the 5 bundle prices in `data/bundles.json` | REQUIRED | as of 2026-09-18 |
| B3 | Update the USD orientation rate in `src/config/site.ts` (`usdReference`) if it moved materially | RECOMMENDED | 1.16 (Sep 2026) |
| B4 | Re-run the claim audit after any copy change: `npm run build && npm run qa` (must print `0 failures`) | REQUIRED | passes |
| B5 | Spot-check 5 domain detail pages in DE and EN for typos (D5 content) | RECOMMENDED | — |

## C. Technical launch steps (in order, only after A + B)

1. `npm ci && npm run build && npm run check && npm run qa` locally → all green.
2. Set env vars (A3) in Vercel → redeploy the preview → submit a real test enquiry on the preview → mail arrives at info@ai-domain.ai with `reply_to` = sender. Confirm `503` no longer appears.
3. Open a pull request `relaunch/astro-premium-2026-09-18 → main`; review the diff (the old site lands in `legacy/`).
4. Merge → Vercel production deploy to ai-domain.ai (framework preset `astro` from `vercel.json`, output `dist`).
5. Verify on production: `https://ai-domain.ai/` (200, no `x-robots-tag` header), `/de/`, `/sitemap-index.xml`, `/robots.txt`, `/og-default.jpg`, a detail page, `/api/contact` GET → 405.
6. Google Search Console + Bing: submit `https://ai-domain.ai/sitemap-index.xml`; check hreflang report after a few days.
7. Optional: delete `legacy/` in a follow-up commit once the relaunch is stable.

## D. Post-launch — RECOMMENDED

- Enable Vercel Web Analytics only after a privacy review (would need a privacy-policy update; currently nothing is tracked).
- Monitor `api/contact` runtime logs for 429/502 spikes; adjust rate limit if needed.
- Keep `data/status-overrides.json` current (mark `sold` immediately after a sale; the page then loses its Offer and CTA automatically).
- Review the `lastReviewed` date in `src/config/legal.ts` whenever the legal pages change.
- Consider `Content-Security-Policy` header once the inline scripts are hashed or moved (not included to avoid breaking the theme bootstrap).

## E. Explicitly NOT part of the launch

- No AGB / terms page (Sedo's terms apply — decided in L1).
- No cookie banner (nothing to consent to).
- No `llms.txt`, no analytics, no chat widget.
- No Sedo listing changes, no DNS changes, no GoDaddy/Afternic changes, no Vercel billing changes — all remain Diana's manual decisions.
