import { es } from './es';

type Locale = 'es';

const dictionaries: Record<Locale, Record<string, string>> = {
  es,
};

let currentLocale: Locale = 'es';

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function t(key: keyof typeof es): string {
  const dict = dictionaries[currentLocale];
  return dict[key] ?? key;
}


