import type { CategorySlug } from '../lib/domains';

export interface CategoryCopy {
  slug: CategorySlug;
  name: { en: string; de: string };
  short: { en: string; de: string };
  intro: { en: string; de: string };
  /** Finder use-case label (what a visitor wants to build). */
  useCase: { en: string; de: string };
}

export const CATEGORIES: CategoryCopy[] = [
  {
    slug: 'artificial-intelligence',
    name: { en: 'Artificial Intelligence', de: 'Künstliche Intelligenz' },
    short: { en: 'Core AI terms', de: 'KI-Kernbegriffe' },
    useCase: { en: 'An AI company, lab or information platform', de: 'Ein KI-Unternehmen, Labor oder Informationsportal' },
    intro: {
      en: 'The umbrella terms of the field: artificial intelligence spelled out, its abbreviations (AI, KI, ASI, AGI, AIML) and their regional and descriptive extensions. These names work as company brands, research initiatives and information platforms — they say what the organisation is about before anyone reads a tagline. The group includes the German spelling, the Bavarian regional extension in both languages and several three-letter acronyms.',
      de: 'Die Oberbegriffe des Fachs: künstliche Intelligenz ausgeschrieben, ihre Kürzel (AI, KI, ASI, AGI, AIML) und ihre regionalen und beschreibenden Endungen. Diese Namen funktionieren als Unternehmensmarke, Forschungsinitiative und Informationsplattform — sie sagen, worum es geht, bevor jemand eine Tagline liest. Die Gruppe umfasst die deutsche Schreibweise, die bayerische Regionalendung in beiden Sprachen und mehrere Drei-Buchstaben-Kürzel.',
    },
  },
  {
    slug: 'agents',
    name: { en: 'AI Agents', de: 'KI-Agenten' },
    short: { en: 'Autonomous agents', de: 'Autonome Agenten' },
    useCase: { en: 'A product or service around autonomous agents', de: 'Ein Produkt oder Dienst rund um autonome Agenten' },
    intro: {
      en: 'Software that acts on behalf of a user — planning, executing, negotiating — is currently the most active product category in AI. The names in this group describe the category directly: agent builders, agent services, agent training, agent tools and the German "Agentur" (agency) spelled the way German-speaking buyers search for it. Several families cover the same term across extensions so that a brand and its defensive addresses can be bought together.',
      de: 'Software, die im Auftrag eines Nutzers handelt — plant, ausführt, verhandelt — ist derzeit die aktivste Produktkategorie der KI. Die Namen dieser Gruppe beschreiben die Kategorie direkt: Agent-Builder, Agent-Services, Agent-Training, Agent-Tools und die deutsche „Agentur“ so geschrieben, wie deutschsprachige Käufer suchen. Mehrere Familien decken denselben Begriff über verschiedene Endungen ab, sodass Marke und Schutzadressen zusammen erworben werden können.',
    },
  },
  {
    slug: 'conversational-ai',
    name: { en: 'Conversational & Voice AI', de: 'Conversational & Voice AI' },
    short: { en: 'Chat, voice, telephony', de: 'Chat, Voice, Telefonie' },
    useCase: { en: 'Chatbots, voice assistants or call automation', de: 'Chatbots, Sprachassistenten oder Telefonautomatisierung' },
    intro: {
      en: 'Chatbots, voice assistants and automated telephony share one naming space: the customer talks, the system answers. This group holds the plain category names for chatbots and call agents in several extensions, plus the German voice term on .de. The call-agents family (.net, .eu, .help) is available as a bundle for providers who want the main brand and its support and European variants in one step.',
      de: 'Chatbots, Sprachassistenten und automatisierte Telefonie teilen sich einen Namensraum: Der Kunde spricht, das System antwortet. Diese Gruppe enthält die schlichten Kategoriebegriffe für Chatbots und Call Agents in mehreren Endungen sowie den deutschen Voice-Begriff auf .de. Die call-agents-Familie (.net, .eu, .help) ist als Paket erhältlich — für Anbieter, die Hauptmarke, Support- und Europa-Variante in einem Schritt möchten.',
    },
  },
  {
    slug: 'finance-ai',
    name: { en: 'Finance & Trading', de: 'Finanzen & Trading' },
    short: { en: 'Trading, fintech, crypto', de: 'Trading, Fintech, Krypto' },
    useCase: { en: 'A fintech, trading or crypto product', de: 'Ein Fintech-, Trading- oder Krypto-Produkt' },
    intro: {
      en: 'Trading platforms, market data, personal finance and crypto projects all need a name that is understood by investors everywhere. The group ranges from broad English terms (stock exchange, new trading, AI finance) to Swiss and German variants and the brandable SuperAI pair for consumer (.money) and professional (.finance) use. Any use touching regulated financial services requires the appropriate licences — the domain itself carries no such claim.',
      de: 'Handelsplattformen, Marktdaten, Personal Finance und Krypto-Projekte brauchen einen Namen, den Anleger überall verstehen. Die Gruppe reicht von breiten englischen Begriffen (Stock Exchange, New Trading, AI Finance) über Schweizer und deutsche Varianten bis zum markenfähigen SuperAI-Paar für Verbraucher (.money) und Profis (.finance). Regulierte Finanzdienstleistungen setzen die entsprechenden Zulassungen voraus — die Domain selbst enthält keine solche Zusage.',
    },
  },
  {
    slug: 'healthcare-ai',
    name: { en: 'Health & Medtech', de: 'Gesundheit & Medtech' },
    short: { en: 'Digital health', de: 'Digitale Gesundheit' },
    useCase: { en: 'A digital health or medtech offering', de: 'Ein Digital-Health- oder Medtech-Angebot' },
    intro: {
      en: 'Digital health is a market with strong regional boundaries: insurers, practices, hospitals and app frameworks differ by country. The names in this group are therefore deliberately localised — German (.de, .com with the German term), Swiss (.ch), British (.uk) and European (.eu) — with the health-assistant pair covering Germany and Europe for the same product name.',
      de: 'Digitale Gesundheit ist ein Markt mit starken regionalen Grenzen: Versicherer, Praxen, Kliniken und App-Rahmenwerke unterscheiden sich je Land. Die Namen dieser Gruppe sind deshalb bewusst lokalisiert — deutsch (.de, .com mit deutschem Begriff), schweizerisch (.ch), britisch (.uk) und europäisch (.eu) — mit dem health-assistant-Paar für Deutschland und Europa unter demselben Produktnamen.',
    },
  },
  {
    slug: 'business-ai',
    name: { en: 'Business, Industry & Commerce', de: 'Wirtschaft, Industrie & Handel' },
    short: { en: 'B2B, retail, media', de: 'B2B, Handel, Medien' },
    useCase: { en: 'A B2B platform, store, marketplace or media brand', de: 'Eine B2B-Plattform, ein Store, Marktplatz oder eine Medienmarke' },
    intro: {
      en: 'AI applied to companies, factories, shops and publishing. This group holds the AI-factory family, office and marketing terms, the AI-store family (.app, .world, .news, .international) and marketplace names for Europe. The names describe an application area rather than a technology — useful for companies that want customers to recognise the use case at first sight.',
      de: 'KI angewandt auf Unternehmen, Fabriken, Shops und Publishing. Diese Gruppe enthält die AI-Factory-Familie, Office- und Marketing-Begriffe, die AI-Store-Familie (.app, .world, .news, .international) und Marktplatznamen für Europa. Die Namen beschreiben ein Anwendungsfeld statt einer Technologie — nützlich für Unternehmen, deren Kunden den Anwendungsfall auf den ersten Blick erkennen sollen.',
    },
  },
  {
    slug: 'education-ai',
    name: { en: 'Education & Training', de: 'Bildung & Training' },
    short: { en: 'Courses, academies, universities', de: 'Kurse, Akademien, Hochschulen' },
    useCase: { en: 'A course platform, academy or university programme', de: 'Eine Kursplattform, Akademie oder ein Hochschulprogramm' },
    intro: {
      en: 'Learning about AI and learning with AI: coaching academies, vocational training in German, online universities and the "AI uni" family in four Bavarian spellings plus global variants. Several names in this group are spelling pairs (ai-uni / aiuni, ki-uni / kiuni) that are best held together so that typed variants reach the same programme.',
      de: 'Lernen über KI und Lernen mit KI: Coaching-Akademien, berufliche KI-Ausbildung auf Deutsch, Online-Universitäten und die „AI uni“-Familie in vier bayerischen Schreibweisen plus globale Varianten. Mehrere Namen dieser Gruppe sind Schreibweisen-Paare (ai-uni / aiuni, ki-uni / kiuni), die am besten zusammen gehalten werden, damit getippte Varianten dasselbe Programm erreichen.',
    },
  },
];

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
