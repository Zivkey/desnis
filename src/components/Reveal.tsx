"use client";

import { ReactNode, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Distance (px) the content travels up as it fades in. */
  y?: number;
  /** Delay between each direct child (set 0 to move them as one). */
  stagger?: number;
  delay?: number;
  /** ScrollTrigger start position. */
  start?: string;
  duration?: number;
};

/**
 * Fades + slides its direct children up as they scroll into view.
 * Runs only on the client, reverts cleanly on unmount, and respects
 * prefers-reduced-motion (content simply stays visible).
 */
export function Reveal({
  children,
  className,
  y = 28,
  stagger = 0.1,
  delay = 0,
  start = "top 85%",
  duration = 0.85,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // Reveal the wrapper immediately (it starts hidden via the [data-reveal]
      // CSS rule to avoid an SSR flash). Runs before paint, and also covers the
      // reduced-motion path where no animation is created below.
      gsap.set(el, { opacity: 1 });

      const targets = el.children.length
        ? gsap.utils.toArray<HTMLElement>(el.children)
        : [el];

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(targets, {
          opacity: 0,
          y,
          duration,
          ease: "power3.out",
          stagger,
          delay,
          scrollTrigger: { trigger: el, start, once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-reveal className={className}>
      {children}
    </div>
  );
}
