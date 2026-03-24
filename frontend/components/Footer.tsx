'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

const CATEGORY_SLUGS = [
  { slug: 'food', nameKey: 'food' },
  { slug: 'health', nameKey: 'health' },
  { slug: 'housing', nameKey: 'housing' },
  { slug: 'employment', nameKey: 'employment' },
  { slug: 'documentation', nameKey: 'documentation' },
  { slug: 'financial-support', nameKey: 'financial-support' },
  { slug: 'domestic-violence', nameKey: 'domestic-violence' },
  { slug: 'education', nameKey: 'education' },
  { slug: 'discrimination', nameKey: 'discrimination' },
  { slug: 'general-services', nameKey: 'general-services' },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();
  const t = useTranslations('footer');
  const tCat = useTranslations('static_categories');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href={`/${locale}`} className="logo" style={{ display: 'inline-flex' }} aria-label="HOPE Home">
              <div className="footer-logo-box">
                <span className="logo-box-word">HO</span>
                <span className="logo-box-word">PE</span>
              </div>
              <div className="logo-text" style={{ marginLeft: '10px' }}>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '1.3rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: '#fff',
                  display: 'block',
                  lineHeight: 1,
                }}>Hope</span>
                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.45)',
                  display: 'block',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)',
                  marginTop: '2px',
                }}>{t('logo_tagline')}</span>
              </div>
            </Link>
            <p>{t('tagline')}</p>
          </div>

          <div className="footer-col">
            <h4>{t('categories')}</h4>
            <ul className="footer-links">
              {CATEGORY_SLUGS.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${locale}/categories/${cat.slug}`}>{tCat(cat.nameKey)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>&nbsp;</h4>
            <ul className="footer-links" style={{ marginTop: '1.7rem' }}>
              {CATEGORY_SLUGS.slice(5).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${locale}/categories/${cat.slug}`}>{tCat(cat.nameKey)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t('platform')}</h4>
            <ul className="footer-links">
              <li><Link href={`/${locale}`}>{t('nav_home')}</Link></li>
              <li><Link href={`/${locale}/search`}>{t('nav_resources')}</Link></li>
              <li><Link href={`/${locale}/about`}>{tNav('about')}</Link></li>
              <li><Link href={`/${locale}/search?urgent=true`}>{t('nav_urgent')}</Link></li>
            </ul>
            <h4 style={{ marginTop: 'var(--space-lg)' }}>{t('emergency')}</h4>
            <ul className="footer-links">
              <li><a href="tel:112">{t('emergency_112')}</a></li>
              <li><a href="tel:116006">{t('emergency_apav')}</a></li>
              <li><a href="tel:800202148">{t('emergency_dv')}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{t('copyright', { year })}</span>
          <span>{t('built_with')}</span>
        </div>
      </div>
    </footer>
  );
}
