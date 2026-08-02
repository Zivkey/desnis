import type { MetadataRoute } from "next";

// The apex (desnis.com) is the canonical host — www 308-redirects to it, so the
// sitemap must list apex URLs (same host it's served from, no redirects).
const BASE_URL = "https://desnis.com";

// Real per-page dates, bumped by hand when a page's content actually changes.
// Deliberately NOT `new Date()`: that stamps every page with the build time, so
// each deploy claims all four pages changed. Google spots sitemaps whose lastmod
// is always "now" and stops trusting the field altogether.
//
// /world-cup is intentionally absent — it's `hidden lg:block`, so under
// mobile-first indexing it would be crawled as a near-empty page.
const LAST_MODIFIED = {
  home: "2026-07-04",
  contact: "2026-07-03",
  privacy: "2026-06-24",
  terms: "2026-06-24",
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: LAST_MODIFIED.home,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: LAST_MODIFIED.contact,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: LAST_MODIFIED.privacy,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: LAST_MODIFIED.terms,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
