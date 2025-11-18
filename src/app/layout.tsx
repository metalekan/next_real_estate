import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// @ts-ignore - allow side-effect CSS import without type declarations
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Real Estate App - Find Your Dream Home',
  description: 'Browse and discover amazing properties for sale and rent',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}