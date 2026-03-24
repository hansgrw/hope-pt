'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('nav');
  const [query, setQuery] = useState('');
  const [, startTransition] = useTransition();

  // Strip locale from pathname for active link matching
  // e.g. /en/about → /about
  const pathWithoutLocale = pathname.replace(/^\/(en|pt)/, '') || '/';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      startTransition(() => {
        router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
      });
      setQuery('');
    }
  };

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-inner">
          {/* Square-bordered logo — Ondadura style */}
          <Link href={`/${locale}`} className="logo" aria-label={t('logo_aria')}>
            <div className="logo-box">
              <span className="logo-box-word">HO</span>
              <span className="logo-box-word">PE</span>
            </div>
            <div className="logo-text">
              <span className="logo-title">Hope</span>
              <span className="logo-tagline">{t('logo_tagline')}</span>
            </div>
          </Link>

          <nav className="header-nav" aria-label="Main navigation">
            <Link
              href={`/${locale}`}
              className={`nav-link ${pathWithoutLocale === '/' ? 'active' : ''}`}
            >
              {t('home')}
            </Link>
            <Link
              href={`/${locale}/search`}
              className={`nav-link ${pathWithoutLocale.startsWith('/search') ? 'active' : ''}`}
            >
              {t('resources')}
            </Link>
            <Link
              href={`/${locale}/about`}
              className={`nav-link ${pathWithoutLocale === '/about' ? 'active' : ''}`}
            >
              {t('about')}
            </Link>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <LanguageSwitcher />

            <form className="header-search" onSubmit={handleSearch} role="search">
              <span className="search-icon-header" aria-hidden="true">🔍</span>
              <input
                type="search"
                id="header-search-input"
                placeholder={t('search_placeholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label={t('search_aria')}
              />
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
