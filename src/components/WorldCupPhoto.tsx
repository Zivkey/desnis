"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { assets } from "@/lib/assets";
import { createSpringDrag } from "@/lib/springDrag";
import { scheduleKeystrokes, writeOn, type Segment } from "./writeOn";
import {
  getServerSnapshot,
  getSnapshot,
  setPhotoExpanded,
  subscribe,
} from "@/lib/worldCupPhoto";

// Two states straight from Figma: the polaroid (frame 1) and the blown-up
// version (frame 2, node 2224:169). Every value is animatable, so the photo
// morphs between them rather than cutting.
//
// The collapsed geometry carries the hand-tuned offsets from review — it has
// drifted from Figma's original polaroid — while the expanded geometry is the
// design's, untouched.
const COLLAPSED = {
  frame: { left: 590, top: 458, width: 260.957, height: 164.147 },
  scale: 0.85,
  rotate: -6.24,
  card: { width: 247.421, height: 138.087, radius: 8 },
  // The card and the source share an aspect ratio, so a plain 100% fill is
  // exactly what object-cover was doing before.
  image: { left: "0%", top: "0%", width: "100%", height: "100%" },
  scrim: 0,
};

const EXPANDED = {
  frame: { left: 141, top: 111, width: 1183.169, height: 690.137 },
  scale: 1,
  rotate: -2.28,
  card: { width: 1158.396, height: 644.466, radius: 16 },
  // The expanded card is a hair wider than the source's ratio, so Figma zooms
  // and offsets the image to cover it.
  image: { left: "-3.91%", top: "-4.08%", width: "107.81%", height: "108.15%" },
  scrim: 0.35,
};

const HOVER_SCALE = 0.8925; // collapsed only
const MORPH = "duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]";

// Pulls the expanded state in off the bottom edge, which "cover" scaling was
// clipping on shorter viewports. Applied to the photo and its text together —
// Figma groups the two (2224:169), and nudging them apart would desync the
// text from the corner it's anchored to.
const EXPANDED_GROUP_SCALE = 0.9;
const EXPANDED_GROUP_SHIFT_Y = -16;

// The copy types on only once the card has finished opening, so the two
// animations read as a sequence rather than a pile-up.
const WRITE_START_MS = 500; // == the morph duration
const HEADING_MS_PER_CHAR = 32;
const BODY_GAP_MS = 120;
const BODY_MS_PER_CHAR = 6;

const HEADING: Segment[] = [
  { text: "It all ", className: "text-[55.346px] leading-[55.346px]" },
  {
    text: "started",
    className: "font-serif text-[62.265px] not-italic leading-[6.054px]",
  },
  { text: " here.", className: "text-[55.346px] leading-[55.346px]" },
];

const BODY =
  "Years later, this image feels less like a memory and more like a prophecy. The child in Messi’s hands grew into a star of his own, and now the two stand on opposite sides of football’s biggest stage, chasing the same dream.";

const HEADING_CHARS = HEADING.reduce((n, s) => n + s.text.length, 0);
const HEADING_END_MS = WRITE_START_MS + HEADING_CHARS * HEADING_MS_PER_CHAR;
const BODY_START_MS = HEADING_END_MS + BODY_GAP_MS;
const WRITE_END_MS = BODY_START_MS + BODY.length * BODY_MS_PER_CHAR;

