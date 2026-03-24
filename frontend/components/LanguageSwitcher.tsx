'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('language_switcher');
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;

    // Replace the locale prefix in the current path
    // pathname is like /en/about → /pt/about
    const segments = pathname.split('/');
    segments[1] = newLocale; // replace locale segment
    const newPath = segments.join('/') || '/';

    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 0,
        border: '2px solid var(--color-dark)',
        opacity: isPending ? 0.6 : 1,
        transition: 'opacity 200ms',
      }}
      role="group"
      aria-label="Language switcher"
    >
      {(['en', 'pt'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => switchLocale(lang)}
          aria-pressed={locale === lang}
          aria-label={lang === 'en' ? t('switch_en') : t('switch_pt')}
          style={{
            padding: '4px 12px',
            border: 'none',
            borderRight: lang === 'en' ? '2px solid var(--color-dark)' : 'none',
            background: locale === lang ? 'var(--color-dark)' : 'transparent',
            color: locale === lang ? '#fff' : 'var(--color-dark)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
