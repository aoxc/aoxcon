import { Toaster } from 'sonner';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import ErrorBoundary from '@/components/ErrorBoundary';
import { DemoProvider } from '@/components/DemoContext';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <ErrorBoundary>
      <DemoProvider>
        <NextIntlClientProvider messages={messages}>
          <main className="min-h-[100dvh]">{children}</main>
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
              },
              className: 'aox-toast',
            }}
          />
        </NextIntlClientProvider>
      </DemoProvider>
    </ErrorBoundary>
  );
}
