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

// Messi takes the same three states as Yamal: healthy, bandaged at half health,
// drained to black and white once beaten.
//
// Each carries its own source *and* crop, unlike Yamal's clean swaps: the
// healthy pose is cropped out of the shared three-object image, while the two
// damage states are Messi alone at their own sizes. Every crop below is Figma's
// (2240:101 / 2240:103) and preserves its source's aspect, so none distort.
const HURT_AT = 0.5;
const DEFEATED_AT = 1;

const HEALTHY = {
  src: assets.worldCup.playerArgentina,
  width: 4000,
  height: 2233,
  crop: "left-[-127.99%] top-[-28.79%] h-[128.79%] w-[253.51%]",
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
