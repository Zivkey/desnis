"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { attack, TEAM_COLOR, type Team } from "@/lib/worldCupFight";
import { setPaperOpen } from "@/lib/worldCupPaper";
import { sound } from "@/lib/sound";
import { createSpringDrag } from "@/lib/springDrag";

/**
 * Ring pulsing out from the cursor in the team's colour — confirmation that a
 * hit landed on the player rather than on empty sky.
 *
 * Appended to <body> and driven imperatively: it's throwaway, and routing it
 * through React state would re-render the cutout on every click. Portalling
 * matters for the same reason as the hover label — the stage's transform would
 * otherwise act as the containing block and scale it.
 */
function burstAt(x: number, y: number, color: string) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ring = document.createElement("div");
  Object.assign(ring.style, {
    position: "fixed",
    left: `${x}px`,
    top: `${y}px`,
    width: "18px",
    height: "18px",
    margin: "-9px 0 0 -9px",
    borderRadius: "9999px",
    border: `2px solid ${color}`,
    pointerEvents: "none",
    zIndex: "60",
  });
  document.body.appendChild(ring);

  ring
    .animate(
      [
        { scale: 0.4, opacity: 0.9 },
        { scale: 6, opacity: 0 },
      ],
      { duration: 600, easing: "cubic-bezier(0.2,0.8,0.3,1)" },
    )
    .finished.catch(() => {})
    .finally(() => ring.remove());
}

// The players are rectangular PNGs that are mostly transparent, so a CSS
// :hover fires anywhere in the box — over empty sky, metres from the player.
// Instead, hit-test the cutout's own alpha channel and only count real pixels.
const ALPHA_THRESHOLD = 16; // 0-255; skips the soft anti-aliased fringe
const SAMPLE_WIDTH = 800; // sources run to 4000px wide; coarse alpha is plenty
const CURSOR_GAP = 16; // px between the cursor and the label
const EDGE_MARGIN = 8;
// Click bounce: squash, overshoot, settle. These are multipliers applied to a
// nested element, not absolute scales — nested transforms compose, so the
// bounce and the hover never contend for the same `scale` property. Sharing one
// would let the hover-out transition stomp a bounce that's still mid-flight.
const BOUNCE_MS = 450;
const BOUNCE_SQUASH = 0.96;
const BOUNCE_OVERSHOOT = 1.05;

type AlphaMap = { data: Uint8ClampedArray; width: number; height: number };

// Keyed by source: Messi and the ball are two crops of one image, so without
// this they'd each decode and hold their own copy of the same alpha map.
const alphaMapCache = new Map<string, AlphaMap | null>();

// `document` doesn't exist when this client component is server-rendered, so
// the portal has to wait for the client. useSyncExternalStore rather than a
// setState-in-effect, which would cost an extra render pass.
const subscribeToNothing = () => () => {};
const onClient = () => true;
const onServer = () => false;

function readAlphaMap(image: HTMLImageElement): AlphaMap | null {
  const cached = alphaMapCache.get(image.currentSrc);
  if (cached !== undefined) return cached;

  const width = Math.min(image.naturalWidth, SAMPLE_WIDTH);
  const height = Math.round((image.naturalHeight / image.naturalWidth) * width);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(image, 0, 0, width, height);

  let map: AlphaMap | null;
  try {
    map = { data: ctx.getImageData(0, 0, width, height).data, width, height };
  } catch {
    map = null; // Tainted canvas — degrade to plain box hover.
  }
  alphaMapCache.set(image.currentSrc, map);
  return map;
}

