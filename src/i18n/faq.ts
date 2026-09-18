// FAQ — verified process wording only (V2 Sedo, L1-C/L1-D). No timing promises beyond Sedo's own average, no instalment claims, no tax statements.
export interface FaqItem { q: { en: string; de: string }; a: { en: string; de: string } }

export const FAQ: FaqItem[] = [
  {
    q: { en: 'What is included in the purchase?', de: 'Was ist im Kauf enthalten?' },
    a: {
      en: 'You acquire the domain itself — the right to use the name for the duration of its registration. A website, logo or software is not included. After the transfer you are free to use, resell or redirect the domain.',
      de: 'Sie erwerben die Domain selbst, also das Nutzungsrecht am Namen für die Dauer der Registrierung. Eine Website, ein Logo oder Software gehören nicht dazu. Nach der Übertragung können Sie die Domain frei verwenden, weiterverkaufen oder auf ein bestehendes Projekt leiten.',
    },
  },
  {
    q: { en: 'How does the transfer work?', de: 'Wie läuft die Übertragung ab?' },
    a: {
      en: "The purchase is completed via Sedo's transfer service. You pay into a neutral account provided by Sedo; Sedo releases the payment to the seller only after the domain has been transferred to you. If the transfer does not go through, Sedo refunds the payment. For common extensions Sedo states an average of one to ten business days, depending on the registrars involved; a free Sedo account is required.",
      de: 'Der Kauf wird über Sedos Transfer-Service abgewickelt. Sie zahlen auf ein von Sedo bereitgestelltes Konto; Sedo zahlt den Kaufpreis erst an die Verkäuferin aus, wenn die Domain auf Sie übertragen ist. Kommt die Übertragung nicht zustande, wird der Betrag laut Sedo zurückerstattet. Für gängige Endungen nennt Sedo durchschnittlich ein bis zehn Werktage, abhängig von den beteiligten Registraren; ein kostenloses Sedo-Konto ist erforderlich.',
    },
  },
  {
    q: { en: 'Can I keep my current registrar?', de: 'Kann ich meinen bisherigen Domainanbieter behalten?' },
    a: {
      en: 'Yes. The domain can be transferred to a compatible registrar of your choice; Sedo guides both parties through the transfer process. All you need is an account with that registrar.',
      de: 'Ja. Die Domain kann zu einem kompatiblen Registrar Ihrer Wahl übertragen werden; Sedo begleitet beide Seiten durch den Übertragungsprozess. Sie brauchen bei diesem Registrar lediglich ein Konto.',
    },
  },
  {
    q: { en: 'Are there any additional costs?', de: 'Kommen noch Kosten hinzu?' },
    a: {
      en: 'The price shown is the amount you pay at Sedo. Sedo may charge a fee for certain payment methods; according to Sedo, payment by bank transfer carries no buyer fee. After the transfer you pay the annual renewal fee to your own registrar; renewal fees depend on the extension and your registrar, and your registrar shows the applicable fee before renewal.',
      de: 'Der angezeigte Preis ist der Betrag, den Sie bei Sedo zahlen. Für bestimmte Zahlungsarten kann Sedo eine Gebühr erheben; laut Sedo ist die Zahlung per Überweisung für Käufer gebührenfrei. Nach der Übertragung zahlen Sie die jährliche Verlängerung an Ihren eigenen Registrar; die Verlängerungsgebühr hängt von der Endung und Ihrem Registrar ab, und Ihr Registrar zeigt die geltende Gebühr vor der Verlängerung an.',
    },
  },
  {
    q: { en: 'Which payment options are available?', de: 'Welche Zahlungsoptionen gibt es?' },
    a: {
      en: 'Purchases are handled via Sedo. The standard Sedo Buy Now purchase does not include an instalment option that we have verified. If you have a question about payment for a specific domain, write to us with the domain name.',
      de: 'Käufe werden über Sedo abgewickelt. Der reguläre Sedo-Sofortkauf enthält keine von uns verifizierte Ratenkauf-Funktion. Bei Fragen zur Zahlung für eine bestimmte Domain schreiben Sie uns mit dem Domainnamen.',
    },
  },
  {
    q: { en: 'Why does a domain cost this much?', de: 'Warum kostet eine Domain so viel?' },
    a: {
      en: 'Prices follow what comparable names actually achieve on the secondary market. Publicly reported .ai sales in 2025 ranged from five figures up to $750,000 (Wisdom.ai) and $350,000 (law.ai, via Sedo); agents.ai sold for $125,000 in 2023. Every price here is an asking price based on category, length and comparable sales — not a valuation and not a prediction of future value.',
      de: 'Der Preis richtet sich nach dem, was vergleichbare Namen auf dem Sekundärmarkt tatsächlich erzielen. Öffentlich gemeldete .ai-Verkäufe reichten 2025 von fünfstelligen Beträgen bis zu 750.000 US-Dollar (Wisdom.ai) und 350.000 US-Dollar (law.ai, über Sedo); agents.ai wechselte 2023 für 125.000 US-Dollar den Besitzer. Jeder Preis auf dieser Seite ist ein Angebotspreis, der sich aus Kategorie, Länge und vergleichbaren Verkäufen ergibt — keine Bewertung und keine Prognose eines künftigen Werts.',
    },
  },
  {
    q: { en: 'Do you sell domains for other owners?', de: 'Verkaufen Sie auch Domains anderer Inhaber?' },
    a: {
      en: 'No. Every domain on this site comes from the owner’s own portfolio. There is no third-party brokerage and no marketplace for other sellers.',
      de: 'Nein. Jede Domain auf dieser Website stammt aus dem eigenen Bestand der Betreiberin. Es gibt keine Vermittlung für Dritte und keinen Marktplatz für andere Verkäufer.',
    },
  },
  {
    q: { en: 'What does "enquiry" mean on some domains?', de: 'Was bedeutet „auf Anfrage“ bei einigen Domains?' },
    a: {
      en: 'These domains are not yet listed for Buy Now at Sedo. Send an enquiry with the domain name; the sale is then handled via Sedo as well.',
      de: 'Diese Domains sind noch nicht für den Sofortkauf bei Sedo gelistet. Senden Sie eine Anfrage mit dem Domainnamen; der Verkauf wird dann ebenfalls über Sedo abgewickelt.',
    },
  },
];
