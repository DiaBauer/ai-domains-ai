# SESSION HANDOFF — AI-DOMAIN.AI Astro relaunch — 2026-09-18 (evening)

Resume tomorrow by reading, in this order:
1. this file
2. `docs/ASTRO-RELAUNCH-IMPLEMENTATION-REPORT.md` (what was built, how, QA results)
3. `docs/PRODUCTION-LAUNCH-CHECKLIST.md` (blockers, launch steps)

Nothing in this handoff duplicates those two files — it records the exact state plus the owner decisions taken **after** the implementation prompt.

---

## 1. Repository state

| | |
|---|---|
| Repository | DiaBauer/ai-domains-ai |
| Branch | `relaunch/astro-premium-2026-09-18` |
| Base | `hotfix/trust-language-mobile` @ `6e4a9c2` |
| Commits on the branch | `6eb27c6` relaunch · `75573cf` vercel.json fix · `bafca0f` contact function ESM fix · `2f84508` docs · (this handoff commit follows) |
| `origin/main` | `d36729c` — **unchanged** |
| Production (ai-domain.ai) | **unchanged** — production deployment is still `dpl_2TsYq5M4aAMWdvLiMC6UEriiZ3bm` (main) |
| Working tree | clean after the handoff commit |

Local clone used tonight: session scratchpad `…/scratchpad/repo-domains`. If it is gone tomorrow, clone the branch fresh; `npm ci && npm run build && npm run check && npm run qa` must be green before any change.

## 2. Preview / deployment

| | |
|---|---|
| Deployment (state of commit `bafca0f`) | `dpl_3fnr3FYabK856M8CtT32LXP9gdBp` |
| Current preview URL | https://ai-domains-9wx2zw6i1-bestkaufs-projects.vercel.app |
| Temporary share link (**expires 19.09.2026 18:58**) | https://ai-domains-9wx2zw6i1-bestkaufs-projects.vercel.app/?_vercel_share=duGD7fUaBAwhxsIOhTe4Ma01wwiQFNun |
| Persistent branch alias (**durable reference**, always the latest build of the branch) | https://ai-domains-ai-git-relaunch-astro-prem-af770b-bestkaufs-projects.vercel.app |

Notes:
- The share link is temporary. The branch alias is the durable preview reference.
- If the share link has expired tomorrow: generate a new share link for the current **PREVIEW** deployment only (`get_access_to_vercel_url` on the preview URL).
- Do **not** weaken Production security: Vercel Authentication stays `all_except_custom_domains`; nothing is changed globally.
- Every preview host answers with `X-Robots-Tag: noindex, nofollow` (vercel.json host rule).
- Vercel project: `ai-domains-ai` (`prj_KNWzLoJiq2Hywph9c2V1DjowORnL`), team `bestkaufs-projects` (`team_M0QmZuLlWzTL7i5M21R6DtO5`), Hobby plan.

## 3. Completed state (contained in the current build)

- Astro 7.3.3 static architecture (`trailingSlash: always`, directory output), Node 24
- EN at `/` and DE at `/de/` as real routes with proper hreflang (en / de / x-default) on every page
- 75 domains from the canonical data layer; 75 detail pages per locale; **191 generated pages**
- 7 categories · bundles (5 + custom) · market · how-it-works · 2 guides · about · contact · FAQ · imprint · privacy · 404
- sitemap (190 URLs, i18n links) · robots.txt · JSON-LD @graph (Product with EUR offer only for buy_now)
- Preview `noindex, nofollow`; production robots allow
- Dark + Light themes (system default, toggle, sessionStorage only after explicit toggle)
- Hero Light Sweep (logo-masked band + headline phrase), smaller animated logo (236 px), off ≤ 720 px / reduced motion
- Mobile QA at 375 and 390 (28 routes, no overflow), desktop 1400×900 both themes
- Contact endpoint `api/contact.js` (ESM) prepared — returns 503 `not_configured` until env vars exist; form shows the graceful "not connected" message
- `scripts/qa.mjs` = **0 failures** (route crawl, links, hreflang, JSON-LD, sitemap, domain invariants, claim + entity audit)

## 4. Documentation already created (do not duplicate)

