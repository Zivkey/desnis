"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { assets } from "@/lib/assets";
import { sound } from "@/lib/sound";

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
          sound.grab();
        },
        onRelease() {
          sound.release();
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
          {/* InvertoLux logo */}
          <Image src={assets.invertoLuxLogo1} alt="" width={23} height={4} draggable={false} className="absolute left-[9px] top-[9px] h-[3.9px] w-[23px] max-w-none" />
          <p className="absolute left-[11px] top-[50px] w-[81px] bg-linear-to-r from-white to-white/35 bg-clip-text text-left text-[19px] font-bold leading-[19px] tracking-[-1.33px] text-transparent">
            Pouzdan i tihi rad
          </p>
          <p className="absolute bottom-[3px] left-[11px] text-left text-[3.7px] tracking-[-0.15px] text-white">
            invertolux.com
          </p>
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
          {/* InvertoLux logo */}
          <Image src={assets.invertoLuxLogo2} alt="" width={23} height={4} draggable={false} className="absolute left-[9px] top-[9px] h-[3.9px] w-[23px] max-w-none" />
          <p className="absolute left-[11px] top-[18px] w-[71px] bg-linear-to-r from-white to-white/35 bg-clip-text text-left text-[14.78px] font-bold leading-[14.78px] tracking-[-1.03px] text-transparent">
            Energetski efikasne.
          </p>
          <p className="absolute left-[11px] top-[51px] w-[73px] text-left text-[5.5px] font-normal leading-[5.5px] tracking-[-0.22px] text-white/75">
            Inverter klime sa niskom potrošnjom struje
          </p>
        </div>
      </div>
    </div>
  );
}
