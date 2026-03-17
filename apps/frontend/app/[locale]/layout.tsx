import type {Metadata} from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import '../globals.css';
import ErrorBoundary from '@/components/ErrorBoundary';
import { DemoProvider } from '@/components/DemoContext';

// ...
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'AOXCON Sovereign Intelligence',
  description: 'Multichain Intelligence Orchestration Platform',
};

// ... (rest of imports)

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
 
  return (
    <html lang={locale} className={`${outfit.variable} ${jetbrainsMono.variable} dark`}>
      <body className="antialiased bg-aox-dark text-white" suppressHydrationWarning>
        <ErrorBoundary>
          <DemoProvider>
            <NextIntlClientProvider messages={messages}>
              <main className="min-h-[100dvh]">
                {children}
              </main>
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
                  className: 'aox-toast'
                }}
              />
            </NextIntlClientProvider>
          </DemoProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
