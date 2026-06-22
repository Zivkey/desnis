"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { WORDMARK_GLYPHS, WORDMARK_VIEWBOX } from "@/lib/footerWordmark";

gsap.registerPlugin(useGSAP);

/**
 * The oversized "DES/NIS" footer wordmark, rendered inline as stroked glyph
 * outlines. GSAP traces each letter on (stroke-dashoffset), one after another,
 * then flows them back off — looping forever. Respects reduced-motion.
 */
export function FooterWordmark() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useGSAP(
    () => {
      const paths = pathRefs.current.filter((p): p is SVGPathElement => p !== null);
      if (!paths.length) return;

      const lengths = paths.map((p) => p.getTotalLength());

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        paths.forEach((p, i) => {
          gsap.set(p, { strokeDasharray: lengths[i], strokeDashoffset: lengths[i] });
        });

        const tl = gsap.timeline({
          repeat: -1,
          repeatDelay: 0.6,
          defaults: { ease: "power1.inOut" },
        });
        tl.timeScale(0.6);
        // Draw each letter on, left to right.
        tl.to(paths, { strokeDashoffset: 0, duration: 1.1, stagger: 0.16 });
        // Hold, then un-draw: the stroke retracts the way it came, and loops.
        tl.to(
          paths,
          { strokeDashoffset: (i: number) => lengths[i], duration: 1.0, stagger: 0.12 },
          "+=0.9",
        );

        return () => tl.kill();
      });

      // Reduced motion: just show the outlines, no looping draw.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        paths.forEach((p) => gsap.set(p, { strokeDasharray: "none", strokeDashoffset: 0 }));
      });

      return () => mm.revert();
    },
    { scope: svgRef },
  );

  return (
    <svg
      ref={svgRef}
      viewBox={WORDMARK_VIEWBOX}
      className="h-auto w-full select-none text-white/45"
      aria-label="DES/NIS"
      role="img"
    >
      {WORDMARK_GLYPHS.map((g, i) => (
        <path
          key={i}
          ref={(el) => {
            pathRefs.current[i] = el;
          }}
          d={g.d}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="butt"
          strokeLinejoin="bevel"
        />
      ))}
    </svg>
  );
}
