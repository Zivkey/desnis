import Image from "next/image";
import { Container } from "./Container";
import { assets } from "@/lib/assets";

type Token = {
  icon: string;
  badge: string;
  title: string;
  amount: string;
  rest: string;
};

const tokens: Token[] = [
  {
    icon: assets.iconMonitor,
    badge: "1 Token",
    title: "Development & Design",
    amount: "1 Token",
    rest: " for layout changes, adding a new section, custom landing web design, or UX enhancements.",
  },
  {
    icon: assets.iconSearch,
    badge: "1 Token",
    title: "SEO & Visibility",
    amount: "1 Token",
    rest: " for an in-depth SEO page audit, page speed adjustments, or keywords integration.",
  },
  {
    icon: assets.iconImage,
    badge: "1 Token",
    title: "Content & Social",
    amount: "1 Token",
    rest: " for a professionally optimized blog post or a set of ad creative graphics for social media.",
  },
  {
    icon: assets.iconGrowth,
    badge: "2 Token",
    title: "Advanced Scaling",
    amount: "2 Tokens",
    rest: " for complex API integrations, automated lead capturing webhooks, or full analytics setups.",
  },
];

export function TokenEcosystem() {
  return (
    <section className="relative py-20 lg:py-24">
      <Container>
        <h2 className="text-[28px] leading-tight tracking-[-1.28px] sm:text-[32px]">
          The token ecosystem
        </h2>

        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {tokens.map((t) => (
            <div key={t.title}>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3.5 py-2.5">
                <Image src={t.icon} alt="" width={16} height={16} />
                <span className="text-sm font-medium tracking-[-0.42px] text-white">
                  {t.badge}
                </span>
              </span>
              <h3 className="mt-4 text-lg font-medium">{t.title}</h3>
              <p className="mt-2 text-sm font-light leading-5 text-white/65">
                Exchange <span className="font-medium text-white">{t.amount}</span>
                {t.rest}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
