import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about');
  return {
    title: t('page_title'),
    description: t('page_subtitle'),
  };
}

const EMERGENCY = [
  { nameKey: 'emergency_services' as const, number: '112' },
  { nameKey: 'emergency_apav' as const, number: '116 006' },
  { nameKey: 'emergency_dv' as const, number: '800 202 148' },
  { nameKey: 'emergency_acm' as const, number: '808 257 257' },
  { nameKey: 'emergency_social' as const, number: '300 502 502' },
];

export default async function AboutPage() {
  const t = await getTranslations('about');
  const locale = await getLocale();

  const STATS = [
    { value: '10', label: t('stat_categories') },
    { value: '27+', label: t('stat_resources') },
    { value: '2+', label: t('stat_languages') },
    { value: '100%', label: t('stat_free') },
  ];

  const FEATURES = [
    { icon: '🆓', title: t('feature_free_title'), desc: t('feature_free_desc') },
    { icon: '✅', title: t('feature_verified_title'), desc: t('feature_verified_desc') },
    { icon: '🌍', title: t('feature_multilang_title'), desc: t('feature_multilang_desc') },
    { icon: '🔄', title: t('feature_updated_title'), desc: t('feature_updated_desc') },
    { icon: '🛡️', title: t('feature_privacy_title'), desc: t('feature_privacy_desc') },
    { icon: '📱', title: t('feature_mobile_title'), desc: t('feature_mobile_desc') },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <div className="page-header" style={{ padding: 'var(--space-3xl) 0' }}>
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href={`/${locale}`}>{t('breadcrumb')}</Link>
            <span>›</span>
            <span>{t('page_title')}</span>
          </nav>
          <h1>{t('page_title')}</h1>
          <p style={{ maxWidth: 560, marginTop: 'var(--space-sm)' }}>
            {t('page_subtitle')}
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 'var(--space-3xl)' }}>
        {/* Mission */}
        <section className="section" style={{ paddingTop: 'var(--space-2xl)' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <h2>{t('mission_title')}</h2>
            <p style={{ fontSize: '1.1rem', marginTop: 'var(--space-md)', lineHeight: 1.85 }}>
              {t('mission_body')}
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--space-lg)',
              marginTop: 'var(--space-2xl)',
            }}
          >
            {STATS.map((s) => (
              <div key={s.label} className="detail-card" style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-dark)' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="section">
          <h2 className="text-center mb-xl">{t('different_title')}</h2>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Numbers */}
        <section className="detail-card" style={{ marginTop: 0, marginBottom: 'var(--space-2xl)' }}>
          <h2 style={{ marginBottom: 'var(--space-lg)' }}>{t('emergency_title')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-md)' }}>
            {EMERGENCY.map((e) => (
              <a
                key={e.number}
                href={`tel:${e.number.replace(/\s/g, '')}`}
                style={{
                  textDecoration: 'none',
                  padding: 'var(--space-md)',
                  background: 'var(--color-bg)',
                  display: 'flex',
                  gap: 'var(--space-md)',
                  alignItems: 'center',
                  border: '2px solid var(--color-dark)',
                  transition: 'all var(--transition-base)',
                }}
              >
                <div className="contact-icon">📞</div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                    {t(e.nameKey)}
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-dark)' }}>
                    {e.number}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center', paddingTop: 'var(--space-lg)' }}>
          <h2>{t('cta_title')}</h2>
          <p style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>{t('cta_body')}</p>
          <div className="flex flex-center gap-md" style={{ flexWrap: 'wrap' }}>
            <Link href={`/${locale}`} className="btn btn-primary btn-lg">{t('cta_browse')}</Link>
            <Link href={`/${locale}/search`} className="btn btn-outline btn-lg">{t('cta_search')}</Link>
          </div>
        </div>
      </div>
    </>
  );
}
