"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { assets } from "@/lib/assets";
import { createSpringDrag } from "@/lib/springDrag";
import {
  getServerSnapshot,
  getSnapshot,
  parseFight,
  subscribe,
  winnerOf,
  type Team,
} from "@/lib/worldCupFight";

// Badge geometry is ours, not the design's — Figma gave the sticker on its own
// canvas with no placement. Tucked beside each player's head, on their outer
// side so it never covers the other's silhouette.
//
// Heads sit at roughly (419, 189) and (1121, 249) in frame coordinates, measured
// off the topmost opaque row of each sprite.
const BADGE = 168;
const SPOT: Record<Team, { left: number; top: number; rotate: number }> = {
  spain: { left: 176, top: 110, rotate: -8 },
  argentina: { left: 1140, top: 170, rotate: 8 },
};

function Badge({ team, won }: { team: Team; won: boolean }) {
  const dragRef = useRef<HTMLDivElement>(null);
  const spot = SPOT[team];

  // Draggable like everything else on the page, but only once it's on show —
  // an invisible badge shouldn't be grabbable.
  useEffect(() => {
    if (!won || !dragRef.current) return;
    const drag = createSpringDrag(dragRef.current);
    return () => {
      drag?.kill();
    };
  }, [won]);

  return (
    <div
      aria-hidden={!won}
      // The cursor lives here, not on the drag target below: createSpringDrag
      // sets `cursor: inherit` inline on that target, which outranks any class
      // it carries — so `inherit` has to find the pointer on this parent.
      className={`pointer-events-none absolute transition-[scale,opacity,rotate] duration-500 ease-[cubic-bezier(0.34,1.5,0.64,1)] motion-reduce:transition-none ${
        won ? "cursor-pointer" : ""
      }`}
      style={{
        left: spot.left,
        top: spot.top,
        width: BADGE,
        height: BADGE,
        // Slams in from small and over-rotated, the same "landed" feel as the
        // paper. Kept mounted so it can animate rather than pop.
        opacity: won ? 1 : 0,
        scale: won ? 1 : 0.4,
        rotate: `${won ? spot.rotate : spot.rotate - 14}deg`,
      }}
    >
      {/* Drag target carries no transform of its own: the reveal above owns
          scale/rotate, and GSAP writes the drag into `transform`, which CSS
          applies *after* them — from inside, a drag would come out scaled and
          skewed. */}
      <div ref={dragRef} className={`size-full ${won ? "pointer-events-auto" : ""}`}>
        <Image
          src={assets.worldCup.fanFavorite}
          alt={won ? `${team} is the fan favorite` : ""}
          width={2048}
          height={2048}
          unoptimized
          // drop-shadow, not the design's box-shadow: the badge is a cutout with
          // a transparent margin, and a box-shadow would paint its rectangle
          // straight through it.
          className="size-full max-w-none object-contain drop-shadow-[0px_8px_40px_rgba(0,0,0,0.6)]"
        />
      </div>
    </div>
  );
}

export function WorldCupFanFavorite() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const winner = winnerOf(parseFight(snapshot));

  return (
    <>
      {(["spain", "argentina"] as const).map((team) => (
        <Badge key={team} team={team} won={winner === team} />
      ))}
    </>
  );
}
