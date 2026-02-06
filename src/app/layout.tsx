import type { Metadata } from 'next';
import './globals.css';
import { ClientShell } from '@/components/ClientShell';

export const metadata: Metadata = {
  title: 'Zaawiya — Jahan baat hoti hai dil ki',
  description: 'Write what you can\'t say. No name, no face. Just the story.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
