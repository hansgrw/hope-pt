'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Category } from '@/lib/api';

interface Props {
  category: Category;
  resourceCount?: number;
}

export default function CategoryCard({ category, resourceCount }: Props) {
  const locale = useLocale();
  const t = useTranslations('category_card');
  const tStatic = useTranslations('static_categories');

  const countLabel =
    resourceCount === undefined
      ? null
      : resourceCount === 1
        ? t('resource_count_one')
        : t('resource_count_other', { count: resourceCount });

  return (
    <Link
      href={`/${locale}/categories/${category.slug}`}
      className="category-card animate-fade-in-up"
      style={{ '--cat-color': category.color } as React.CSSProperties}
      aria-label={`${category.name} – ${countLabel ?? ''}`}
    >
      <div
        className="cat-icon-wrap"
        style={{ '--cat-color': category.color } as React.CSSProperties}
        aria-hidden="true"
      >
        {category.icon}
      </div>
      <h3>{tStatic(category.slug)}</h3>
      <p>{tStatic(category.slug + '-desc')}</p>
      <div className="cat-footer">
        {countLabel && (
          <span className="resource-count">{countLabel}</span>
        )}
        <span className="cat-arrow">→</span>
      </div>
    </Link>
  );
}
