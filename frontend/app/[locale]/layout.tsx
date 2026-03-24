import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getMessages } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

// Tell Next.js which locale segments to pre-render
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: 'HOPE – Immigrant Resource Hub Portugal',
    template: '%s | HOPE',
  },
  description:
    'Free, comprehensive information and resources for immigrants in Portugal. Find help with food, housing, health, employment, documentation, and more.',
  keywords: ['immigrants', 'Portugal', 'resources', 'help', 'support', 'integration'],
  openGraph: {
    siteName: 'HOPE – Immigrant Resource Hub',
    type: 'website',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Load messages for the current locale
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
