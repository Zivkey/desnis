import type { MetadataRoute } from "next";

// www is the canonical host — the apex (desnis.com) 308-redirects to it.
const BASE_URL = "https://www.desnis.com";

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
