import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Onest, JetBrains_Mono } from 'next/font/google';
import { QueryProvider } from '@/providers/QueryProvider';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const onest = Onest({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-onest',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

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
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${onest.variable} ${mono.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased bg-surface-white text-text-900">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
