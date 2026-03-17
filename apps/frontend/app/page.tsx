'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const supported = ['en', 'tr', 'es', 'fr', 'de', 'zh', 'ja'];

function detectLocale(): string {
  if (typeof navigator === 'undefined') return 'en';
  const candidate = navigator.language?.toLowerCase()?.split('-')[0] || 'en';
  return supported.includes(candidate) ? candidate : 'en';
}

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const locale = detectLocale();
    router.replace(`/${locale}`);
  }, [router]);

  return null;
}
