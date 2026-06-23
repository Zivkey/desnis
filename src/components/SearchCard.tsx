"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

const TITLE = "Create Mockups - Balsamiq Wireframes";
const DESC =
  "It’s like sketching on a whiteboard. Go On, Unleash Your Creativity! Life’s too short for bad software. Try Balsamiq Wireframes for Free!";

/* Frosted Google-style search result (SEO & AEO column) with a looping typewriter */
export function SearchCard() {
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
    tl.set([headerRef.current], { opacity: 0, y: -6 })
      .set(contentRef.current, { opacity: 1, y: 0 })
      .set([titleRef.current, descRef.current], { text: "" })
      // Fade the header (result meta) in, sliding down into place, before typing.
      .to(headerRef.current, { duration: 0.7, ease: "power1.out", opacity: 1, y: 0 })
      .to(titleRef.current, { duration: 1.1, ease: "none", text: TITLE })
      .to(descRef.current, { duration: 2.4, ease: "none", text: DESC }, "+=0.15")
      // Hold the finished result, then fade header + text out, drifting up.
      .to([headerRef.current, contentRef.current], { duration: 0.88, ease: "power1.inOut", opacity: 0, y: -6 }, "+=1.4");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="w-full max-w-[277px] overflow-hidden rounded-2xl bg-white/5 p-4 text-left shadow-[0_8px_128px_0_rgba(0,0,0,0.65)] backdrop-blur-[4px]">
      <div ref={headerRef}>
        <p className="text-[8px] text-white/35">Environ 105 000 000 résultats (0,43 secondes)</p>
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="size-3 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-500 to-rose-500" />
          <div className="leading-tight">
            <p className="text-[8px] text-white/75">Nom du site</p>
            <p className="text-[7px] text-white/75">
              <span className="font-bold">Annonce</span> · www.balsamiq.com/
            </p>
          </div>
        </div>
      </div>

      {/* Typewriter area: an invisible "ghost" reserves the full height so the card
          never resizes while the visible copy is being typed on top of it. */}
      <div className="relative mt-2">
        <div aria-hidden className="invisible">
          <p className="text-[11px] leading-snug">{TITLE}</p>
          <p className="mt-1 text-[9px] leading-snug">{DESC}</p>
        </div>
        <div ref={contentRef} className="absolute inset-0">
          <p ref={titleRef} className="text-[11px] leading-snug text-white">
            {TITLE}
          </p>
          <p ref={descRef} className="mt-1 text-[9px] leading-snug text-white/60">
            {DESC}
          </p>
        </div>
      </div>
    </div>
  );
}
