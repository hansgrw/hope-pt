import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import ResourceCard from '@/components/ResourceCard';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const cat = await api.getCategory(slug);
    return {
      title: cat.name,
      description: cat.description,
    };
  } catch {
    return { title: 'Category Not Found' };
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

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
            <Link href="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span>{category.name}</span>
          </nav>
          <div
            className="category-icon-large"
            style={{
              background: `color-mix(in srgb, ${category.color} 15%, transparent)`,
            }}
            aria-hidden="true"
          >
            {category.icon}
          </div>
          <h1>{category.name}</h1>
          <p style={{ marginTop: 'var(--space-sm)', maxWidth: 560 }}>
            {category.description}
          </p>
          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>
              {category.resources?.length ?? 0} resources available
            </span>
            {urgentResources.length > 0 && (
              <span style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 600 }}>
                🚨 {urgentResources.length} urgent
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
              <span>🚨</span> Urgent Resources
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
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>All Resources</h2>
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
            <h3>No resources yet</h3>
            <p>Resources for this category will be added soon.</p>
          </div>
        )}

        {/* Back */}
        <div style={{ marginTop: 'var(--space-2xl)', textAlign: 'center' }}>
          <Link href="/" className="btn btn-ghost">
            ← Back to All Categories
          </Link>
        </div>
      </div>
    </>
  );
}
