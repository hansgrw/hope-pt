import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await api.getResource(parseInt(id));
    return { title: res.title, description: res.description };
  } catch {
    return { title: 'Resource Not Found' };
  }
}

export default async function ResourceDetailPage({ params }: Props) {
  const { id } = await params;

  let resource;
  try {
    resource = await api.getResource(parseInt(id));
  } catch {
    notFound();
  }

  const cat = resource.category;

  return (
    <>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            {cat && <Link href={`/categories/${cat.slug}`}>{cat.name}</Link>}
            <span>›</span>
            <span>{resource.title}</span>
          </nav>
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginTop: 'var(--space-sm)' }}>
            {resource.isUrgent && (
              <span className="resource-tag badge-urgent">🚨 Urgent Resource</span>
            )}
            {cat && (
              <span
                className="resource-tag badge-category"
                style={{ '--cat-color': cat.color } as React.CSSProperties}
              >
                {cat.icon} {cat.name}
              </span>
            )}
          </div>
          <h1 style={{ marginTop: 'var(--space-md)' }}>{resource.title}</h1>
          {resource.organization && (
            <p style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: '1rem', marginTop: 'var(--space-sm)' }}>
              {resource.organization}
            </p>
          )}
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 'var(--space-3xl)' }}>
        <div className="detail-layout">
          {/* ── Main Content ── */}
          <div>
            <div className="detail-card" style={{ marginBottom: 'var(--space-lg)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
                About This Resource
              </h2>
              <p style={{ lineHeight: 1.85 }}>{resource.description}</p>
            </div>

            {resource.eligibility && (
              <div className="detail-card" style={{ marginBottom: 'var(--space-lg)' }}>
                <p className="detail-section-title">Who Can Access This</p>
                <p>{resource.eligibility}</p>
              </div>
            )}

            {resource.languages && (
              <div className="detail-card" style={{ marginBottom: 'var(--space-lg)' }}>
                <p className="detail-section-title">Languages Available</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                  {resource.languages.split(',').map((lang) => (
                    <span key={lang} className="resource-tag">🌐 {lang.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {cat && (
              <div style={{ marginTop: 'var(--space-lg)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>
                  More resources in this category:
                </p>
                <Link
                  href={`/categories/${cat.slug}`}
                  className="btn btn-primary"
                  style={{ '--cat-color': cat.color } as React.CSSProperties}
                >
                  {cat.icon} View All {cat.name} Resources
                </Link>
              </div>
            )}
          </div>

          {/* ── Sidebar: Contact Info ── */}
          <div>
            <div className="detail-card">
              <p className="detail-section-title">Contact & Access</p>

              {resource.phone && (
                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div className="contact-info">
                    <label>Phone</label>
                    <a href={`tel:${resource.phone.replace(/\s/g, '')}`}>
                      {resource.phone}
                    </a>
                  </div>
                </div>
              )}

              {resource.email && (
                <div className="contact-item">
                  <div className="contact-icon">✉️</div>
                  <div className="contact-info">
                    <label>Email</label>
                    <a href={`mailto:${resource.email}`}>{resource.email}</a>
                  </div>
                </div>
              )}

              {resource.url && (
                <div className="contact-item">
                  <div className="contact-icon">🌐</div>
                  <div className="contact-info">
                    <label>Website</label>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      {resource.url.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}

              {resource.address && (
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div className="contact-info">
                    <label>Address</label>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(resource.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resource.address}
                    </a>
                  </div>
                </div>
              )}

              {resource.schedule && (
                <div className="contact-item">
                  <div className="contact-icon">🕐</div>
                  <div className="contact-info">
                    <label>Hours</label>
                    <span>{resource.schedule}</span>
                  </div>
                </div>
              )}

              {!resource.phone && !resource.email && !resource.url && !resource.address && (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  Contact information not available. Search online for the latest details.
                </p>
              )}
            </div>

            {/* Quick actions */}
            <div className="detail-card" style={{ marginTop: 'var(--space-md)' }}>
              <p className="detail-section-title">Quick Actions</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full"
                    id={`visit-website-${resource.id}`}
                  >
                    Visit Website ↗
                  </a>
                )}
                {resource.phone && (
                  <a
                    href={`tel:${resource.phone.replace(/\s/g, '')}`}
                    className="btn btn-accent w-full"
                    id={`call-phone-${resource.id}`}
                  >
                    📞 Call Now
                  </a>
                )}
                <Link href="/search" className="btn btn-ghost w-full">
                  ← Find More Resources
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
