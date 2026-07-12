import type { MetadataRoute } from "next";

// The apex (desnis.com) is the canonical host — www 308-redirects to it.
const BASE_URL = "https://desnis.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
