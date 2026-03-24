const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// ── Types ──────────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  createdAt: string;
  resources?: Resource[];
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  url?: string;
  phone?: string;
  address?: string;
  email?: string;
  organization?: string;
  isUrgent: boolean;
  schedule?: string;
  languages?: string;
  eligibility?: string;
  categoryId: number;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

// ── Fetch helper ───────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  let signal: AbortSignal | undefined;
  // AbortSignal.timeout is available in Node 18+ and modern browsers
  if (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal) {
    signal = AbortSignal.timeout(10_000); // 10 s timeout
  }

  const res = await fetch(`${API_BASE}${path}`, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    signal,
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText}: ${path}`);
  }
  return res.json() as Promise<T>;
}

// ── API client ─────────────────────────────────────────────────────────────

export const api = {
  getCategories: () => apiFetch<Category[]>('/categories'),

  getCategory: (slug: string) => apiFetch<Category>(`/categories/${encodeURIComponent(slug)}`),

  getResources: (params?: { search?: string; category?: string; urgent?: string }) => {
    const qs = new URLSearchParams(
      Object.entries(params || {}).filter(([, v]) => !!v) as [string, string][],
    ).toString();
    return apiFetch<Resource[]>(`/resources${qs ? `?${qs}` : ''}`);
  },

  getResource: (id: number) => apiFetch<Resource>(`/resources/${id}`),
};
