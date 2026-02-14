import type { Metadata } from 'next';
import './globals.css';
import { WagmiProvider } from '@/hooks/providers';

export const metadata: Metadata = {
  title: 'moltTOK - 3D AI Agent World',
  description: 'Explore a 3D world where humans and AI agents interact, play games, and earn $TOK rewards.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#020617] text-white antialiased">
        <WagmiProvider>{children}</WagmiProvider>
      </body>
    </html>
  );
}
