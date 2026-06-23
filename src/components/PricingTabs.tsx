"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Calendar, Pause } from "lucide-react";
import { flowHover } from "@/components/ui/flow-hover-button";
import { assets } from "@/lib/assets";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const oneTime = [
  {
    name: "Landing Page",
    pages: ["1 pager"],
    prices: [1000],
    desc: "Perfect for new businesses needing a premium online presence fast. A beautifully crafted single-page website designed to convert visitors into clients.",
    features: [
      "Clean single-page layout designed to convert visitors fast.",
      "100% custom premium design tailored to your brand.",
      "Flawless experience on all phones, tablets, and computers.",
      "Ready-to-use lead forms so clients can reach out instantly.",
      "Standard search setup so people can easily find you on Google.",
      "100% yours with zero monthly agency fees.",
    ],
  },
  {
    name: "Premium",
    pages: ["5 pages", "10 pages", "15 pages+"],
    prices: [5000, 9000, 14000],
    desc: "A full multi-page website, engineered to rank and convert. Custom design, advanced search visibility, and the polish that makes visitors trust you.",
    features: [
      "Multi-page structure with options for 5, 10, or 15+ pages.",
      "100% custom premium design with high-end motion & animations.",
      "Flawless experience on all phones, tablets, and computers.",
      "Simple dashboard to update your text, images, or blog posts yourself.",
      "Advanced strategy to outrank your competition on Google.",
      "100% yours with zero monthly agency fees.",
    ],
  },
];

const club = {
  desc: "Continuous design, development, and strategy for your brand. The power of a dedicated digital team without the hiring overhead.",
  benefits: [
    "50 Monthly Tokens - Blazing fast execution at our most exclusive rate ($50/h).",
    "Same-Day Priority - Your tasks jump straight to the front of our daily queue.",
    "All-In-One - Use your tokens for anything: design, code, SEO, copy, or social media.",
    "Total Flexibility - Pause or cancel your membership anytime you want, no stress.",
  ],
};

const hourPackageDesc =
  "Flexible, on-demand hours for businesses needing top-tier execution. Secure your package now and use the hours completely at your own pace.";

const hourPlans = ["Basic", "Growth", "Scale"];
const hourTiers = [
  {
    price: 500,
    tokens: 5,
    rate: 100,
    benefits: ["48-Hour Response Time", "Valid for 6 Months", "Use your tokens for any needs", "0 Free Tokens"],
  },
  {
    price: 1200,
    tokens: 15,
    rate: 80,
    benefits: ["24-Hour Response Time", "Valid for 12 Months", "Use your tokens for any needs", "1 Free Token"],
  },
  {
    price: 2450,
    tokens: 35,
    rate: 70,
    benefits: ["Same-Day Turnaround", "Never Expires", "Use your tokens for any needs", "2 Free Tokens"],
  },
];

const tabs = ["One-Time", "Monthly"];

type Rect = { left: number; top: number; width: number; height: number };

/**
 * Segmented control with a white pill that slides to the selected option and a
 * faint outline that follows the pointer. Shared by the billing toggle and the
 * per-card selectors.
 */
