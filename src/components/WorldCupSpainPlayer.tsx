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

// Yamal wears three states as he takes a beating: healthy, bandaged at half
// health, and drained to black and white once he's beaten. All three are the
// same pose at the same 1414x1374 (Figma 2240:104 / 2240:107), so they swap
// into the same slot with nothing moved, resized or refitted.
const HURT_AT = 0.5;
const DEFEATED_AT = 1;

function spriteFor(damage: number) {
  if (damage >= DEFEATED_AT)
    return { src: assets.worldCup.playerSpainDefeated, alt: "Spain player, defeated" };
  if (damage >= HURT_AT)
    return { src: assets.worldCup.playerSpainHurt, alt: "Spain player, bruised" };
  return { src: assets.worldCup.playerSpain, alt: "Spain player" };
}

export function WorldCupSpainPlayer() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const sprite = spriteFor(damageOf(parseFight(snapshot), "spain"));

  return (
    // No `key` here: React keeps the same <img> across a src change, so the
    // listeners stay bound and AlphaHoverScale rebuilds its alpha map on load.
    // Remounting instead would reset `hovered`, leaving the player un-hovered
    // under a stationary cursor until you moved the mouse.
    <AlphaHoverScale
      hoverScale={0.848}
      label="Attack Yamal 🇪🇸"
      attackTarget="spain"
      className="absolute left-[72px] top-[107px] h-[617.633px] w-[635.383px] scale-[0.8075] transition-[scale,opacity] duration-300 ease-out motion-reduce:transition-none group-data-[photo-expanded]:pointer-events-none group-data-[photo-expanded]:opacity-0"
      innerClassName="flex size-full items-center justify-center"
    >
      <div className="flex-none rotate-[-6.13deg]">
        <div className="relative h-[559px] w-[579px]">
          <div className="absolute inset-[-10.02%_-11.05%_-12.88%_-11.05%]">
            <Image
              src={sprite.src}
              alt={sprite.alt}
              width={707}
              height={687}
              unoptimized
              priority
              className="block size-full max-w-none"
            />
          </div>
        </div>
      </div>
    </AlphaHoverScale>
  );
}
