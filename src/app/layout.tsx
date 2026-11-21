import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arabic Research Intelligence | جامعة الشارقة',
  description: 'AI Research Copilot for Arabic & English Academic Research',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
