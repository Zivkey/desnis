"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getSnapshot,
  parseFight,
  resetFight,
  spainShareOf,
  subscribe,
  winnerOf,
} from "@/lib/worldCupFight";
import {
  getServerSnapshot as photoServerSnapshot,
  getSnapshot as photoSnapshot,
  subscribe as photoSubscribe,
} from "@/lib/worldCupPhoto";
import { sound } from "@/lib/sound";

// Figma's bars ran 120 -> 499 (a 369px span with a 10px gap). The percentages
// and the reset button took the room: the run is pulled in on both sides to
// clear them — the one place the bar deviates from the design, and only because
// the design has neither.
const BARS_TOTAL = 342;
const BARS_LEFT = 118;
const BARS_GAP = 10;

// Pinned so the share never reflows its label: "100%" is wider than "50%", and
// the labels are the walls the bars are sized against.
const PERCENT = "w-[38px] text-right tabular-nums text-white/55";

export function WorldCupVoteBar() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const fight = useMemo(() => parseFight(snapshot), [snapshot]);
  // Pinned to the viewport rather than inside the stage, so it can't ride the
  // stage's group-data fade and has to read the photo state itself.
  const photoExpanded = useSyncExternalStore(
    photoSubscribe,
    photoSnapshot,
    photoServerSnapshot,
  );

  const spainPercent = spainShareOf(fight);
  const argentinaPercent = 100 - spainPercent;
  const spainWidth = (spainPercent / 100) * BARS_TOTAL;
  const argentinaWidth = BARS_TOTAL - spainWidth;
  const winner = winnerOf(fight);

  const spainBar = useRef<HTMLDivElement>(null);
  const argentinaBar = useRef<HTMLDivElement>(null);
  const previous = useRef(fight.net);

  // Swells the bar that just landed a hit, so the fight reacts rather than
  // silently sliding. Keyed off the net score, not the widths: both bars move
  // on every hit, but only one of them gained ground.
  useEffect(() => {
    const before = previous.current;
    previous.current = fight.net;
    if (fight.net === before) return;

    const grew = fight.net > before ? spainBar.current : argentinaBar.current;
    if (!grew) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // scale y only — the bar thickens in place while its width animates.
    grew.animate(
      [
        { scale: "1 1", filter: "brightness(1)" },
        { scale: "1 1.9", filter: "brightness(1.45)", offset: 0.3 },
        { scale: "1 1", filter: "brightness(1)" },
      ],
      { duration: 450, easing: "ease-out" },
    );
  }, [fight]);

  // Fades every child individually rather than the wrapper. An ancestor at
  // opacity < 1 becomes a backdrop root, which leaves the pill's backdrop-blur
  // with nothing behind it to blur — so the blur stays invisible for the whole
  // fade and then snaps in the instant opacity reaches exactly 1. An element
  // fading its *own* backdrop-filter has no such problem.
  const fade = `transition-opacity duration-500 ease-out motion-reduce:transition-none ${
    photoExpanded ? "opacity-0" : "opacity-100"
  }`;

  return (
    <div
      className={`fixed bottom-[31px] left-[calc(50%+0.5px)] h-[52px] w-[619px] -translate-x-1/2 ${
        photoExpanded ? "pointer-events-none" : ""
      }`}
    >
      <div
        className={`absolute inset-0 rounded-[12px] bg-white/5 shadow-[0px_8px_64px_0px_rgba(0,0,0,0.35)] backdrop-blur-[32px] ${fade}`}
      />

      {/* tabular-nums so the share doesn't jostle the name as digits change. */}
      <div
        className={`absolute left-[16px] top-[16px] flex items-center gap-[8px] whitespace-nowrap text-[16px] font-medium leading-[20px] tracking-[-0.32px] text-white ${fade}`}
      >
        <span>Spain</span>
        <span className={PERCENT}>{spainPercent}%</span>
      </div>
      <div
        className={`absolute right-[16px] top-[16px] flex items-center gap-[8px] whitespace-nowrap text-[16px] font-medium leading-[20px] tracking-[-0.32px] text-white ${fade}`}
      >
        <span className={PERCENT}>{argentinaPercent}%</span>
        <span>Argentina</span>
      </div>

      <div
        ref={spainBar}
        className={`absolute top-[21px] h-[10px] rounded-[100px] bg-[#cd0e2f] transition-[width,opacity] duration-500 ease-out motion-reduce:transition-none ${
          photoExpanded ? "opacity-0" : "opacity-100"
        }`}
        style={{ left: BARS_LEFT, width: spainWidth }}
      />
      <div
        ref={argentinaBar}
        className={`absolute top-[21px] h-[10px] rounded-[100px] bg-[#87accf] transition-[width,left,opacity] duration-500 ease-out motion-reduce:transition-none ${
          photoExpanded ? "opacity-0" : "opacity-100"
        }`}
        style={{ left: BARS_LEFT + spainWidth + BARS_GAP, width: argentinaWidth }}
      />

      {/* Sits just outside the pill — there is no room inside it, and the
          design has no reset. Only offered once the fight has actually moved. */}
      <button
        type="button"
        onClick={() => {
          resetFight();
          sound.click();
        }}
        aria-label="Reset the fight"
        title="Reset"
        className={`absolute left-[calc(100%+12px)] top-1/2 grid h-[36px] w-[36px] -translate-y-1/2 place-items-center rounded-full bg-white/5 text-white/70 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.35)] backdrop-blur-[32px] transition-[opacity,color] duration-300 ease-out hover:text-white motion-reduce:transition-none ${
          (fight.hits.spain === 0 && fight.hits.argentina === 0) || photoExpanded
            ? "pointer-events-none opacity-0"
            : "opacity-100"
        } ${winner ? "animate-pulse" : ""}`}
      >
        {/* Rotate-arrow glyph — no icon dependency for one control. */}
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
    </div>
  );
}
