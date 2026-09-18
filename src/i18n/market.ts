// Market evidence — ONLY claims from MARKET-CLAIMS-SAFE-LIST.md (S1–S9) and SOURCE-VERIFICATION_V1_MARKET.md (incl. GDR 2025 addendum).
// Every item carries amount, date, venue/scope and source. Nothing here is a forecast.

export interface Sale {
  domain: string;
  amount: string;
  year: number;
  when: { en: string; de: string };
  venue: { en: string; de: string };
  source: { label: string; url?: string };
  note?: { en: string; de: string };
}

export const SALES: Sale[] = [
  {
    domain: 'Wisdom.ai',
    amount: '$750,000',
    year: 2025,
    when: { en: 'October 2025', de: 'Oktober 2025' },
    venue: { en: 'private sale via Grit Brokerage', de: 'Privatverkauf über Grit Brokerage' },
    source: { label: 'DNJournal 2025 sales chart', url: 'https://www.dnjournal.com/' },
    note: { en: 'Largest publicly reported .ai sale of 2025.', de: 'Größter öffentlich gemeldeter .ai-Verkauf 2025.' },
  },
  {
    domain: 'Cloud.ai',
    amount: '$600,000',
    year: 2025,
    when: { en: 'July 2025', de: 'Juli 2025' },
    venue: { en: 'DomainBooth / GoDaddy', de: 'DomainBooth / GoDaddy' },
    source: { label: 'DNJournal 2025 sales chart', url: 'https://www.dnjournal.com/' },
  },
  {
    domain: 'law.ai',
    amount: '$350,000',
    year: 2025,
    when: { en: 'August 2025', de: 'August 2025' },
    venue: { en: 'Sedo', de: 'Sedo' },
    source: { label: 'DNJournal, 14 Aug 2025', url: 'https://www.dnjournal.com/' },
    note: { en: 'Largest .ai sale on Sedo in 2025 (Sedo/InterNetX Global Domain Report 2026, as reported by SIDN).', de: 'Größter .ai-Verkauf bei Sedo 2025 (Sedo/InterNetX Global Domain Report 2026, berichtet von SIDN).' },
  },
  {
    domain: 'Mini.ai',
    amount: '$117,000',
    year: 2025,
    when: { en: 'July 2025', de: 'Juli 2025' },
    venue: { en: 'Sedo', de: 'Sedo' },
    source: { label: 'DNJournal 2025 sales chart', url: 'https://www.dnjournal.com/' },
  },
  {
    domain: 'agents.ai',
    amount: '$125,000',
    year: 2023,
    when: { en: 'July 2023', de: 'Juli 2023' },
    venue: { en: 'buyer B21 Capital', de: 'Käufer B21 Capital' },
    source: { label: 'DNJournal, 13 Jul 2023', url: 'https://www.dnjournal.com/' },
    note: { en: 'At the time the largest publicly reported .ai sale.', de: 'Damals der größte öffentlich gemeldete .ai-Verkauf.' },
  },
];

/** Public top-10 .ai sales of 2024 as published in the Sedo/InterNetX Global Domain Report 2025 (p. 35) — VERIFIED from the local PDF. */
export const GDR2025_TOP10_2024: { domain: string; amount: string }[] = [
  { domain: 'twin.ai', amount: '$95,000' },
  { domain: 'advice.ai', amount: '$80,000' },
  { domain: 'mba.ai', amount: '$50,000' },
  { domain: 'aero.ai', amount: '$35,950' },
  { domain: 'inform.ai', amount: '$30,000' },
  { domain: 'playhouse.ai', amount: '$24,999' },
  { domain: 'reactor.ai', amount: '$20,000' },
  { domain: 'dab.ai', amount: '$17,999' },
  { domain: 'shred.ai', amount: '$17,999' },
  { domain: 'intuitive.ai', amount: '$15,000' },
];

export interface Stat {
  value: string;
  label: { en: string; de: string };
  source: { en: string; de: string };
}

/** Registration facts (verified). No price averages as hero statistics. */
export const ZONE_STATS: Stat[] = [
  {
    value: '598,007',
    label: { en: '.ai domains registered, 31 January 2025', de: '.ai-Domains registriert, 31. Januar 2025' },
    source: { en: 'registry data, Sedo/InterNetX Global Domain Report 2025, p. 31', de: 'Registry-Daten, Sedo/InterNetX Global Domain Report 2025, S. 31' },
  },
  {
    value: '1M+',
    label: { en: '.ai registrations, January 2026', de: '.ai-Registrierungen, Januar 2026' },
    source: { en: 'Government of Anguilla', de: 'Regierung von Anguilla' },
  },
  {
    value: '≈ +67 %',
    label: { en: 'growth of the .ai zone in twelve months', de: 'Wachstum der .ai-Zone in zwölf Monaten' },
    source: { en: '598,007 → over 1 million (Jan 2025 → Jan 2026)', de: '598.007 → über 1 Million (Jan 2025 → Jan 2026)' },
  },
];

/** Additional verified facts from the GDR 2025 (used with year and scope only). */
export const GDR2025_FACTS = {
  aiAverage2024: { value: '$6,525', label: { en: 'average .ai sale price on Sedo in 2024 (2023: $9,681)', de: 'durchschnittlicher .ai-Verkaufspreis bei Sedo 2024 (2023: 9.681 $)' }, source: 'Sedo/InterNetX Global Domain Report 2025, p. 36' },
  firstSale: { en: 'Sedo sold the first .ai domain, poker.ai, in 2008 for £2,500.', de: 'Sedo verkaufte 2008 die erste .ai-Domain, poker.ai, für 2.500 £.' , source: 'Global Domain Report 2025, p. 35' },
  yoy2024: { value: '+71.1 %', label: { en: '.ai registrations year on year, 2024', de: '.ai-Registrierungen im Jahresvergleich, 2024' }, source: 'Domain Tools via Global Domain Report 2025, p. 16' },
};
