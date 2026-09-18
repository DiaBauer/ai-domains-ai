// Canonical domain data layer — the ONLY place that reads the source files.
// Source of truth: data/domain-content_2026-09-18.json (D5 content, 75 domains) + overlays in data/.
import content from '../../data/domain-content_2026-09-18.json';
import sedoLive from '../../data/sedo-live.json';
import bundlesFile from '../../data/bundles.json';
import featuredFile from '../../data/featured.json';
import statusFile from '../../data/status-overrides.json';
import type { Lang } from './i18n';

export type SaleMode = 'buy_now' | 'inquiry' | 'sold';
export type Tier = 'S' | 'A' | 'B';

export interface DomainRecord {
  /** Literal domain name — never translated, never altered for display. */
  domain: string;
  /** ASCII/Punycode form for URLs and registrar/Sedo links (IDN only). */
  domainAscii: string;
  slug: string;
  tld: string;
  base: string;
  registrar: string;
  /** Original 10-value category from the dataset. */
  categoryRaw: string;
  /** Seven-category taxonomy (A4). */
  category: CategorySlug;
  tier: Tier;
  priceEur: number;
  saleMode: SaleMode;
  sedoUrl: { en: string; de: string };
  featured: boolean;
  heroPick: boolean;
  bundles: string[];
  pitch: { en: string; de: string };
  description: { en: string; de: string };
  ideas: { en: string[]; de: string[] };
  buyers: { en: string; de: string };
  marketContext: { en: string; de: string; source: string } | null;
  sourceNotes: string;
}

export type CategorySlug =
  | 'agents'
  | 'conversational-ai'
  | 'healthcare-ai'
  | 'finance-ai'
  | 'education-ai'
  | 'business-ai'
  | 'artificial-intelligence';

export const CATEGORY_SLUGS: CategorySlug[] = [
  'artificial-intelligence',
  'agents',
  'conversational-ai',
  'finance-ai',
  'healthcare-ai',
  'business-ai',
  'education-ai',
];

const RAW_TO_CATEGORY: Record<string, CategorySlug> = {
  agents: 'agents',
  voice: 'conversational-ai',
  chat: 'conversational-ai',
  health: 'healthcare-ai',
  finance: 'finance-ai',
  education: 'education-ai',
  industry: 'business-ai',
  ecommerce: 'business-ai',
  media: 'business-ai',
  core: 'artificial-intelligence',
};

// Punycode for the single IDN in the portfolio (verified with Node url.domainToASCII).
const IDN_ASCII: Record<string, string> = { 'künstliche-intelligenz.bayern': 'xn--knstliche-intelligenz-8hc.bayern' };

