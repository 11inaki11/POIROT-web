import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'POIROT Protocol Demo',
  description: 'Visualizing Consensus-Based Error Correction in Multi-Agent Systems',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'POIROT Protocol Demo',
    description: 'Visualizing Consensus-Based Error Correction in Multi-Agent Systems',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'POIROT' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <Link href="/" className="navbar-brand">
            <img src="/logo.png" alt="POIROT" />
            <span className="gradient-text">POIROT</span>
          </Link>
          <div className="navbar-links">
            <Link href="/">Home</Link>
            <Link href="/demo/cortex">CORTEX</Link>
            <Link href="/demo/trading">TradingAgents</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
