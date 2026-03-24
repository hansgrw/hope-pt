'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Resource } from '@/lib/api';

interface Props {
  resource: Resource;
  showCategory?: boolean;
}

export default function ResourceCard({ resource, showCategory = false }: Props) {
  const locale = useLocale();
  const t = useTranslations('resource_card');
  const tStatic = useTranslations('static_categories');
  const tAbout = useTranslations('about');
  const catColor = resource.category?.color;

  // Suppress unused variable warning – locale available for future detail page
  void locale;

  return (
    <div className="resource-card animate-fade-in-up">
      <div className="resource-card-header">
        <div>
          {resource.isUrgent && (
            <span className="resource-tag badge-urgent" style={{ marginBottom: 6, display: 'inline-flex' }}>
              {t('urgent')}
            </span>
          )}
          <h3>{resource.title}</h3>
        </div>
      </div>

      {resource.organization && (
        <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)', marginTop: 2, marginBottom: 4 }}>
          {resource.organization}
        </p>
      )}

      <p>{resource.description}</p>

      <div className="resource-meta">
        {showCategory && resource.category && (
          <span
            className="resource-tag badge-category"
            style={{ '--cat-color': catColor } as React.CSSProperties}
          >
            {resource.category.icon} {tStatic(resource.category.slug)}
          </span>
        )}
        {resource.phone && (
          <a href={`tel:${resource.phone.replace(/\s/g, '')}`} className="resource-tag">
            📞 {resource.phone}
          </a>
        )}
        {resource.languages && (
          <span className="resource-tag">
            🌐 {resource.languages.includes(',') ? tAbout('feature_multilang_title') : resource.languages.split(',')[0].trim()}
          </span>
        )}
      </div>

      <div className="resource-actions" style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          >
            {t('visit')}
          </a>
        )}
        {resource.email && (
          <a
            href={`mailto:${resource.email}`}
            className="btn btn-ghost"
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          >
            {t('email')}
          </a>
        )}
      </div>
    </div>
  );
}
