"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { flowHover } from "@/components/ui/flow-hover-button";
import { assets } from "@/lib/assets";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const features = [
  "Premium Component Setup",
  "Fully Responsive & Lightning Fast",
  "Managed Hosting & Security",
  "Active as long as you subscribe",
];

// Both tabs intentionally show the same three cards — switching just replays
// the appear animation.
const tiers = [
  { name: "Startup Light", setup: "$500", monthly: "+ $250 / month (24 mo. contract)" },
  { name: "Startup Light", setup: "$500", monthly: "+ $250 / month (24 mo. contract)" },
  { name: "Startup Light", setup: "$500", monthly: "+ $250 / month (24 mo. contract)" },
];

const tabs = ["Launch your site", "Grow your business"];

type Rect = { left: number; top: number; width: number; height: number };

export function PricingTabs() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [rects, setRects] = useState<Rect[]>([]);
  const ready = rects.length === tabs.length;

  const toggleRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cardsRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  // Measure each button so the filled pill and the sliding border can be
  // positioned exactly, even though the two labels have different widths.
  useLayoutEffect(() => {
    const measure = () => {
      const next = btnRefs.current.map((b) =>
        b ? { left: b.offsetLeft, top: b.offsetTop, width: b.offsetWidth, height: b.offsetHeight } : null,
      );
      if (next.every(Boolean)) setRects(next as Rect[]);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (toggleRef.current) ro.observe(toggleRef.current);
    return () => ro.disconnect();
  }, []);

  // Entrance reveal when the cards scroll into view.
  useGSAP(
    () => {
      const cards = cardsRef.current ? Array.from(cardsRef.current.children) : [];
      gsap.fromTo(
        cards,
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

  // Replay the appear animation every time the active tab changes (skip the
  // very first run so it doesn't fight the scroll entrance above).
  useGSAP(
    () => {
      if (firstRun.current) {
        firstRun.current = false;
        return;
      }
      const cards = cardsRef.current ? Array.from(cardsRef.current.children) : [];
      gsap.fromTo(
        cards,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: "power2.out" },
      );
    },
    { dependencies: [active], scope: cardsRef },
  );

  const fill = rects[active];
  const border = rects[hovered ?? active];
  const indicatorTransition = ready ? "transition-all duration-300 ease-out" : "";

  return (
    <>
      {/* Segmented toggle */}
      <div className="mt-8 flex justify-start">
        <div ref={toggleRef} className="glass relative flex items-center gap-1 rounded-xl p-1">
          {/* Filled pill sits on the selected tab */}
          <span
            aria-hidden
            className={`pointer-events-none absolute rounded-xl bg-white ${indicatorTransition}`}
            style={fill ? { left: fill.left, top: fill.top, width: fill.width, height: fill.height } : { opacity: 0 }}
          />
          {/* Outline follows the pointer, resting on the selected tab */}
          <span
            aria-hidden
            className={`pointer-events-none absolute rounded-xl border border-white/45 ${indicatorTransition}`}
            style={
              border ? { left: border.left, top: border.top, width: border.width, height: border.height } : { opacity: 0 }
            }
          />
          {tabs.map((label, i) => (
            <button
              key={label}
              ref={(el) => {
                btnRefs.current[i] = el;
              }}
              type="button"
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className={`relative z-10 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium tracking-[-0.42px] transition-colors ${
                active === i ? "text-ink" : "text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div ref={cardsRef} className="mt-12 grid gap-4 md:grid-cols-3">
        {tiers.map((t, i) => (
          <article key={i} className="glass flex flex-col rounded-2xl p-8 text-left">
            <h3 className="text-2xl tracking-[-0.96px]">{t.name}</h3>
            <p className="mt-2 max-w-[312px] text-base font-light leading-6 text-white/65">
              Perfect for new businesses needing a premium online presence fast.
            </p>

            <div className="mt-6 flex items-end gap-2">
              <span className="text-[32px] leading-10 tracking-[-1.28px]">{t.setup}</span>
              <span className="pb-1.5 text-sm font-light text-white/65">Setup fee</span>
            </div>
            <p className="mt-1 text-base font-light text-white">{t.monthly}</p>

            <button className={flowHover("light", "mt-10 w-full rounded-xl py-3 text-sm font-semibold")}>
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
      </div>
    </>
  );
}