- `docs/ASTRO-RELAUNCH-IMPLEMENTATION-REPORT.md`
- `docs/PRODUCTION-LAUNCH-CHECKLIST.md`
- Copies in `C:\Users\diana\Documents\claude_ai_domains_ai\Astro_Relaunch_2026-09-18\`

## 5. NEW owner decision for tomorrow — NOT yet implemented

### Homepage featured domains → daily rotating curated showcase

The six featured domains at the top of the homepage must **not** permanently be the six most expensive domains (today: `data/featured.json` → `hero` list, rendered by `Hero.astro`; home grid uses `homeFeatured`).

Implement a rotating curated showcase:
- exactly **6** domains shown
- selection changes **daily**, **deterministic by date** (build-time or pure date function — same result for everyone on the same day)
- no cookies, no tracking, **not random on every reload**
- balanced price mix: premium · mid-range · more accessible / lower-priced
- mix categories / TLDs where practical
- all cards remain visually equal and premium
- **never** label them "popular", "in demand", "new" or anything implying activity
- concept: a changing shop window / curated selection

Suggested wording (may be refined during review):
- EN: **Selected from the portfolio** — A rotating selection from our domain portfolio.
- DE: **Aus dem Portfolio ausgewählt** — Eine wechselnde Auswahl aus unserem Domainbestand.

Implementation note for tomorrow: a static build is frozen at build time, so "daily" needs either a scheduled daily rebuild (Vercel deploy hook / cron) or a tiny client-side date-seeded pick over a server-rendered candidate set (all candidates in the HTML, JS shows 6 by day-of-year; no-JS fallback shows a fixed 6). Decide during review; both are cookie-free.

## 6. Legal / Domain Counsel update (review complete — working conclusion)

- Income-tax **private portfolio liquidation / private asset disposal** is currently the stronger supported position.
- No current obligation to register a domain-trading Gewerbe is sufficiently established from the known facts.
- VAT and individual § 23 EStG cases remain transaction/domain-specific.
- Therefore **do NOT publicly claim** any of: private sale · tax free · Kleinunternehmer · VAT exempt · commercial seller · plus VAT / net price.

Current safe public positioning (to be used where seller status is described):
- DE: *Alle angebotenen Domains stammen aus eigenem, langjährig aufgebautem Domainbestand. AI-DOMAIN.AI vermittelt keine Domains Dritter.*
- EN: *All domains offered on AI-DOMAIN.AI come from our own long-held portfolio. AI-DOMAIN.AI does not broker third-party domains.*

(`src/config/legal.ts` → `sellerStatusStatement` is still `null`; this wording is a candidate for it and for about/FAQ — apply only after Diana's confirmation during review item F/G.)

## 7. Current Impressum facts

- Operator: **Diana Bauer**
- Address: Am Urbicher Kreuz 14, 99099 Erfurt, Germany
- Planned e-mail: **info@ai-domain.ai** — **the mailbox does NOT exist yet**
- There is currently: no registered KI.services Gewerbe · no USt-IdNr. · no confirmed W-IdNr. · only personal/private German tax identifiers, which must **not** be published

Therefore, on the site:
- no personal Steuer-ID · no ordinary Finanzamt Steuernummer · no invented USt-IdNr.
- no W-IdNr. line unless Diana later confirms an actually assigned number (config stays `wIdNr: null`, `ustIdNr: null`)
- no "Einzelunternehmen" · no "Privatverkäuferin" · no "Kleinunternehmerin"

## 8. Open review items for tomorrow (preserve; not implemented tonight)

- **A.** Visual review of the preview (Diana)
- **B.** Daily rotation of the six homepage featured domains (section 5)
- **C.** JSON-LD: current implementation uses `Organization` (home/about, and as `seller` in Product offers); review whether `Person` + `WebSite` is more accurate for the current operator situation
- **D.** Review whether USD approximate prices should be removed completely — EUR is authoritative and a static USD rate (`usdReference` 1.16) becomes stale
- **E.** Review sessionStorage theme persistence against the Privacy policy (§ 7)
- **F.** Replace/check the current Impressum against the final concise approved wording
- **G.** Review price wording (`priceNotice`, footer line, detail-page price note)
- **H.** Review Contact / Resend once the mailbox exists
- **I.** Full owner review of: Hero · Light Sweep · Dark/Light · mobile · domain cards · bundles · market page · EN/DE · legal pages

## 9. Production blockers (explicit)

- info@ai-domain.ai mailbox must be created **and tested**
- Resend domain / API key / region decision + Vercel env vars (`RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO`)
- final legal wording patch (Impressum, seller positioning)
- final actual Privacy-vs-implementation check
- final price/tax wording
- Vercel Pro / commercial plan decision
- Diana's visual/content approval

**W-IdNr. is NOT currently a production blocker** — no assigned W-IdNr. is known; the line simply stays absent.

## 10. Safety rules (unchanged)

Do not merge. Do not deploy Production. Do not change DNS. Do not change Sedo. Do not change Vercel billing. Do not configure Resend externally. Do not create the mailbox. Do not touch AGENTS.md / CLAUDE.md, the parked website-intelligence-audit project, or research/source files.
