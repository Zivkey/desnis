"use client";

import { useSyncExternalStore } from "react";
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

// Messi wears three states as he takes a beating: healthy, bruised at half
// health, and drained to black and white once he's beaten (Figma 2247:104 /
// 2247:101 / 2247:100).
//
// All three are cut to his 601x660 slot's aspect (0.9106), so object-cover
// fills each edge to edge — one markup, one code path, no per-state crop.
// Resolutions differ, which object-cover doesn't care about.
const HURT_AT = 0.5;
const DEFEATED_AT = 1;

function spriteFor(damage: number) {
  if (damage >= DEFEATED_AT)
    return {
      src: assets.worldCup.playerArgentinaDefeated,
      width: 2404,
      height: 2640,
      alt: "Argentina player, defeated",
    };
  if (damage >= HURT_AT)
    return {
      src: assets.worldCup.playerArgentinaHurt,
      width: 2404,
      height: 2640,
      alt: "Argentina player, bruised",
    };
  return {
    src: assets.worldCup.playerArgentina,
    width: 1803,
    height: 1980,
    alt: "Argentina player",
  };
}

export function WorldCupArgentinaPlayer() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const sprite = spriteFor(damageOf(parseFight(snapshot), "argentina"));

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
      {/* The wrapper can't be pointer-events-none or the image would never see
          the mouse that AlphaHoverScale hit-tests against. */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={sprite.src}
          alt={sprite.alt}
          width={sprite.width}
          height={sprite.height}
          unoptimized
          priority
          className="absolute inset-0 size-full max-w-none object-cover"
        />
      </div>
    </AlphaHoverScale>
  );
}
