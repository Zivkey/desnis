"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { assets } from "@/lib/assets";
import { AlphaHoverScale } from "./AlphaHoverScale";
import {
  damageOf,
  getServerSnapshot,
  getSnapshot,
  parseFight,
  subscribe,
} from "@/lib/worldCupFight";

// Messi takes the same three states as Yamal: healthy, bandaged at half health,
// drained to black and white once beaten.
//
// All three are standalone cutouts, but at different sizes, so each carries its
// own crop. Every crop below is Figma's (2242:120 / 2240:101 / 2240:103) and
// preserves its source's aspect, so none distort.
const HURT_AT = 0.5;
const DEFEATED_AT = 1;

// 1803x1980 is exactly the 601x660 slot's aspect, so filling it edge to edge is
// what object-cover would do anyway — no crop, no letterboxing.
const HEALTHY = {
  src: assets.worldCup.playerArgentina,
  width: 1803,
  height: 1980,
  crop: "left-0 top-0 h-full w-full",
  alt: "Argentina player",
};

const HURT = {
  src: assets.worldCup.playerArgentinaHurt,
  width: 2400,
  height: 1339,
  crop: "left-[-40.14%] top-[1.52%] h-[92.58%] w-[182.22%]",
  alt: "Argentina player, bruised",
};

const DEFEATED = {
  src: assets.worldCup.playerArgentinaDefeated,
  width: 2400,
  height: 2400,
  crop: "left-[-3.23%] top-[-0.04%] h-[95.41%] w-[104.78%]",
  alt: "Argentina player, defeated",
};

function spriteFor(damage: number) {
  if (damage >= DEFEATED_AT) return DEFEATED;
  if (damage >= HURT_AT) return HURT;
  return HEALTHY;
}

export function WorldCupArgentinaPlayer() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const target = spriteFor(damageOf(parseFight(snapshot), "argentina"));
  const [sprite, setSprite] = useState(target);

  // Decode the next sprite before showing it. Messi's three cutouts are
  // different sizes with different crops, so swapping naively applies the new
  // crop the instant the state flips — while the new bytes are still loading —
  // and paints the *old* image under the *new* crop: a stretched flash. Yamal
  // never shows this because his three share one size and one crop.
  //
  // decode() resolves once the image is ready to paint, so src and crop land
  // together on the same frame.
  useEffect(() => {
    if (target.src === sprite.src) return;
    let cancelled = false;

    const pending = new window.Image();
    pending.src = target.src;
    pending
      .decode()
      .catch(() => {}) // Decode can reject; showing it late beats not at all.
      .finally(() => {
        if (!cancelled) setSprite(target);
      });

    return () => {
      cancelled = true;
    };
  }, [target, sprite]);

  return (
    // Figma's drop shadow follows the cutout's alpha, so this is a drop-shadow
    // filter rather than a (rectangular) box-shadow.
    //
    // No `key` here: React keeps the same <img> across a src change, so the
    // listeners stay bound and AlphaHoverScale rebuilds its alpha map on load.
    // Remounting instead would reset `hovered`, leaving the player un-hovered
    // under a stationary cursor until you moved the mouse.
    <AlphaHoverScale
      hoverScale={0.803}
      label="Attack Messi 🇦🇷"
      attackTarget="argentina"
      className="absolute left-[calc(50%+36px)] top-[136px] h-[660px] w-[601px] scale-[0.765] drop-shadow-[0px_8px_64px_rgba(0,0,0,0.65)] transition-[scale,opacity] duration-300 ease-out motion-reduce:transition-none group-data-[photo-expanded]:pointer-events-none group-data-[photo-expanded]:opacity-0"
    >
      {/* The crop wrapper can't be pointer-events-none or the image would never
          see the mouse that AlphaHoverScale hit-tests against. */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={sprite.src}
          alt={sprite.alt}
          width={sprite.width}
          height={sprite.height}
          unoptimized
          priority
          className={`absolute max-w-none ${sprite.crop}`}
        />
      </div>
    </AlphaHoverScale>
  );
}
