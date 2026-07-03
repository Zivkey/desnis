"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { OutliersLogo } from "./BrandLogos";
import { assets } from "@/lib/assets";

type Item = {
  name: string;
  role: string;
  photo: string;
  video: string;
  logo: ReactNode;
};

const items: Item[] = [
  {
    name: "Lukas Pakter",
    role: "Founder of Haus and Outliers",
    photo: assets.lukasPoster,
    video: assets.sourceClip,
    logo: <OutliersLogo />,
  },
  {
    name: "Milic Vasic",
    role: "BPO at CONROO",
    photo: assets.milicPoster,
    video: assets.milicClip,
    logo: (
      <Image
        src={assets.showcase.conroo.logo}
        alt="Conroo"
        width={127}
        height={16}
        draggable={false}
        className="h-5 w-auto max-w-none"
      />
    ),
  },
  {
    name: "Ilija Kocic",
    role: "Co-founder of UnderTheRadar",
    photo: assets.ilijaPoster,
    video: assets.ilijaClip,
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

function fmt(t: number) {
  if (!Number.isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** A testimonial card whose preview plays muted on hover and opens fullscreen on click. */
function ClipCard({ item, onOpen }: { item: Item; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnter = () => {
    videoRef.current?.play().catch(() => {});
  };

  const handleLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <article
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onOpen}
      className="group/clip relative h-[498px] w-[376px] max-w-[82vw] shrink-0 cursor-pointer snap-center overflow-hidden rounded-2xl border border-white/10 desktop:snap-start"
    >
      <video
        ref={videoRef}
        src={item.video}
        poster={item.photo}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 size-full object-cover"
      />
      {/* Darkening gradient for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,13,0.35),rgba(11,11,13,0.85))]" />

      {/* Brand logo — top left */}
      <div className="pointer-events-none absolute left-6 top-6">{item.logo}</div>

      {/* Play button — top right */}
      <button
        type="button"
        aria-label={`Play ${item.name}'s testimonial`}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        className="absolute right-6 top-6 flex size-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="ml-0.5" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>

      {/* Name + role — bottom left */}
      <div className="pointer-events-none absolute bottom-6 left-6">
        <p className="text-lg tracking-[-0.36px] text-white">{item.name}</p>
        <p className="mt-0.5 text-base font-light tracking-[-0.48px] text-white/75">{item.role}</p>
      </div>
    </article>
  );
}

/** Fullscreen player with subtle custom controls and a close button. */
function ClipLightbox({ item, onClose }: { item: Item; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  // Lock page scroll while open, and close on Escape. <html> is the scroll
  // container here (overflow-x + scrollbar-gutter live on it), so lock it —
  // locking <body> does nothing on this site.
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const seek = (value: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = value;
    setCurrent(value);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name}'s testimonial`}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[88vh] w-[min(92vw,1100px)] overflow-hidden rounded-2xl bg-black shadow-2xl"
      >
        <video
          ref={videoRef}
          src={item.video}
          autoPlay
          playsInline
          onClick={togglePlay}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          className="max-h-[88vh] w-full bg-black object-contain"
        />

        {/* Close — top right */}
        <button
          type="button"
          aria-label="Close clip"
          onClick={onClose}
          className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Subtle controls — bottom */}
        <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.7),rgba(0,0,0,0))] px-4 pb-4 pt-12">
          <div className="flex items-center gap-3 text-white/90">
            <button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              onClick={togglePlay}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/25"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="ml-0.5" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <span className="w-10 shrink-0 text-xs tabular-nums text-white/70">{fmt(current)}</span>

            <input
              type="range"
              min={0}
              max={duration || 0}
              step="any"
              value={current}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Seek"
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/25 accent-white [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />

            <span className="w-10 shrink-0 text-xs tabular-nums text-white/70">{fmt(duration)}</span>

            <button
              type="button"
              aria-label={muted ? "Unmute" : "Mute"}
              onClick={toggleMute}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/25"
            >
              {muted ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M11 5 6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M11 5 6 9H2v6h4l5 4V5z" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                  <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Prev / next carousel controls — reused for the desktop header and the
 *  mobile row beneath the cards. */
function Arrows({
  className,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  className: string;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const btn =
    "glass-soft flex size-12 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/10";
  return (
    <div className={className}>
      <button type="button" aria-label="Previous testimonials" onClick={onPrev} disabled={!canPrev} className={btn}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>
      <button type="button" aria-label="Next testimonials" onClick={onNext} disabled={!canNext} className={btn}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
}

export function Testimonials() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            {/* Desktop (≥992px): arrows in the header */}
            <Arrows
              className="hidden shrink-0 items-center gap-2 desktop:flex"
              canPrev={canPrev}
              canNext={canNext}
              onPrev={() => scrollByCard(-1)}
              onNext={() => scrollByCard(1)}
            />
          </div>
        </Reveal>

        {/* Below 992px the carousel runs full-bleed: it breaks out of the
            Container so the cards are cropped by the screen edge, not the
            container's padding. Resets to contained on desktop. */}
        <Reveal className="mt-12">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 max-sm:-mx-6 max-sm:px-6 sm:max-desktop:-mx-10 sm:max-desktop:px-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((t, i) => (
              <ClipCard key={t.name} item={t} onOpen={() => setOpenIndex(i)} />
            ))}
          </div>
        </Reveal>

        {/* Below 992px: arrows beneath the cards */}
        <Arrows
          className="mt-8 flex items-center justify-center gap-2 desktop:hidden"
          canPrev={canPrev}
          canNext={canNext}
          onPrev={() => scrollByCard(-1)}
          onNext={() => scrollByCard(1)}
        />
      </Container>

      {openIndex !== null && (
        <ClipLightbox item={items[openIndex]} onClose={() => setOpenIndex(null)} />
      )}
    </section>
  );
}
