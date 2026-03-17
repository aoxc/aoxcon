import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'tr', 'es', 'fr', 'de', 'zh', 'ja'] as const;
const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  const incoming = locale || defaultLocale;
  const selectedLocale = locales.includes(incoming as any) ? incoming : defaultLocale;

  return {
    locale: selectedLocale,
    messages: (await import(`../messages/${selectedLocale}.json`)).default,
  };
});
