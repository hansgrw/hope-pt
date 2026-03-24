import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { api } from '@/lib/api';
import CategoryCard from '@/components/CategoryCard';
import { useTranslations } from 'next-intl';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('hero');
  return {
    title: 'HOPE – Immigrant Resource Hub Portugal',
    description: t('subtitle'),
  };
}

export default async function HomePage() {
  let categories: Awaited<ReturnType<typeof api.getCategories>> = [];
  try {
    categories = await api.getCategories();
  } catch {
    // API not yet available – show static fallback
  }

  const tHero = await getTranslations('hero');
  const tUrgent = await getTranslations('urgent_banner');
  const tCat = await getTranslations('categories_section');
  const tAbout = await getTranslations('about_strip');
  const tStatic = await getTranslations('static_categories');

  // Static fallback categories — names and descriptions from translations
  const STATIC_CATEGORIES = [
    { slug: 'food', nameKey: 'food', descKey: 'food_desc', icon: '🍎', color: '#22C55E' },
    { slug: 'health', nameKey: 'health', descKey: 'health_desc', icon: '🏥', color: '#3B82F6' },
    { slug: 'housing', nameKey: 'housing', descKey: 'housing_desc', icon: '🏠', color: '#F59E0B' },
    { slug: 'employment', nameKey: 'employment', descKey: 'employment_desc', icon: '💼', color: '#8B5CF6' },
    { slug: 'documentation', nameKey: 'documentation', descKey: 'documentation_desc', icon: '📋', color: '#6366F1' },
    { slug: 'financial-support', nameKey: 'financial-support', descKey: 'financial_desc', icon: '💰', color: '#10B981' },
    { slug: 'domestic-violence', nameKey: 'domestic-violence', descKey: 'domestic_desc', icon: '🛡️', color: '#EF4444' },
    { slug: 'education', nameKey: 'education', descKey: 'education_desc', icon: '🎓', color: '#0EA5E9' },
    { slug: 'discrimination', nameKey: 'discrimination', descKey: 'discrimination_desc', icon: '🤝', color: '#EC4899' },
    { slug: 'general-services', nameKey: 'general-services', descKey: 'general_desc', icon: 'ℹ️', color: '#6B7280' },
  ] as const;

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero" aria-label="Introduction">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">{tHero('badge')}</div>
            <h1>
              {tHero.rich('heading', {
                highlight: (chunks) => <span>{chunks}</span>,
              })}
            </h1>
            <p>{tHero('subtitle')}</p>
            <div className="hero-actions">
              <Link href="/search" className="btn btn-accent btn-lg">
                {tHero('cta_browse')}
              </Link>
              <Link href="/search?urgent=true" className="btn btn-outline btn-lg">
                {tHero('cta_urgent')}
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">10</div>
                <div className="hero-stat-label">{tHero('stat_categories')}</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">27+</div>
                <div className="hero-stat-label">{tHero('stat_resources')}</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">{tHero('stat_free_value')}</div>
                <div className="hero-stat-label">{tHero('stat_free')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Urgent Alert ── */}
      <div className="container" style={{ marginTop: 'var(--space-xl)' }}>
        <div className="urgent-banner" role="alert">
          <span className="icon">🚨</span>
          <div>
            <strong>{tUrgent('title')}</strong>
            <p>
              {tUrgent('emergency')}: <a href="tel:112"><strong>112</strong></a> &nbsp;|&nbsp;
              {tUrgent('victim')}: <a href="tel:116006"><strong>116 006</strong></a> &nbsp;|&nbsp;
              {tUrgent('domestic')}: <a href="tel:800202148"><strong>800 202 148</strong></a>
            </p>
          </div>
        </div>
      </div>

      {/* ── Categories Grid ── */}
      <section className="section categories-section">
        <div className="container">
          <h2>{tCat('heading')}</h2>
          <p className="section-subtitle">{tCat('subtitle')}</p>

          {categories.length > 0 ? (
            <div className="categories-grid stagger-children">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} resourceCount={cat.resources?.length} />
              ))}
            </div>
          ) : (
            <div className="categories-grid stagger-children">
              {STATIC_CATEGORIES.map((cat) => (
                <div>
                  <p>{cat.slug}</p>
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="category-card animate-fade-in-up"
                    style={{ '--cat-color': cat.color } as React.CSSProperties}
                  >
                    <div className="cat-icon-wrap">{cat.icon}</div>
                    <h3>{tStatic(cat.nameKey)}</h3>
                    <p>{tStatic(cat.descKey)}</p>
                    <div className="cat-footer">
                      <span className="cat-arrow">→</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── About Strip ── */}
      <section style={{ background: 'var(--color-dark)', padding: 'var(--space-3xl) 0', borderTop: '4px solid var(--color-accent)' }}>
        <div className="container">
          <div style={{ display: 'grid', gap: 'var(--space-2xl)', alignItems: 'center' }}>
            <div>
              <h2 style={{ color: '#fff', marginBottom: 'var(--space-md)' }}>
                {tAbout.rich('heading', {
                  highlight: (chunks) => (
                    <span style={{ background: 'var(--color-accent)', color: '#000', padding: '0 8px' }}>
                      {chunks}
                    </span>
                  ),
                })}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 'var(--space-lg)', fontSize: '1.05rem', textTransform: 'none', fontFamily: 'var(--font-body)', fontWeight: 400 }}>
                {tAbout('body')}
              </p>
              <Link href="/about" className="btn btn-accent">
                {tAbout('cta')}
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              {(
                [
                  { icon: '🆓', titleKey: 'feature_free_title', textKey: 'feature_free_text' },
                  { icon: '✅', titleKey: 'feature_verified_title', textKey: 'feature_verified_text' },
                  { icon: '🌐', titleKey: 'feature_multilang_title', textKey: 'feature_multilang_text' },
                  { icon: '🔄', titleKey: 'feature_updated_title', textKey: 'feature_updated_text' },
                ] as const
              ).map((f) => (
                <div
                  key={f.titleKey}
                  className="feature-card"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.15)' }}
                >
                  <span className="feature-icon">{f.icon}</span>
                  <h3 style={{ color: '#fff', fontSize: '0.82rem' }}>{tAbout(f.titleKey)}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem' }}>{tAbout(f.textKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
