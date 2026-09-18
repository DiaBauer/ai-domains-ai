// Central site configuration — one place for brand facts. Never hard-code these in pages.
export const SITE = {
  brand: 'AI-DOMAIN.AI',
  url: 'https://ai-domain.ai',
  tagline: { en: 'Premium AI domains — a curated portfolio', de: 'Premium-KI-Domains — ein kuratiertes Portfolio' },
  /** EUR is authoritative. USD is orientation only (rate + date shown wherever USD appears). */
  currency: 'EUR' as const,
  usdReference: { rate: 1.16, label: { en: 'rate 1.16, September 2026', de: 'Kurs 1,16, September 2026' } },
  sedo: {
    /** Verified standard sentence (V2). */
    standard: {
      en: 'Purchases initiated through AI-DOMAIN.AI are handled securely via Sedo.',
      de: 'Käufe, die über AI-DOMAIN.AI initiiert werden, werden sicher über Sedo abgewickelt.',
    },
    /** Sedo's own terms: "Transfer Service" — never "escrow" as the default label. */
    transferService: { en: "Sedo's transfer service", de: 'Sedos Transfer-Service' },
    /** V2: average 1–10 business days for common TLDs, depending on the registrars involved. Qualified wording only. */
    transferTime: {
      en: 'For common extensions Sedo states an average of one to ten business days, depending on the registrars involved; less common extensions can take longer.',
      de: 'Für gängige Endungen nennt Sedo durchschnittlich ein bis zehn Werktage, abhängig von den beteiligten Registraren; weniger übliche Endungen können länger dauern.',
    },
    entities: {
      en: 'For customers residing outside the United States and Canada the contracting party of the Sedo marketplace is Sedo GmbH, Im Mediapark 6B, 50670 Cologne, Germany; for customers in the United States and Canada it is Sedo.com, LLC.',
      de: 'Für Kunden mit Wohnsitz außerhalb der USA und Kanada ist Vertragspartner des Sedo-Marktplatzes die Sedo GmbH, Im Mediapark 6B, 50670 Köln; für Kunden in den USA und Kanada die Sedo.com, LLC.',
    },
    role: {
      en: 'Sedo acts neither as buyer, seller, representative nor broker in the purchase.',
      de: 'Sedo tritt beim Kauf weder als Käufer, Verkäufer, Vertreter noch als Vermittler auf.',
    },
    terms: 'https://sedo.com/us/about-us/policies/domain-marketplace-agreement/',
    transferInfo: { en: 'https://sedo.com/us/services/domain-transfer-service/', de: 'https://sedo.com/de/service/domain-transfer/' },
  },
  /** Trailing slash is canonical on every route (astro.config trailingSlash: 'always'). */
  trailingSlash: true,
};
