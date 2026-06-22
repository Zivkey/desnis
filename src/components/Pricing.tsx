import Image from "next/image";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { assets } from "@/lib/assets";

const features = [
  "Premium Component Setup",
  "Fully Responsive & Lightning Fast",
  "Managed Hosting & Security",
  "Active as long as you subscribe",
];

const tiers = [
  { name: "Startup Light", setup: "$500", monthly: "+ $250 / month (24 mo. contract)" },
  { name: "Startup Light", setup: "$500", monthly: "+ $250 / month (24 mo. contract)" },
  { name: "Startup Light", setup: "$500", monthly: "+ $250 / month (24 mo. contract)" },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-20 lg:py-24">
      <Container>
        <Reveal stagger={0.12}>
          <h2 className="text-[28px] leading-tight tracking-[-1.28px] sm:text-[32px]">
            Our pricing is simple
          </h2>
          <p className="mt-4 max-w-[474px] text-lg font-light leading-7 text-white/65">
            Lorem ipsum dolor sit amet consectetur. Metus suscipit diam et quis
            ipsum adipiscing tortor lacus.
          </p>

          {/* Segmented toggle */}
          <div className="mt-8 flex justify-start">
          <div className="glass flex items-center gap-1 rounded-xl p-1">
            <button className="rounded-xl bg-white px-3.5 py-2.5 text-sm font-medium tracking-[-0.42px] text-ink transition-opacity hover:opacity-90">
              Launch your site
            </button>
            <button className="rounded-xl px-3.5 py-2.5 text-sm font-medium tracking-[-0.42px] text-white transition-colors hover:bg-white/10">
              Grow your business
            </button>
          </div>
          </div>
        </Reveal>

        {/* Cards */}
        <Reveal className="mt-12 grid gap-4 md:grid-cols-3" stagger={0.15}>
          {tiers.map((t, i) => (
            <article
              key={i}
              className="glass flex flex-col rounded-2xl p-8 text-left"
            >
              <h3 className="text-2xl tracking-[-0.96px]">{t.name}</h3>
              <p className="mt-2 max-w-[312px] text-base font-light leading-6 text-white/65">
                Perfect for new businesses needing a premium online presence fast.
              </p>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-[32px] leading-10 tracking-[-1.28px]">
                  {t.setup}
                </span>
                <span className="pb-1.5 text-sm font-light text-white/65">
                  Setup fee
                </span>
              </div>
              <p className="mt-1 text-base font-light text-white">{t.monthly}</p>

              <button className="glass-soft mt-10 rounded-xl py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink">
                Get Started
              </button>

              <ul className="mt-8 space-y-6">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Image src={assets.iconCheck} alt="" width={20} height={20} />
                    <span className="text-sm text-white/90">{f}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
