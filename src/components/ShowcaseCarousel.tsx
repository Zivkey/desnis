"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AltaNapaLogo, CompassLogo, HessenLogo, OutliersLogo } from "./BrandLogos";
import { assets } from "@/lib/assets";

// Four unique cards shown in a repeating 1,2,3,4 sequence.
const cards = [
  { src: assets.cardFrame13, alt: "Outliers", href: "https://www.joinoutliers.com/", logo: <OutliersLogo />, color: "#43201c" },
  { src: assets.cardWebDesign, alt: "Hessen Kräuter", href: "https://www.hessenkraeuter.de/", logo: <HessenLogo />, color: "#2c6db4" },
  { src: assets.cardMockup, alt: "Compass Energy Solutions", href: "https://www.compassenergy.solar/", logo: <CompassLogo />, color: "#41474d" },
  { src: assets.cardGreenery, alt: "Alta Napa premium wine", href: "https://www.altanapawines.com/", logo: <AltaNapaLogo />, color: "#3c4a2b" },
];

const AUTO_SPEED = 0.05; // px per ms — continuous leftward drift

export function ShowcaseCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLDivElement>(null);
  // Set true after a real drag so the click that follows doesn't open a card.
  const draggedRef = useRef(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const s = {
      offset: 0,
      momentum: 0, // px per ms, carried after release
      dragging: false,
      lastX: 0,
      lastT: 0,
      startX: 0,
      moved: false,
      half: 0, // width of one card sequence — the seamless wrap distance
    };

    const measure = () => {
      s.half = seqRef.current ? seqRef.current.offsetWidth : 0;
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (seqRef.current) ro.observe(seqRef.current);

    let last = performance.now();
    let raf = requestAnimationFrame(function tick(now: number) {
      let dt = now - last;
      last = now;
      if (dt > 32) dt = 32; // clamp big gaps (tab switches)

      if (!s.dragging) {
        if (Math.abs(s.momentum) > AUTO_SPEED) {
          // Coast on the throw, decaying toward the base speed.
          s.offset += s.momentum * dt;
          s.momentum *= Math.pow(0.95, dt / 16.67);
        } else {
          s.momentum = 0;
          s.offset -= AUTO_SPEED * dt; // resume auto-scroll
        }
      }

      if (s.half > 0) {
        while (s.offset <= -s.half) s.offset += s.half;
        while (s.offset > 0) s.offset -= s.half;
      }
      track.style.transform = `translate3d(${s.offset}px,0,0)`;
      raf = requestAnimationFrame(tick);
    });

    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      const now = performance.now();
      const dx = e.clientX - s.lastX;
      const dtt = Math.max(now - s.lastT, 1);
      s.offset += dx;
      s.momentum = dx / dtt;
      s.lastX = e.clientX;
      s.lastT = now;
      if (Math.abs(e.clientX - s.startX) > 5) s.moved = true;
    };
    const onUp = () => {
      if (!s.dragging) return;
      s.dragging = false;
      if (s.moved) draggedRef.current = true;
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      draggedRef.current = false;
      s.dragging = true;
      s.moved = false;
      s.momentum = 0;
      s.startX = e.clientX;
      s.lastX = e.clientX;
      s.lastT = performance.now();
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
      document.addEventListener("pointercancel", onUp);
    };

    viewport.addEventListener("pointerdown", onDown);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      viewport.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div id="our-work" className="mt-14">
      {/* Clip horizontally; pad vertically (top pulled back) so a card's hover
          scale isn't clipped and the section's overflow doesn't cut the bottom. */}
      <div
        ref={viewportRef}
        onClickCapture={(e) => {
          // Swallow the click that ends a drag so the card doesn't navigate.
          if (draggedRef.current) {
            e.preventDefault();
            e.stopPropagation();
            draggedRef.current = false;
          }
        }}
        className="cursor-grab touch-pan-y overflow-hidden py-3 -mt-3 active:cursor-grabbing"
      >
        <div
          ref={trackRef}
          onDragStart={(e) => e.preventDefault()}
          className="flex w-max select-none will-change-transform"
        >
          {[0, 1].map((dup) => (
            <div
              key={dup}
              ref={dup === 0 ? seqRef : undefined}
              className="flex shrink-0 gap-6 pr-6"
              aria-hidden={dup === 1}
            >
              {[...cards, ...cards].map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit the ${c.alt} website (opens in a new tab)`}
                  draggable={false}
                  style={{ backgroundColor: c.color }}
                  className="group/card relative block h-[398px] w-[278px] shrink-0 overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-[1.02]"
                >
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    sizes="278px"
                    draggable={false}
                    className="pointer-events-none object-cover transition-opacity duration-500 group-hover/card:opacity-0"
                  />
                  <div className="pointer-events-none absolute inset-x-0 top-7 z-10 flex justify-center transition-all duration-500 ease-out group-hover/card:top-[38%] group-hover/card:-translate-y-1/2 group-hover/card:scale-110">
                    {c.logo}
                  </div>
                  <span className="absolute bottom-4 right-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors duration-300 group-hover/card:bg-white group-hover/card:text-ink">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
