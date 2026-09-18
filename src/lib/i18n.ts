// Locale helpers. EN lives at "/", DE at "/de/". No JS language replacement, no geo redirect.
export type Lang = 'en' | 'de';
export const LANGS: Lang[] = ['en', 'de'];

/** Build a localized path. Every path is canonical with a trailing slash. */
export function localePath(lang: Lang, path = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  const withSlash = p.endsWith('/') ? p : `${p}/`;
  return lang === 'de' ? (withSlash === '/' ? '/de/' : `/de${withSlash}`) : withSlash;
}

/** Path of the same page in the other language (route model is symmetric). */
export function alternatePath(lang: Lang, currentPath: string): string {
  const stripped = currentPath.replace(/^\/de(?=\/|$)/, '') || '/';
  return localePath(lang === 'en' ? 'de' : 'en', stripped);
}

export function langFromPath(path: string): Lang {
  return /^\/de(\/|$)/.test(path) ? 'de' : 'en';
}

export function t<T>(lang: Lang, obj: { en: T; de: T }): T {
  return obj[lang];
}

export const LOCALE_TAG: Record<Lang, string> = { en: 'en', de: 'de' };
export const OG_LOCALE: Record<Lang, string> = { en: 'en_US', de: 'de_DE' };
