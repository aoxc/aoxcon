import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
 
// Can be imported from a shared config
const locales = ['en', 'tr', 'es', 'fr', 'de', 'zh', 'ja'];
 
export default getRequestConfig(async ({locale}) => {
  const l = locale || 'en';
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(l as any)) notFound();
 
  return {
    locale: l,
    messages: (await import(`../messages/${l}.json`)).default
  };
});
