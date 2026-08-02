// JSON-LD for the DES/NIS brand entity.
//
// Google needs something that ties this host to a *named* thing. Without it the
// domain is an unlabelled server that happens to return HTML, which is roughly
// how it's been treated so far (1 crawl request in 90 days). Structured data
// doesn't cause crawling on its own, but once a crawl lands this is what lets
// Google file the site under a brand rather than as an anonymous page.

const BASE_URL = "https://desnis.com";

const DESCRIPTION =
  "We combine deep industry experience with AI to design, build, and launch digital experiences faster.";

export const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "DES/NIS",
      url: BASE_URL,
      description: DESCRIPTION,
      email: "veljko@desnis.com",
      // Same number the WhatsApp link uses, in E.164.
      telephone: "+381640075000",
      logo: {
        "@type": "ImageObject",
        "@id": `${BASE_URL}/#logo`,
        url: `${BASE_URL}/icon.svg`,
        contentUrl: `${BASE_URL}/icon.svg`,
      },
      image: { "@id": `${BASE_URL}/#logo` },
      // Where Google corroborates the brand against profiles it already trusts.
      // The LinkedIn company page lists desnis.com as its website, so the two
      // confirm each other. Only *organisation* profiles belong here — personal
      // LinkedIn profiles would be separate Person entities with `worksFor`.
      // Add Instagram / GitHub / directory listings here as they go live.
      sameAs: ["https://www.linkedin.com/company/desnis"],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "DES/NIS",
      description: DESCRIPTION,
      publisher: { "@id": `${BASE_URL}/#organization` },
      inLanguage: "en",
    },
  ],
};
