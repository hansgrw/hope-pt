import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { api } from '@/lib/api';
import ResourceCard from '@/components/ResourceCard';

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const cat = await api.getCategory(slug);
    return { title: cat.name, description: cat.description };
  } catch {
    return { title: 'Category Not Found' };
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations('category_page');

  let category;
  try {
    category = await api.getCategory(slug);
  } catch {
    notFound();
  }

  const urgentResources = category.resources?.filter((r) => r.isUrgent) ?? [];
  const regularResources = category.resources?.filter((r) => !r.isUrgent) ?? [];

  return (
    <>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href={`/${locale}`}>{t('breadcrumb_home')}</Link>
            <span aria-hidden="true">›</span>
            <span>{category.name}</span>
          </nav>
          <div
            className="category-icon-large"
            style={{ background: `color-mix(in srgb, ${category.color} 15%, transparent)` }}
            aria-hidden="true"
          >
            {category.icon}
          </div>
          <h1>{category.name}</h1>
          <p style={{ marginTop: 'var(--space-sm)', maxWidth: 560 }}>{category.description}</p>
          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>
              {t('resources_available', { count: category.resources?.length ?? 0 })}
            </span>
            {urgentResources.length > 0 && (
              <span style={{ color: '#FFD93D', fontSize: '0.875rem', fontWeight: 600 }}>
                {t('urgent_count', { count: urgentResources.length })}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 'var(--space-3xl)' }}>
        {/* Urgent Resources */}
        {urgentResources.length > 0 && (
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <h2 style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              {t('urgent_section')}
            </h2>
            <div className="resources-grid stagger-children">
              {urgentResources.map((res) => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          </section>
        )}

        {/* Regular Resources */}
        {regularResources.length > 0 && (
          <section>
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>{t('all_resources')}</h2>
            <div className="resources-grid stagger-children">
              {regularResources.map((res) => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          </section>
        )}

        {(category.resources?.length ?? 0) === 0 && (
          <div className="empty-state">
            <div className="icon">📭</div>
            <h3>{t('no_resources_title')}</h3>
            <p>{t('no_resources_body')}</p>
          </div>
        )}

        {/* Back */}
        <div style={{ marginTop: 'var(--space-2xl)', textAlign: 'center' }}>
          <Link href={`/${locale}`} className="btn btn-ghost">{t('back')}</Link>
        </div>
      </div>
    </>
  );
}
