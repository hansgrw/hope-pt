'use client';

import { useState, useEffect, useTransition, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, Resource, Category } from '@/lib/api';
import ResourceCard from '@/components/ResourceCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialQ = searchParams.get('q') || '';
  const initialCat = searchParams.get('category') || '';
  const initialUrgent = searchParams.get('urgent') || '';

  const [query, setQuery] = useState(initialQ);
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [urgentOnly, setUrgentOnly] = useState(initialUrgent === 'true');
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Load categories once
  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => { });
  }, []);

  // Fetch resources on filter change
  useEffect(() => {
    setLoading(true);
    api
      .getResources({
        search: query || undefined,
        category: selectedCat || undefined,
        urgent: urgentOnly ? 'true' : undefined,
      })
      .then((data) => {
        setResources(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query, selectedCat, urgentOnly]);

  // Keep URL in sync
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedCat) params.set('category', selectedCat);
    if (urgentOnly) params.set('urgent', 'true');
    startTransition(() => {
      router.replace(`/search${params.toString() ? `?${params}` : ''}`, { scroll: false });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedCat, urgentOnly]);

  return (
    <>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <span>Search Resources</span>
          </nav>
          <h1>Find Resources</h1>
          <p style={{ marginTop: 'var(--space-sm)' }}>
            Search across all categories to find the help you need.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 'var(--space-3xl)' }}>
        {/* Search Input */}
        <div className="search-bar" style={{ maxWidth: '100%', marginBottom: 'var(--space-lg)' }}>
          <div className="search-input-wrap" style={{ flex: 1 }}>
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              id="search-main-input"
              type="search"
              placeholder="Search by name, organization, or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search resources"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="filter-bar" style={{ justifyContent: 'flex-start' }}>
          <button
            id="filter-all"
            className={`filter-chip ${!selectedCat && !urgentOnly ? 'active' : ''}`}
            onClick={() => { setSelectedCat(''); setUrgentOnly(false); }}
          >
            All
          </button>
          <button
            id="filter-urgent"
            className={`filter-chip ${urgentOnly ? 'active' : ''}`}
            onClick={() => { setUrgentOnly(!urgentOnly); setSelectedCat(''); }}
            style={{ borderColor: urgentOnly ? '#ef4444' : undefined, background: urgentOnly ? '#ef4444' : undefined }}
          >
            🚨 Urgent Only
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              id={`filter-${cat.slug}`}
              className={`filter-chip ${selectedCat === String(cat.id) ? 'active' : ''}`}
              onClick={() => setSelectedCat(selectedCat === String(cat.id) ? '' : String(cat.id))}
            >
              {cat.icon} {cat.slug} testestestestestes
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="resources-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 180, borderRadius: 'var(--radius-md)' }} className="skeleton" />
            ))}
          </div>
        ) : resources.length > 0 ? (
          <>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-lg)' }}>
              {resources.length} result{resources.length !== 1 ? 's' : ''} found
              {query && <> for &ldquo;<strong style={{ color: 'var(--color-text-primary)' }}>{query}</strong>&rdquo;</>}
            </p>
            <div className="resources-grid stagger-children">
              {resources.map((res) => (
                <ResourceCard key={res.id} resource={res} showCategory />
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>No resources found</h3>
            <p>Try a different search term or remove some filters.</p>
            <button
              className="btn btn-ghost mt-md"
              onClick={() => { setQuery(''); setSelectedCat(''); setUrgentOnly(false); }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading…</div>}>
      <SearchContent />
    </Suspense>
  );
}
