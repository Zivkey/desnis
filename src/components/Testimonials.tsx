"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { OutliersLogo } from "./BrandLogos";
import { assets } from "@/lib/assets";

type Item = {
  name: string;
  role: string;
  photo: string;
  logo: ReactNode;
};

const items: Item[] = [
  {
    name: "Lukas Pakter",
    role: "Founder of Haus and Outliers",
    photo: assets.testimonial1,
    logo: <OutliersLogo />,
  },
  {
    name: "Pavle Sarcevic",
    role: "Founder of Incorporify",
    photo: assets.testimonial2,
    logo: <span className="text-xl font-bold tracking-[-0.8px] text-white">incorporify</span>,
  },
  {
    name: "Ilija Kocic",
    role: "Co-founder of UnderTheRadar",
    photo: assets.testimonial1,
    logo: (
      <Image
        src={assets.utrLogo}
        alt="UnderTheRadar"
        width={76}
        height={24}
        draggable={false}
        className="h-6 w-auto max-w-none"
      />
    ),
  },
];

const CARD = 376;
const GAP = 16;

export function Testimonials() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const scrollByCard = (dir: number) => {
    scrollerRef.current?.scrollBy({ left: dir * (CARD + GAP), behavior: "smooth" });
  };

  return (
    <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-16">
      <Container>
        <Reveal>
          <div className="flex items-center justify-between gap-4">
            <h2 className="max-w-[640px] text-[34px] leading-tight tracking-[-1.44px] sm:text-[40px] lg:text-[48px]">
              Hear it directly from the source
            </h2>
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <button
                type="button"
                aria-label="Previous testimonials"
                onClick={() => scrollByCard(-1)}
                disabled={!canPrev}
                className="glass-soft flex size-12 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next testimonials"
                onClick={() => scrollByCard(1)}
                disabled={!canNext}
                className="glass-soft flex size-12 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((t) => (
              <article
                key={t.name}
                className="relative h-[498px] w-[376px] max-w-[82vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10"
              >
                <Image src={t.photo} alt={t.name} fill sizes="376px" className="object-cover" />
                {/* Darkening gradient for legibility */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,13,0.35),rgba(11,11,13,0.85))]" />

                {/* Brand logo — top left */}
                <div className="absolute left-6 top-6">{t.logo}</div>

                {/* Play button — top right */}
                <button
                  type="button"
                  aria-label={`Play ${t.name}'s testimonial`}
                  className="absolute right-6 top-6 flex size-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="ml-0.5" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>

                {/* Name + role — bottom left */}
                <div className="absolute bottom-6 left-6">
                  <p className="text-lg tracking-[-0.36px] text-white">{t.name}</p>
                  <p className="mt-0.5 text-base font-light tracking-[-0.48px] text-white/75">
                    {t.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
