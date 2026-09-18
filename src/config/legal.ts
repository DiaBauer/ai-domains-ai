// Legal freeze (L1, 2026-09-18). Open fields are null and must stay null until Diana / Domain Counsel provide the value.
// Never invent: seller status, VAT statements, tax IDs, phone numbers.
export const LEGAL = {
  operator: {
    name: 'Diana Bauer',
    street: 'Am Urbicher Kreuz 14',
    postalCode: '99099',
    city: 'Erfurt',
    country: { en: 'Germany', de: 'Deutschland' },
    countryCode: 'DE',
  },
  /** Neutral role wording only — no legal-form or tax-status label (D3). */
  operatorRole: { en: 'AI-DOMAIN.AI is offered by', de: 'AI-DOMAIN.AI ist ein Angebot von' },
  /** Wirtschafts-Identifikationsnummer (§ 139c AO): unknown — WAITING FOR DIANA (ELSTER). Shown only if set. */
  wIdNr: null as string | null,
  /** USt-IdNr.: none exists — never shown. */
  ustIdNr: null as string | null,
  /** Telephone: intentionally not published (EuGH C-298/07). Reserved for a later Domain Counsel result. */
  phone: null as string | null,
  /** Seller-status wording: open (Domain Counsel). null = no public statement. */
  sellerStatusStatement: { en: null as string | null, de: null as string | null },
  /** § 18 (2) MStV responsible person — voluntary, recommended (L1-A). */
  contentResponsible: true,
  /** VSBG: variant B (voluntary statement) is the default; set to false for variant A (omit). */
  vsbgStatement: true,
  /** Supervisory authority for the privacy policy (address to be verified before production — L1-B). */
  supervisoryAuthority: {
    name: 'Thüringer Landesbeauftragter für den Datenschutz und die Informationsfreiheit (TLfDI)',
    address: 'Häßlerstraße 8, 99096 Erfurt', // VERIFY on tlfdi.de before production
    url: 'https://www.tlfdi.de',
    verified: false,
  },
  /** Mailbox provider for the privacy policy section 5 — WAITING FOR DIANA. */
  mailboxProvider: null as null | { name: string; address: string; euOnly: boolean },
  /** Price / tax notice — SAFE NOW wording from L1-C (P1). No VAT statement until the classification is final. */
  priceNotice: {
    en: "Prices are shown in EUR and correspond to the Buy Now prices listed at Sedo. Under Sedo's marketplace terms, the Buy Now price is the end price for the buyer, including any applicable taxes. The amount is confirmed in the Sedo purchase process before you buy.",
    de: 'Preise in EUR entsprechen den bei Sedo gelisteten Sofortkaufpreisen. Nach den Marktplatzbedingungen von Sedo ist der Sofortkaufpreis der Endpreis für den Käufer einschließlich etwaiger anfallender Steuern. Der Betrag wird im Sedo-Kaufprozess vor dem Kauf bestätigt.',
  },
  priceNoticeShort: {
    en: 'Prices in EUR = Buy Now prices at Sedo',
    de: 'Preise in EUR = Sofortkaufpreise bei Sedo',
  },
  usdNotice: {
    en: 'USD figures are approximate conversions for orientation only (rate 1.16, September 2026); you pay the EUR price.',
    de: 'USD-Angaben sind ungefähre Umrechnungen zur Orientierung (Kurs 1,16, September 2026); Sie zahlen den EUR-Preis.',
  },
  /** Theme preference is stored in sessionStorage only after an explicit user toggle (documented in the privacy policy, § 25 (2) no. 2 TDDDG). */
  themeStorage: 'sessionStorage' as const,
  lastReviewed: '2026-09-18',
};