export function slugify(domain: string): string {
  return domain
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/\./g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function sedoUrl(ascii: string, lang: Lang): string {
  return `https://sedo.com/search/details/?domain=${ascii}&language=${lang === 'en' ? 'us' : 'de'}`;
}

const liveSet = new Set<string>(sedoLive.domains);
const overrides: Record<string, SaleMode | 'available'> = (statusFile as any).overrides ?? {};
const heroSet = new Set<string>(featuredFile.hero);
const homeSet = new Set<string>(featuredFile.home);
const bundleMembership = new Map<string, string[]>();
for (const b of bundlesFile.bundles) for (const d of b.domains) bundleMembership.set(d, [...(bundleMembership.get(d) ?? []), b.id]);

function resolveSaleMode(domain: string): SaleMode {
  const o = overrides[domain];
  if (o === 'sold') return 'sold';
  if (o === 'inquiry') return 'inquiry';
  if (o === 'available') return 'buy_now';
  return liveSet.has(domain) ? 'buy_now' : 'inquiry';
}

export const DOMAINS: DomainRecord[] = (content as any).domains.map((d: any) => {
  const ascii = IDN_ASCII[d.domain] ?? d.domain;
  const dot = d.domain.lastIndexOf('.');
  const rec: DomainRecord = {
    domain: d.domain,
    domainAscii: ascii,
    slug: slugify(d.domain),
    tld: d.tld,
    base: d.domain.slice(0, dot),
    registrar: d.registrar,
    categoryRaw: d.category,
    category: RAW_TO_CATEGORY[d.category],
    tier: d.tier,
    priceEur: d.price_eur,
    saleMode: resolveSaleMode(d.domain),
    sedoUrl: { en: sedoUrl(ascii, 'en'), de: sedoUrl(ascii, 'de') },
    featured: homeSet.has(d.domain),
    heroPick: heroSet.has(d.domain),
    bundles: bundleMembership.get(d.domain) ?? [],
    pitch: { en: d.pitch_en, de: d.pitch_de },
    description: { en: d.description_en, de: d.description_de },
    ideas: { en: d.ideas_en, de: d.ideas_de },
    buyers: { en: d.buyers_en, de: d.buyers_de },
    marketContext: d.market_context ?? null,
    sourceNotes: d.source_notes ?? '',
  };
  if (!rec.category) throw new Error(`Unknown category "${d.category}" for ${d.domain}`);
  return rec;
});

// Integrity checks at build time — the site must never silently show 74 or 76 domains.
{
  const names = new Set(DOMAINS.map((d) => d.domain));
  if (DOMAINS.length !== 75 || names.size !== 75) throw new Error(`Expected 75 unique domains, got ${DOMAINS.length}/${names.size}`);
  const slugs = new Set(DOMAINS.map((d) => d.slug));
  if (slugs.size !== 75) throw new Error('Duplicate slugs');
  for (const name of liveSet) if (!names.has(name)) throw new Error(`sedo-live.json lists unknown domain ${name}`);
  for (const b of bundlesFile.bundles) for (const name of b.domains) if (!names.has(name)) throw new Error(`Bundle ${b.id} lists unknown domain ${name}`);
}

export const TIER_RANK: Record<Tier, number> = { S: 0, A: 1, B: 2 };
export const rank = (d: DomainRecord) => TIER_RANK[d.tier] * 1_000_000 - d.priceEur;
export const sortedDomains = [...DOMAINS].sort((a, b) => rank(a) - rank(b));
export const bySlug = (slug: string) => DOMAINS.find((d) => d.slug === slug);
export const byName = (name: string) => DOMAINS.find((d) => d.domain === name);
export const heroDomains = (): DomainRecord[] => featuredFile.hero.map((n) => byName(n)!).filter(Boolean);
export const homeFeatured = (): DomainRecord[] => featuredFile.home.map((n) => byName(n)!).filter(Boolean);
export const inCategory = (c: CategorySlug) => sortedDomains.filter((d) => d.category === c);

/** Related domains: same category first (by rank), then same TLD family — never the domain itself. */
export function related(d: DomainRecord, n = 4): DomainRecord[] {
  const family = DOMAINS.filter((x) => x.domain !== d.domain && x.base === d.base);
  const sameCat = sortedDomains.filter((x) => x.domain !== d.domain && x.category === d.category && x.base !== d.base);
  const out = [...family, ...sameCat];
  return out.slice(0, n);
}

export interface Bundle {
  id: string;
  name: { en: string; de: string };
  domains: DomainRecord[];
  text: { en: string; de: string };
  audience: { en: string; de: string };
  priceIndividualEur: number;
  priceBundleEur: number;
  savingEur: number;
  /** A bundle is offerable only while none of its domains is sold. */
  available: boolean;
}

export const BUNDLES: Bundle[] = bundlesFile.bundles.map((b) => {
  const ds = b.domains.map((n) => byName(n)!);
  return {
    id: b.id,
    name: { en: b.name_en, de: b.name_de },
    domains: ds,
    text: { en: b.text_en, de: b.text_de },
    audience: { en: b.for_en, de: b.for_de },
    priceIndividualEur: b.price_individual_eur,
    priceBundleEur: b.price_bundle_eur,
    savingEur: b.saving_eur,
    available: ds.every((d) => d.saleMode !== 'sold'),
  };
});

export const STATS = {
  count: DOMAINS.length,
  buyNow: DOMAINS.filter((d) => d.saleMode === 'buy_now').length,
  inquiry: DOMAINS.filter((d) => d.saleMode === 'inquiry').length,
  sold: DOMAINS.filter((d) => d.saleMode === 'sold').length,
  tlds: new Set(DOMAINS.map((d) => d.tld)).size,
};

export function formatEur(n: number, lang: Lang): string {
  return lang === 'de' ? `${n.toLocaleString('de-DE')} €` : `€${n.toLocaleString('en-US')}`;
}

/** Approximate USD reference — orientation only, never authoritative (F7). */
export function approxUsd(eur: number, rate = 1.16): string {
  return `≈ $${(Math.round((eur * rate) / 10) * 10).toLocaleString('en-US')}`;
}
