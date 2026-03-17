import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AOXCON Sovereign Intelligence',
  description: 'Multichain Intelligence Orchestration Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-aox-dark text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
