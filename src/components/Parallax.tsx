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

      // Trigger on the enclosing footer/section so the scrub range runs all
      // the way to the bottom of the page (the wrapper alone ends early because
      // content sits below it).
      const trigger =
        (triggerRef.current.closest("footer, section") as HTMLElement | null) ??
        triggerRef.current;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Animate the inner element while triggering on the (untransformed)
        // section, so the trigger's position stays stable.
        gsap.fromTo(
          innerRef.current,
          { x: from },
          {
            x: to,
            ease: "none",
            scrollTrigger: {
              trigger,
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
