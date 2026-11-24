import type { Metadata } from 'next';
import { I18nProvider } from '@/lib/i18n/context';
import { AuthProvider } from '@/lib/auth/context';
import { ThemeProvider } from '@/lib/theme/context';
import { AppShell } from '@/components/layout/AppShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Al-Waha University | Agentic AI Platform - جامعة الواحة',
  description: 'AI Platform for Al-Waha University Graduate Students & Researchers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 antialiased font-sans">
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <AppShell>{children}</AppShell>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
