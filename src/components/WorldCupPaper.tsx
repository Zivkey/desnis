"use client";

import { useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import { assets } from "@/lib/assets";
import {
  getServerSnapshot,
  getSnapshot,
  setPaperOpen,
  subscribe,
} from "@/lib/worldCupPaper";
import { scheduleKeystrokes, writeOn } from "./writeOn";
import { FRAME_HEIGHT, FRAME_WIDTH } from "./WorldCupStage";

// Spain v Argentina head-to-head, in the order Figma lists them (2232:169) —
// not chronological, which is why the years jump around.
const MATCHES: [year: string, result: string][] = [
  ["1952", "Spain 0 - 1 Argentina"],
  ["1960", "Argentina 2 - 0 Spain"],
  ["1953", "Argentina 1 - 0 Spain"],
  ["1966", "Argentina 2 - 1 Spain"],
  ["1961", "Spain 2 - 0 Argentina"],
  ["1974", "Argentina 1 - 1 Spain"],
  ["1972", "Spain 1 - 0 Argentina"],
  ["1995", "Spain 2 - 1 Argentina"],
  ["1988", "Spain 1 - 1 Argentina"],
  ["1999", "Spain 0 - 2 Argentina"],
  ["2009", "Spain 2 - 1 Argentina"],
  ["2006", "Spain 2 - 1 Argentina"],
  ["2010", "Argentina 4 - 1 Spain"],
  ["2018", "Spain 6 - 1 Argentina"],
];

const REVEAL_MS = 450;
const WRITE_START_MS = REVEAL_MS; // copy waits for the sheet to settle
const MS_PER_CHAR = 6;
const PAPER_SCALE = 0.8;

// The sheet is laid down rather than cross-faded: it drops in from slightly
// up, small and over-rotated, then settles with a little overshoot — the
// overshoot is what sells it as a physical sheet coming to rest. Closing
// reverses faster and without the bounce, which would read as indecision.
const SETTLE_IN = "duration-[450ms] ease-[cubic-bezier(0.34,1.4,0.64,1)]";
const SETTLE_OUT = "duration-[200ms] ease-in";
const ENTER_SCALE = PAPER_SCALE * 0.92;
const ENTER_ROTATE = "-2.5deg";
const ENTER_LIFT = "0px -14px";

// Character offset each row starts at, so a row's delay picks up where the
// previous row left off and the sheet reads as one continuous pass rather than
// 14 rows racing each other.
const ROW_OFFSETS: number[] = [];
const TOTAL_CHARS = MATCHES.reduce((chars, [year, result]) => {
  ROW_OFFSETS.push(chars);
  return chars + year.length + result.length;
}, 0);
const WRITE_END_MS = WRITE_START_MS + TOTAL_CHARS * MS_PER_CHAR;

const ROW_TEXT = "text-[15.566px] leading-[20.755px] text-black";

export function WorldCupPaper() {
  const open = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPaperOpen(false);
    };
    window.addEventListener("keydown", onKey);

    const timers = scheduleKeystrokes(WRITE_START_MS, WRITE_END_MS);
    return () => {
      window.removeEventListener("keydown", onKey);
      timers.forEach(clearTimeout);
    };
  }, [open]);

  return (
    // Its own fixed, stage-scaled layer rather than a child of the stage: the
    // header and the vote bar are sibling fixed layers painted after the stage,
    // so nothing nested inside it can ever rise above them. Rendered last and
    // re-using --wc-scale, this keeps the design's frame coordinates while
    // sitting on top of everything.
    //
    // Interactive only while open, which is also what closes it: the opening
    // click lands on the ball while this layer is still inert, and every click
    // after that hits the layer.
    <div
      className={`fixed inset-0 overflow-hidden transition-opacity ease-out motion-reduce:transition-none ${
        open
          ? "opacity-100 duration-[250ms]"
          : "pointer-events-none opacity-0 duration-[200ms]"
      }`}
      onClick={() => setPaperOpen(false)}
    >
      <div
        aria-hidden={!open}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
          transform: "scale(var(--wc-scale, 1))",
        }}
      >
        {/* scale/rotate/translate are separate properties in Tailwind v4, so
            they compose here instead of overwriting one another. */}
        <div
          className={`absolute inset-0 transition-[scale,rotate,translate] motion-reduce:transition-none ${
            open ? SETTLE_IN : SETTLE_OUT
          }`}
          style={{
            scale: open ? PAPER_SCALE : ENTER_SCALE,
            rotate: open ? "0deg" : ENTER_ROTATE,
            translate: open ? "0px 0px" : ENTER_LIFT,
          }}
        >
      {/* Paper. The shadow is a drop-shadow filter, not the box-shadow Figma's
          codegen emits: the sheet is a torn cutout with a transparent margin,
          and a box-shadow would paint the card's full rectangle straight
          through it — a pale rectangular halo around the torn edges. A
          drop-shadow follows the alpha, which is what Figma actually renders. */}
      <div className="pointer-events-none absolute left-[calc(25%+44.84px)] top-[3px] flex h-[898.902px] w-[629.096px] items-center justify-center">
        <div className="flex-none rotate-[3.73deg] drop-shadow-[0px_8.95px_35px_rgba(0,0,0,0.5)]">
          <div className="relative h-[863.382px] w-[574.149px]">
            <Image
              src={assets.worldCup.paper}
              alt=""
              fill
              unoptimized
              sizes="575px"
              className="pointer-events-none max-w-none object-cover"
            />
          </div>
        </div>
      </div>

      {/* Spain crest */}
      <div className="pointer-events-none absolute left-[496px] top-[68px] flex h-[121.456px] w-[87.503px] items-center justify-center">
        <div className="flex-none rotate-[-6.31deg]">
          <div className="relative h-[113.856px] w-[75.452px]">
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={assets.worldCup.crests}
                alt=""
                width={1632}
                height={2588}
                unoptimized
                className="absolute left-0 top-[-46.26%] h-[201.56%] w-[192.22%] max-w-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Argentina crest — the same source image, cropped elsewhere. */}
      <div className="pointer-events-none absolute left-[calc(50%+82.24px)] top-[628.42px] flex h-[180.494px] w-[140.722px] items-center justify-center">
        <div className="flex-none rotate-[15deg]">
          <div className="relative h-[159.259px] w-[103.013px]">
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={assets.worldCup.crests}
                alt=""
                width={1632}
                height={2588}
                unoptimized
                className="absolute left-[-96.93%] top-[-46.26%] h-[201.56%] w-[196.93%] max-w-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="pointer-events-none absolute left-[calc(33.33%+69px)] top-[180px] flex h-[536.71px] w-[301.571px] items-center justify-center">
        <div className="flex-none rotate-[3.05deg]">
          <p className="sr-only">
            Spain versus Argentina, previous results:{" "}
            {MATCHES.map(([year, result]) => `${year}, ${result}`).join(". ")}
          </p>
          <div
            aria-hidden
            // Remounts on each open so the characters replay their delays.
            key={open ? "writing" : "idle"}
            className="flex w-[274.159px] flex-col items-start gap-[4px]"
          >
            {MATCHES.map(([year, result], i) => {
              const yearAt = WRITE_START_MS + ROW_OFFSETS[i] * MS_PER_CHAR;
              const resultAt = yearAt + year.length * MS_PER_CHAR;
              return (
                <div
                  key={year + result}
                  className="flex h-[33.634px] w-full shrink-0 items-center justify-center"
                >
                  <div className="w-full flex-none rotate-[2.65deg]">
                    <div className="flex h-[21px] w-full items-center gap-[24px]">
                      <p className={`w-[62.47px] shrink-0 ${ROW_TEXT}`}>
                        {writeOn([{ text: year }], yearAt, MS_PER_CHAR, `y${i}`)}
                      </p>
                      <div className="relative flex h-[13px] w-0 shrink-0 items-center justify-center">
                        <div className="flex-none rotate-90">
                          <div className="relative h-0 w-[13px]">
                            <div className="absolute inset-[-1px_0_0_0]">
                              <Image
                                src={assets.worldCup.divider}
                                alt=""
                                width={13}
                                height={1}
                                unoptimized
                                className="block size-full max-w-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className={`shrink-0 whitespace-nowrap ${ROW_TEXT}`}>
                        {writeOn(
                          [{ text: result }],
                          resultAt,
                          MS_PER_CHAR,
                          `r${i}`,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}
