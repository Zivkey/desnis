"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { assets } from "@/lib/assets";

gsap.registerPlugin(Draggable, InertiaPlugin);

const CARD =
  "absolute w-[124px] cursor-grab touch-none overflow-hidden rounded-[10px] border-[3px] border-white/75 bg-white shadow-[0_5px_80px_0_rgba(0,0,0,0.65)] active:cursor-grabbing";

const BASE_ROTATION = [-6.68, 5.46];

/* Two ad creatives, draggable within the Social Media & Collateral column */
export function SocialStack() {
  const boxRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    // Roam the whole column cell (box -> visual wrapper -> column cell), up to its edges.
    const bounds = box.parentElement?.parentElement ?? box;

    // "Drag me" hint: gently bobs until the first drag, then fades away for good.
    const hint = hintRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hintTween: gsap.core.Tween | null = null;
    let hintDismissed = false;

    if (hint) {
      gsap.set(hint, { xPercent: -50 });
      if (!reduce) {
        hintTween = gsap.to(hint, { y: -3, duration: 1.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
      }
    }

    const dismissHint = () => {
      if (hintDismissed || !hint) return;
      hintDismissed = true;
      hintTween?.kill();
      gsap.to(hint, { opacity: 0, y: 8, duration: 0.35, ease: "power2.in" });
    };

    const instances = cardRefs.current.map((card, i) => {
      if (!card) return null;
      gsap.set(card, { rotation: BASE_ROTATION[i] });

      return Draggable.create(card, {
        type: "x,y",
        bounds,
        inertia: true,
        onPress() {
          cardRefs.current.forEach((c) => c && (c.style.zIndex = "1"));
          card.style.zIndex = "2";
        },
        onDragStart() {
          dismissHint();
        },
        onDrag() {
          const rot = BASE_ROTATION[i] + gsap.utils.clamp(-16, 16, this.deltaX * 0.3);
          gsap.to(card, { rotation: rot, duration: 0.15, ease: "power1.out" });
        },
        onDragEnd() {
          gsap.to(card, { rotation: BASE_ROTATION[i], duration: 0.8, ease: "power2.out" });
        },
      })[0];
    });

    return () => {
      hintTween?.kill();
      instances.forEach((d) => d?.kill());
    };
  }, []);

  return (
    <div ref={boxRef} className="relative z-40 h-[230px] w-[300px] max-w-full">
      {/* "Drag me" hint — a curved arrow pointing at the stack, fades out after the first drag */}
      <div
        ref={hintRef}
        aria-hidden
        className="pointer-events-none absolute -bottom-1 left-1/2 z-0 flex items-end gap-0.5 text-white/85"
      >
        <svg viewBox="0 0 60 52" width="46" height="40" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M54 44 C 40 49, 19 45, 17 13" />
          <path d="M17 13 L 10 22" />
          <path d="M17 13 L 24 22" />
        </svg>
        <span className="font-serif text-xl italic leading-none">drag me</span>
      </div>

      {/* back card */}
      <div
        ref={(el) => {
          cardRefs.current[0] = el;
        }}
        className={`${CARD} left-[44px] top-1`}
      >
        <div className="relative aspect-[124/156]">
          <Image src={assets.adCreative1} alt="" fill sizes="124px" draggable={false} className="object-cover" />
          <div className="absolute inset-0 bg-black/25" />
          <p className="absolute left-2.5 top-1/2 w-[80px] text-base font-bold leading-tight tracking-tight text-white">
            Pouzdan i tihi rad
          </p>
          <p className="absolute bottom-2 left-2.5 text-[5px] text-white">invertolux.com</p>
        </div>
      </div>

      {/* front card */}
      <div
        ref={(el) => {
          cardRefs.current[1] = el;
        }}
        className={`${CARD} left-[96px] top-10`}
      >
        <div className="relative aspect-[124/156]">
          <Image src={assets.adCreative2} alt="" fill sizes="124px" draggable={false} className="object-cover" />
          <p className="absolute left-2.5 top-2 w-[72px] text-[13px] font-bold leading-tight tracking-tight text-white">
            Energetski efikasne.
          </p>
          <p className="absolute left-2.5 top-12 w-[74px] text-[6px] leading-tight text-white/75">
            Inverter klime sa niskom potrošnjom struje
          </p>
        </div>
      </div>
    </div>
  );
}
