"use client";

import { ReactNode, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Horizontal offset (px) at the start / end of the scroll range. */
  from?: number;
  to?: number;
};

/**
 * Scrubbed horizontal parallax: the wrapped element drifts from `from` to `to`
 * along the x-axis as it travels through the viewport, tied directly to scroll
 * position so it moves in place when you scroll up and down. Respects
 * reduced-motion.
 */
export function Parallax({ children, className, from = 40, to = -40 }: ParallaxProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!triggerRef.current || !innerRef.current) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Animate the inner element while triggering on the (untransformed)
        // wrapper, so the trigger's position stays stable. The range is
        // reachable for a bottom-of-page element (ends when fully in view).
        gsap.fromTo(
          innerRef.current,
          { x: from },
          {
            x: to,
            ease: "none",
            scrollTrigger: {
              trigger: triggerRef.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: triggerRef },
  );

  return (
    <div ref={triggerRef} className={className}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