export function AlphaHoverScale({
  className,
  innerClassName = "relative size-full",
  hoverScale,
  label,
  attackTarget,
  opensMatchPaper,
  children,
}: {
  className?: string;
  /** Classes for the bounce element, which sits between the container and the
   *  children — it must carry whatever layout role the container would have. */
  innerClassName?: string;
  hoverScale: number;
  /** Renders next to the cursor while a real pixel is hovered. */
  label?: string;
  /** Clicking this cutout lands a hit *on* this team — they lose ground. A
   *  plain string, not a callback, so a server component can pass it. */
  attackTarget?: Team;
  /** Opens the head-to-head paper when a real pixel is clicked. */
  opensMatchPaper?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const bounceTargetRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  // Mirrors `hovered` for the listeners, whose closures would otherwise read a
  // stale value — the press must respect the same alpha hit-test as the hover.
  const onPixelRef = useRef(false);
  const bounceRef = useRef<Animation | null>(null);
  const draggedRef = useRef(false);
  const [hovered, setHovered] = useState(false);
  const mounted = useSyncExternalStore(subscribeToNothing, onClient, onServer);

  useEffect(() => {
    const image = ref.current?.querySelector("img");
    if (!image) return;

    let alpha: AlphaMap | null = null;
    const buildAlphaMap = () => {
      alpha = readAlphaMap(image);
    };

    const moveLabel = (event: MouseEvent) => {
      const el = labelRef.current;
      if (!el) return;
      // Flip to the other side of the cursor rather than overflow the viewport.
      const x =
        event.clientX + CURSOR_GAP + el.offsetWidth > window.innerWidth - EDGE_MARGIN
          ? event.clientX - CURSOR_GAP - el.offsetWidth
          : event.clientX + CURSOR_GAP;
      const y =
        event.clientY + CURSOR_GAP + el.offsetHeight > window.innerHeight - EDGE_MARGIN
          ? event.clientY - CURSOR_GAP - el.offsetHeight
          : event.clientY + CURSOR_GAP;
      // Written straight to the DOM: this fires at mouse-move rate, and routing
      // it through state would re-render the whole cutout on every event.
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onMove = (event: MouseEvent) => {
      let onPixel = true;
      if (alpha) {
        // offsetX/Y are already in the image's own coordinate space, so the
        // stage scale and the players' rotation need no unwinding here.
        const x = Math.floor((event.offsetX / image.clientWidth) * alpha.width);
        const y = Math.floor((event.offsetY / image.clientHeight) * alpha.height);
        const inside = x >= 0 && y >= 0 && x < alpha.width && y < alpha.height;
        onPixel =
          inside && alpha.data[(y * alpha.width + x) * 4 + 3] > ALPHA_THRESHOLD;
      }

      // One tick per entry into the cutout, matching how the site's global
      // SoundEffects ticks once per entry into a button. mousemove fires
      // continuously, so this has to compare against the previous state.
      const entered = onPixel && !onPixelRef.current;
      const changed = onPixel !== onPixelRef.current;
      onPixelRef.current = onPixel;

      // Never toggle mid-drag: the pointer wanders off the silhouette as the
      // cutout moves, and disabling then would drop it on the spot.
      if (changed && !drag.isPressed) {
        if (onPixel) drag.enable();
        else drag.disable();
      }

      setHovered(onPixel);
      if (onPixel) moveLabel(event);
      if (entered) sound.hover();
    };

    const onLeave = () => {
      onPixelRef.current = false;
      if (!drag.isPressed) drag.disable();
      setHovered(false);
    };

    const onClick = (event: MouseEvent) => {
      const el = bounceTargetRef.current;
      // Only a real pixel counts — clicking empty sky is not a hit.
      if (!el || !onPixelRef.current) return;
      // A drag ends in a click event too; that shouldn't land a hit or bounce.
      if (draggedRef.current) return;

      // The photo is a <button>, so the global SoundEffects already ticks it on
      // hover and click. These cutouts are plain divs, so they'd be silent —
      // this gives all four the same two sounds.
      sound.click();

      if (attackTarget) {
        attack(attackTarget);
        // Tinted for the player taking the hit — the ring lands on their body.
        burstAt(event.clientX, event.clientY, TEAM_COLOR[attackTarget]);
      }
      if (opensMatchPaper) setPaperOpen(true);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      bounceRef.current?.cancel(); // restart cleanly on a rapid second click
      bounceRef.current = el.animate(
        [
          { scale: 1 },
          { scale: BOUNCE_SQUASH, offset: 0.3 },
          { scale: BOUNCE_OVERSHOOT, offset: 0.65 },
          { scale: 1 },
        ],
        { duration: BOUNCE_MS, easing: "ease-out" },
      );
    };

    // Dragged from the inner element: the outer one carries the hover `scale`,
    // which would multiply GSAP's translate. Presses on transparent pixels are
    // ignored, and a drag suppresses the click so a fling can't cast a vote.
    // Dragged from the inner element: the outer one carries the hover `scale`,
    // which would multiply GSAP's translate.
    //
    // Enabled only while a real pixel is under the cursor, which is what keeps
    // empty sky from being grabbable. Vetoing the press inside onPressInit does
    // not work — the press is already live by then. Disabling also drops GSAP's
    // cursor, so the pointer tracks the silhouette for free.
    const drag = createSpringDrag(bounceTargetRef.current!, {
      onDragStateChange: (dragged) => {
        draggedRef.current = dragged;
      },
    });
    drag.disable();

    // Not `once`: the players swap sprite as they take damage, and React keeps
    // the same <img> element and just changes its src. Each new source fires
    // `load` again and needs its own alpha map — the silhouettes differ.
    if (image.complete && image.naturalWidth) buildAlphaMap();
    image.addEventListener("load", buildAlphaMap);

    image.addEventListener("mousemove", onMove);
    image.addEventListener("mouseleave", onLeave);
    image.addEventListener("click", onClick);
    return () => {
      image.removeEventListener("load", buildAlphaMap);
      image.removeEventListener("mousemove", onMove);
      image.removeEventListener("mouseleave", onLeave);
      image.removeEventListener("click", onClick);
      drag?.kill();
      bounceRef.current?.cancel();
    };
  }, [attackTarget, opensMatchPaper]);

  return (
    <>
      {/* Inline scale beats the base `scale-[...]` utility in the className,
          and reverting to undefined lets the class value transition back. The
          pointer cursor is set here too, so it tracks the cutout rather than
          appearing over the whole (mostly empty) box. */}
      <div
        ref={ref}
        className={className}
        style={hovered ? { scale: hoverScale, cursor: "pointer" } : undefined}
      >
        <div ref={bounceTargetRef} className={innerClassName}>
          {children}
        </div>
      </div>

      {/* Portalled to <body>: the stage's transform would otherwise act as the
          containing block for `fixed`, scaling and displacing the label. */}
      {mounted &&
        label &&
        createPortal(
          <div
            ref={labelRef}
            aria-hidden
            className={`pointer-events-none fixed left-0 top-0 z-50 rounded-[8px] bg-ink px-[12px] py-[6px] text-[14px] font-medium leading-[20px] tracking-[-0.32px] text-white shadow-[0px_8px_32px_0px_rgba(0,0,0,0.35)] transition-opacity duration-150 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {label}
          </div>,
          document.body,
        )}
    </>
  );
}
