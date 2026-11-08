import type { Metadata } from 'next';
import { Suspense } from 'react';
import { NavigationFeedback } from '@/components/loading/NavigationFeedback';
import { QueryProvider } from '@/providers/QueryProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Go Around — WebGIS Tempat Nugas & Kafe Ramah Mahasiswa Kota Bogor',
  description:
    'Eksplorasi direktori spasial dan rekomendasi kafe nugas terbaik di Kota Bogor berdasarkan kecepatan WiFi, ketersediaan colokan, akustik, dan budget mahasiswa.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased bg-surface-white text-text-900">
        <QueryProvider>
          {children}
          <Suspense fallback={null}>
            <NavigationFeedback />
          </Suspense>
        </QueryProvider>
      </body>
    </html>
  );
}
