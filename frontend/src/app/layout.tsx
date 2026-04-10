import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aegis Protocol | Antigravity Trust Platform',
  description: 'The institutional truth layer for modern hiring. Verify credentials, assess talent, and trust every hire with cryptographic certainty.',
  keywords: ['trust platform', 'blockchain hiring', 'soulbound tokens', 'AI proctoring', 'verified credentials'],
  openGraph: {
    title: 'Aegis Protocol — Institutional Trust for Hiring',
    description: 'Blockchain-verified credentials, AI proctoring, GitHub activity tracking. Hire with certainty.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
