// JSON-LD builders. Only schema types justified by the verified project work: WebSite, Organization, BreadcrumbList,
// CollectionPage, FAQPage, Product/Offer (EUR only, truthful availability). No ratings, no reviews.
import { SITE } from '../config/site';
import { LEGAL } from '../config/legal';
import { CONTACT } from '../config/contact';
import type { DomainRecord } from './domains';
import type { Lang } from './i18n';
import { localePath } from './i18n';

export const organization = () => ({
  '@type': 'Organization',
  '@id': `${SITE.url}/#org`,
  name: SITE.brand,
  url: `${SITE.url}/`,
  email: CONTACT.email,
  founder: { '@type': 'Person', name: LEGAL.operator.name },
  address: {
    '@type': 'PostalAddress',
    streetAddress: LEGAL.operator.street,
    postalCode: LEGAL.operator.postalCode,
    addressLocality: LEGAL.operator.city,
    addressCountry: LEGAL.operator.countryCode,
  },
});

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE.url}${it.path}` })),
});

export const collectionPage = (lang: Lang, name: string, path: string, description: string) => ({
  '@type': 'CollectionPage',
  '@id': `${SITE.url}${path}#page`,
  url: `${SITE.url}${path}`,
  name,
  description,
  inLanguage: lang,
  isPartOf: { '@id': `${SITE.url}/#website` },
});

export const faqPage = (items: { q: string; a: string }[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
});

/** Product for a domain detail page. An Offer (EUR only) is emitted ONLY for verified Sedo Buy Now domains;
 * enquiry-only and sold domains carry no Offer so structured data never states a price that is not a live listing. */
export const domainProduct = (d: DomainRecord, lang: Lang) => {
  const path = localePath(lang, `/domains/${d.slug}/`);
  const product: Record<string, unknown> = {
    '@type': 'Product',
    '@id': `${SITE.url}${path}#product`,
    name: d.domain,
    description: d.pitch[lang],
    category: d.category,
    url: `${SITE.url}${path}`,
  };
  if (d.saleMode === 'buy_now') {
    product.offers = {
      '@type': 'Offer',
      url: d.sedoUrl[lang],
      priceCurrency: 'EUR',
      price: d.priceEur,
      availability: 'https://schema.org/InStock',
      seller: { '@id': `${SITE.url}/#org` },
    };
  }
  return product;
};

export const ogTitle = (s: string) => (s.length > 60 ? `${s.slice(0, 57)}…` : s);
