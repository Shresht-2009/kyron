import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kyron — AI Design Studio',
  description: 'Describe your vision. Kyron designs, builds, and deploys stunning websites with 3D, motion, and kinetic typography.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