function SlidingTabs({
  options,
  value,
  onChange,
  trackClassName = "",
  itemClassName = "",
  radius = "rounded-lg",
  equal = false,
  unselectedText = "text-white",
}: {
  options: string[];
  value: number;
  onChange: (i: number) => void;
  trackClassName?: string;
  itemClassName?: string;
  radius?: string;
  equal?: boolean;
  unselectedText?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [rects, setRects] = useState<Rect[]>([]);
  const ready = rects.length === options.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useLayoutEffect(() => {
    const measure = () => {
      const next = btnRefs.current
        .slice(0, options.length)
        .map((b) =>
          b ? { left: b.offsetLeft, top: b.offsetTop, width: b.offsetWidth, height: b.offsetHeight } : null,
        );
      if (next.length === options.length && next.every(Boolean)) setRects(next as Rect[]);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [options.length]);

  const fill = rects[value];
  const border = rects[hovered ?? value];
  const t = ready ? "transition-all duration-300 ease-out" : "";

  return (
    <div ref={trackRef} className={`relative flex items-center ${trackClassName}`}>
      <span
        aria-hidden
        className={`pointer-events-none absolute bg-white ${radius} ${t}`}
        style={fill ? { left: fill.left, top: fill.top, width: fill.width, height: fill.height } : { opacity: 0 }}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute border border-white/45 ${radius} ${t}`}
        style={
          border ? { left: border.left, top: border.top, width: border.width, height: border.height } : { opacity: 0 }
        }
      />
      {options.map((opt, i) => (
        <button
          key={opt}
          ref={(el) => {
            btnRefs.current[i] = el;
          }}
          type="button"
          aria-pressed={value === i}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered(i)}
          onBlur={() => setHovered(null)}
          className={`relative z-10 whitespace-nowrap text-center transition-colors ${radius} ${
            equal ? "flex-1" : ""
          } ${itemClassName} ${value === i ? "text-ink" : unselectedText}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Features({ items }: { items: string[] }) {
  return (
    <ul className="mt-8 space-y-6">
      {items.map((f) => {
        const [head, ...rest] = f.split(" - ");
        const tail = rest.join(" - ");
        return (
          <li key={f} className="flex items-start gap-2">
            <Image src={assets.iconCheck} alt="" width={20} height={20} className="mt-0.5 shrink-0" />
            <span className="text-sm leading-6 text-white/90">
              {tail ? (
                <>
                  <span className="text-white">{head}</span> — <span className="text-white/65">{tail}</span>
                </>
              ) : (
                head
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function TokensLine({ amount, rate }: { amount: string; rate: string }) {
  return (
    <p className="mt-2 text-sm font-light text-white/65">
      Includes <span className="text-white">{amount}</span> ({rate})
    </p>
  );
}

const formatPrice = (v: number) => `$${Math.round(v)}`;

/** Price that rolls (counts) from its previous value to the new one via GSAP. */
function AnimatedPrice({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const valRef = useRef({ v: value });
  const initial = useRef(formatPrice(value));

  useEffect(() => {
    const tween = gsap.to(valRef.current, {
      v: value,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = formatPrice(valRef.current.v);
      },
    });
    return () => {
      tween.kill(); // keep the current animated value, no jump on rapid changes
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {initial.current}
    </span>
  );
}

export function PricingTabs() {
  const [active, setActive] = useState(0);
  const [premiumPages, setPremiumPages] = useState(0);
  const [hourPlan, setHourPlan] = useState(0);
  const cardsRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  const cardEls = () =>
    cardsRef.current ? Array.from(cardsRef.current.querySelectorAll<HTMLElement>("[data-price-card]")) : [];

  // Entrance reveal when the cards scroll into view.
  useGSAP(
    () => {
      gsap.fromTo(
        cardEls(),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 85%", once: true },
        },
      );
    },
    { scope: cardsRef },
  );

  // Replay the appear animation whenever the billing tab changes.
  useGSAP(
    () => {
      if (firstRun.current) {
        firstRun.current = false;
        return;
      }
      gsap.fromTo(
        cardEls(),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: "power2.out" },
      );
    },
    { dependencies: [active], scope: cardsRef },
  );

  const info = [
    {
      title: "Token ecosystem",
      text: "1 Token = 1 Hour",
      icon: (
        <Image
          src={assets.tokenEcosystemIcon}
          alt=""
          width={32}
          height={32}
          className="size-8 rounded-full"
        />
      ),
    },
    {
      title: "Pause anytime",
      text: "Temporarily pause your subscription anytime, no sweat.",
      icon: (
        <span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white">
          <Pause size={15} fill="currentColor" strokeWidth={0} />
        </span>
      ),
    },
    {
      title: "Try it for a week",
      text: "Not loving it after a week? Get 75% back, no questions asked.",
      icon: (
        <span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white">
          <Calendar size={15} />
        </span>
      ),
    },
  ];

  return (
    <>
      {/* Billing toggle */}
      <div className="mt-8 flex justify-start">
        <SlidingTabs
          options={tabs}
          value={active}
          onChange={setActive}
          trackClassName="glass gap-1 rounded-xl p-1"
          itemClassName="px-3.5 py-2.5 text-sm font-medium tracking-[-0.42px]"
          radius="rounded-xl"
        />
      </div>

      <div ref={cardsRef} className="mt-12 space-y-4">
        {active === 0 ? (
          /* ---------- One-Time ---------- */
          <div className="grid gap-4 md:grid-cols-2">
            {oneTime.map((t, i) => (
              <article
                data-price-card
                key={t.name}
                className="glass flex flex-col rounded-2xl p-8 text-left"
              >
                <h3 className="text-2xl tracking-[-0.96px]">{t.name}</h3>
                <p className="mt-2 text-base font-light leading-6 text-white/65">{t.desc}</p>
                <AnimatedPrice
                  value={t.prices[t.pages.length > 1 ? premiumPages : 0]}
                  className="mt-6 text-[40px] leading-none tracking-[-1.6px]"
                />

                {t.pages.length < 2 ? (
                  <div className="mt-6 rounded-xl bg-white/[0.06] p-1">
                    <div className="rounded-lg py-2.5 text-center text-sm text-white/45">{t.pages[0]}</div>
                  </div>
                ) : (
                  <SlidingTabs
                    options={t.pages}
                    value={premiumPages}
                    onChange={setPremiumPages}
                    trackClassName="mt-6 bg-white/[0.06] rounded-xl p-1"
                    itemClassName="py-2.5 text-sm"
                    equal
                    unselectedText="text-white/55"
                  />
                )}

                <Link
                  href={`/contact?plan=${t.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className={flowHover("light", "mt-2.5 w-full rounded-xl py-3 text-sm font-semibold")}
                >
                  Reach out
                </Link>
                <Features items={t.features} />
              </article>
            ))}
          </div>
        ) : (
          /* ---------- Monthly ---------- */
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Desnis Club */}
              <article
                data-price-card
                className="glass relative flex flex-col rounded-2xl p-8 text-left md:col-span-2"
              >
                {/* Decorative membership card — rises out of the top of the card,
                    sitting beside the title (desktop only). */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-10 right-8 hidden h-[235px] w-[365px] rotate-[-7deg] rounded-2xl bg-[linear-gradient(135deg,#efefef,#bdbdbd)] shadow-[0_24px_70px_rgba(0,0,0,0.5)] lg:block"
                />
                <h3 className="text-2xl tracking-[-0.96px]">Desnis Club</h3>
                <p className="mt-2 max-w-[320px] text-base font-light leading-6 text-white/65">{club.desc}</p>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-[40px] leading-none tracking-[-1.6px]">$2500</span>
                  <span className="pb-1 text-lg font-light text-white/65">/mo</span>
                </div>
                <TokensLine amount="50 Tokens" rate="$50 = 1h" />

                <div className="mt-auto">
                  <Link
                    href="/contact?plan=desnis-club"
                    className={flowHover("light", "mt-8 w-full rounded-xl py-3 text-sm font-semibold")}
                  >
                    Reach out
                  </Link>
                  <Features items={club.benefits} />
                </div>
              </article>

              {/* Hour Package */}
              <article data-price-card className="glass flex flex-col rounded-2xl p-8 text-left">
                <h3 className="text-2xl tracking-[-0.96px]">Hour Package</h3>
                <p className="mt-2 text-base font-light leading-6 text-white/65">{hourPackageDesc}</p>
                <AnimatedPrice
                  value={hourTiers[hourPlan].price}
                  className="mt-6 text-[40px] leading-none tracking-[-1.6px]"
                />
                <TokensLine
                  amount={`${hourTiers[hourPlan].tokens} Tokens`}
                  rate={`$${hourTiers[hourPlan].rate} = 1h`}
                />

                <SlidingTabs
                  options={hourPlans}
                  value={hourPlan}
                  onChange={setHourPlan}
                  trackClassName="mt-6 bg-white/[0.06] rounded-xl p-1"
                  itemClassName="py-2.5 text-sm"
                  equal
                  unselectedText="text-white/55"
                />

                <div className="mt-auto">
                  <Link
                    href="/contact?plan=hour-package"
                    className={flowHover("light", "mt-8 w-full rounded-xl py-3 text-sm font-semibold")}
                  >
                    Reach out
                  </Link>
                  <Features items={hourTiers[hourPlan].benefits} />
                </div>
              </article>
            </div>

            {/* Info row */}
            <div className="grid gap-4 md:grid-cols-3">
              {info.map((c) => (
                <article
                  data-price-card
                  key={c.title}
                  className="glass flex min-h-[150px] flex-col justify-between rounded-2xl p-6 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl tracking-[-0.4px]">{c.title}</h3>
                    {c.icon}
                  </div>
                  <p className="text-sm font-light leading-6 text-white/65">{c.text}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