export function WorldCupPhoto() {
  const expanded = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const groupRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);
  const s = expanded ? EXPANDED : COLLAPSED;

  // Draggable only while collapsed — expanded it's a lightbox, not an object
  // lying on the table.
  useEffect(() => {
    if (expanded || !dragRef.current) return;

    const drag = createSpringDrag(dragRef.current, {
      onDragStateChange: (dragged) => {
        draggedRef.current = dragged;
      },
    });

    return () => {
      drag?.kill();
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPhotoExpanded(false);
    };
    // Clicking anywhere off the photo closes it. The click that opened it is
    // inside the group, so this never sees it as an outside click.
    const onDocClick = (e: MouseEvent) => {
      if (groupRef.current?.contains(e.target as Node)) return;
      setPhotoExpanded(false);
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onDocClick);

    // Ticks along with the copy writing on. Scheduled up front rather than off
    // an interval so the strokes can't drift out of step with the CSS delays.
    // The opening click is the user gesture that unblocks the AudioContext.
    const timers = scheduleKeystrokes(WRITE_START_MS, WRITE_END_MS);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onDocClick);
      timers.forEach(clearTimeout); // Closing mid-write silences the rest.
    };
  }, [expanded]);

  return (
    // Mirrors Figma's Group 1: the photo and its text scale and shift as one.
    // pointer-events-none is load-bearing — this spans the whole frame and is
    // painted last, so without it the group is a sheet of glass over the
    // players and the ball, and nothing but the photo can be hovered.
    <div
      ref={groupRef}
      className={`pointer-events-none absolute inset-0 transition-transform ${MORPH} motion-reduce:transition-none`}
      style={{
        transform: expanded
          ? `translateY(${EXPANDED_GROUP_SHIFT_Y}px) scale(${EXPANDED_GROUP_SCALE})`
          : undefined,
      }}
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-label={
          expanded ? "Close the photo" : "Expand the photo: It all started here"
        }
        onClick={(e) => {
          // A drag ends in a click event too; that shouldn't expand the photo.
          if (draggedRef.current) return;
          setPhotoExpanded(!expanded);
          // Drop the focus ring after a mouse click (detail > 0) — it would
          // otherwise outline the collapsed photo. Keyboard activation reports
          // detail 0, so it keeps focus and its ring.
          if (e.detail > 0) e.currentTarget.blur();
        }}
        className={`pointer-events-auto absolute flex touch-none items-center justify-center outline-none transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${MORPH} motion-reduce:transition-none`}
        style={{
          left: s.frame.left,
          top: s.frame.top,
          width: s.frame.width,
          height: s.frame.height,
          scale: s.scale,
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          if (!expanded) e.currentTarget.style.scale = String(HOVER_SCALE);
        }}
        onMouseLeave={(e) => {
          if (!expanded) e.currentTarget.style.scale = String(COLLAPSED.scale);
        }}
      >
        {/* Drag layer sits outside the rotation on purpose: GSAP writes the
            drag into `transform`, and CSS applies `rotate` after it, so from
            inside the tilt a horizontal drag would come out skewed. */}
        <div ref={dragRef} className="flex-none">
        <div
          className={`flex-none transition-[rotate] ${MORPH} motion-reduce:transition-none`}
          style={{ rotate: `${s.rotate}deg` }}
        >
          <div
            className={`relative shadow-[0px_8px_64px_0px_rgba(0,0,0,0.65)] transition-all ${MORPH} motion-reduce:transition-none`}
            style={{
              width: s.card.width,
              height: s.card.height,
              borderRadius: s.card.radius,
            }}
          >
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ borderRadius: s.card.radius }}
            >
              {/* Not `fill`: that pins the image to 100% and rejects an
                  explicit style.width, which the expanded zoom needs. */}
              <Image
                src={assets.worldCup.photo}
                alt=""
                width={4096}
                height={2286}
                unoptimized
                className={`absolute max-w-none transition-all ${MORPH} motion-reduce:transition-none`}
                style={s.image}
              />
            </div>
            {/* Scrim — carries the white text once the photo is expanded. */}
            <div
              className={`pointer-events-none absolute inset-0 bg-black transition-opacity ${MORPH} motion-reduce:transition-none`}
              style={{ opacity: s.scrim, borderRadius: s.card.radius }}
            />
          </div>
        </div>
        </div>
      </button>

      {/* Sits over the photo, but as a sibling — it must not inherit the card's
          clipping. Fades in only once there's a scrim to read it against. */}
      <div
        aria-hidden={!expanded}
        className={`pointer-events-none absolute left-[811.13px] top-[157.41px] flex h-[170.19px] w-[440.872px] items-center justify-center transition-opacity ${MORPH} motion-reduce:transition-none ${
          expanded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex-none rotate-[-2.28deg]">
          {/* The animated copy is split into per-character spans, which a
              screen reader would announce letter by letter — so it's hidden and
              the real text is carried alongside it. */}
          <p className="sr-only">
            It all started here. {BODY}
          </p>
          <div
            aria-hidden
            // Remounts on each open so every character replays its delay
            // instead of staying where the last run left it.
            key={expanded ? "writing" : "idle"}
            className="flex w-[435.129px] flex-col items-end gap-[13px] text-right text-white"
          >
            <p className="w-full text-[0px] leading-[0] tracking-[-1.6604px]">
              {writeOn(HEADING, WRITE_START_MS, HEADING_MS_PER_CHAR)}
            </p>
            <p className="w-full text-[15.566px] leading-[20.755px]">
              {writeOn([{ text: BODY }], BODY_START_MS, BODY_MS_PER_CHAR)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
