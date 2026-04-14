/*
 * github-fallback.ts
 *
 * Fetches marketplace.json from the GitHub raw URL as a fallback
 * when Convex is unreachable.
 *
 * Used by both:
 *   - [WEBSITE]  src/services/marketplace/marketplace.service.ts
 *   - [APP]      AppData/forbidden/backend/services/marketplace/marketplace.service.ts
 *
 * Place this file next to each service's marketplace.service.ts.
 * Both copies are identical — no project-specific imports.
 */

const MARKETPLACE_JSON_URL =
  'https://raw.githubusercontent.com/BlackBlazent/blackvideo-extensions/main/marketplace.json';

export interface GithubMarketplaceEntry {
  id:               string;
  slug:             string;
  name:             string;
  tagline:          string;
  description:      string;
  version:          string;
  author:           string;
  authorClass:      string;
  category:         string;
  type:             string;
  license:          string;
  tags:             string[];
  iconUrl:          string | null;
  bannerUrl:        string | null;
  screenshots:      string[];
  githubRepo:       string;
  githubReleaseTag: string;
  downloadUrl:      string;
  downloadCount:    number;
  starCount:        number;
  featured:         boolean;
  status:           string;
  publishedAt:      number;
}

let _cache: GithubMarketplaceEntry[] | null = null;
let _cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchMarketplaceFallback(opts?: {
  category?: string;
  search?:   string;
}): Promise<{ extensions: GithubMarketplaceEntry[]; total: number }> {
  const now = Date.now();

  if (!_cache || now - _cacheTime > CACHE_TTL) {
    try {
      const res = await fetch(MARKETPLACE_JSON_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`GitHub fetch failed: ${res.status}`);
      const data = await res.json() as { extensions: GithubMarketplaceEntry[] };
      _cache     = data.extensions ?? [];
      _cacheTime = now;
    } catch (err) {
      console.error('[MarketplaceFallback] Could not fetch marketplace.json:', err);
      return { extensions: [], total: 0 };
    }
  }

  let results = _cache.filter(e => e.status === 'published');

  if (opts?.category && opts.category !== 'all') {
    results = results.filter(e => e.category === opts.category);
  }

  if (opts?.search) {
    const q = opts.search.toLowerCase();
    results = results.filter(
      e =>
        e.name.toLowerCase().includes(q) ||
        e.tagline.toLowerCase().includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  return { extensions: results, total: results.length };
}