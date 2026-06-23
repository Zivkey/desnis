// Pricing packages, shared between the pricing cards (CTA links) and the
// contact form (checkboxes). Slugs are used as the `?plan=` query value.
export const PLANS = [
  { slug: "landing-page", label: "Landing Page" },
  { slug: "premium", label: "Premium" },
  { slug: "desnis-club", label: "Desnis Club" },
  { slug: "hour-package", label: "Hour Package" },
] as const;

export type PlanSlug = (typeof PLANS)[number]["slug"];
