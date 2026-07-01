import es from './es.json';
import en from './en.json';

const translations = { es, en } as const;

export type Locale = keyof typeof translations;

export function t(locale: Locale) {
  return translations[locale];
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return 'es';
}

export function getAlternateUrl(locale: Locale, base: string): string {
  if (locale === 'es') return base;
  return `${base}en/`;
}
