"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import { Calendar, Pause } from "lucide-react";
import { flowHover } from "@/components/ui/flow-hover-button";
import { assets } from "@/lib/assets";
import { sound } from "@/lib/sound";

gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable);

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
          onMouseEnter={() => {
            setHovered(i);
            if (i !== value) sound.hover(); // border slides → subtle tick
          }}
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

/** The Desnis "D" mark, filled with the white → lavender gradient from the
 *  token-ecosystem icon so the card and the brand icon read as one family. */
function DesnisMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 19.9658 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <defs>
        <linearGradient id="desnis-mark-gradient" x1="10" y1="0" x2="10" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#c3c3f7" />
        </linearGradient>
      </defs>
      <path
        d="M4.90918 14.9092L0 20V10H10L4.90918 14.9092ZM9.99512 0.00390625C15.5217 0.0882743 19.9657 4.52457 19.9658 10C19.9658 15.5283 15.4356 19.9999 9.83496 20H7.5293L4.9668 15H9.83496C12.5529 14.9999 14.9657 12.6828 14.9658 10C14.9657 7.31725 12.5529 5.00008 9.83496 5H4.82129L0 10V0H10L9.99512 0.00390625Z"
        fill="url(#desnis-mark-gradient)"
      />
    </svg>
  );
}

/**
 * The decorative "membership card" on Desnis Club. Styled after the
 * token-ecosystem icon — a navy→indigo gradient with a lavender bottom-right
 * glow and the gradient Desnis mark. Drag it anywhere; on release it springs
 * back to its original spot. Rotation lives on the CSS `rotate` property so
 * GSAP's x/y translate never fights it. Desktop only (lg:block).
 */
function ClubCard() {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { rotation: -7 }); // resting tilt — GSAP owns the transform
    const instances = Draggable.create(el, {
      type: "x,y",
      onPress() {
        gsap.killTweensOf(el); // grab again mid-return without a jump
        sound.grab();
      },
      onRelease() {
        sound.release();
      },
      onDragEnd() {
        gsap.to(this.target, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.55)" });
      },
    });

    // The royal-blue corner glow breathes and drifts so the gradient feels
    // alive. (The dark base also pans via the `animate-club-gradient` keyframes.)
    const tweens = [
      gsap.to(glowRef.current, {
        xPercent: -8,
        yPercent: -7,
        scale: 1.12,
        opacity: 0.78,
        duration: 5.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      }),
    ];

    return () => {
      instances.forEach((d) => d.kill());
      tweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute -top-10 right-8 z-30 hidden h-[235px] w-[365px] cursor-grab touch-none overflow-hidden rounded-2xl bg-[#050509] shadow-[0_24px_70px_rgba(0,0,0,0.5)] active:cursor-grabbing lg:block"
    >
      {/* Base — near-black with only a faint navy toward the bottom-right.
          Oversized so it can pan via the `animate-club-gradient` keyframes. */}
      <div
        className="animate-club-gradient absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(135deg,#050509 0%,#050510 68%,#09091f 100%)",
          backgroundSize: "200% 200%",
          backgroundPosition: "0% 0%",
        }}
      />
      {/* Royal-blue glow concentrated in the bottom-right corner, fading
          diagonally into the dark — the signature of the Figma card. */}
      <div
        ref={glowRef}
        className="absolute -bottom-12 -right-10 size-56 rounded-full bg-[radial-gradient(circle,rgba(58,66,248,0.9),rgba(42,48,205,0.32)_34%,transparent_60%)] blur-[38px]"
      />
      {/* Soft top sheen for a glassy, premium feel */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_38%)]" />
      {/* Hairline inner border */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10" />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-between p-7">
        <div className="flex items-start justify-between">
          <DesnisMark className="h-9 w-9" />
          <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/50">Member</span>
        </div>
        <div>
          <p className="bg-[linear-gradient(180deg,#ffffff,#c3c3f7)] bg-clip-text text-[22px] font-medium tracking-[-0.5px] text-transparent">
            Desnis Club
          </p>
          <p className="mt-1 text-xs font-light tracking-wide text-white/45">Priority membership</p>
        </div>
      </div>
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
              {/* Desnis Club — lifted above its grid siblings (relative z-20) so
                  the draggable card can float over the Hour Package / info cards
                  instead of being covered by their `glass` stacking contexts. */}
              <article
                data-price-card
                className="glass relative z-20 flex flex-col rounded-2xl p-8 text-left md:col-span-2"
              >
                {/* Decorative membership card — rises out of the top of the card,
                    sitting beside the title (desktop only). Drag it around. */}
                <ClubCard />
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
