import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Go Around: WebGIS Tempat Nongkrong & Nugas Ramah Mahasiswa Kota Bogor',
  description:
    'Temukan coffee shop, warkop modern, dan working space terbaik di Kota Bogor dengan informasi lengkap Wi-Fi, colokan listrik, tingkat kebisingan, operasional 24 jam, dan harga terjangkau.',
  keywords: [
    'WebGIS Bogor',
    'Tempat Nugas Bogor',
    'Coffee Shop Mahasiswa Bogor',
    'Coworking Space Bogor',
    'Warkop 24 Jam Bogor',
    'Nugas Ramah Kantong',
  ],
  authors: [{ name: 'Go Around Team' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/favicon.svg' }],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`dark ${syne.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-black text-zinc-100 min-h-screen antialiased selection:bg-emerald-500 selection:text-black font-sans">
        {children}
      </body>
    </html>
  );
}
