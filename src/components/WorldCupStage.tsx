"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from "@/lib/worldCupPhoto";

// The Figma frame is a fixed 1440x900 poster with everything absolutely
// positioned, so there is no responsive design to follow. The stage is scaled
// as a whole to stay pixel-exact instead of reflowing.
//
// The scale is "cover" (max): the frame always fills the viewport with no empty
// edges, and whatever falls outside is cropped. That also means the backdrop
// inside the frame — 1634x912 against a 1440x900 frame — is always bigger than
// the viewport, so the design's own bleed does the work and needs no help.
export const FRAME_WIDTH = 1440;
export const FRAME_HEIGHT = 900;

// Primes --wc-scale during HTML parse, before first paint. Without this the
// server-rendered markup paints at scale 1 and visibly jumps when the effect
// below runs. Kept in sync with `fit()`.
export const PRIME_SCALE_SCRIPT = `(function(){var e=document.documentElement;e.style.setProperty("--wc-scale",String(Math.max(e.clientWidth/${FRAME_WIDTH},e.clientHeight/${FRAME_HEIGHT})))})()`;

export function WorldCupStage({ children }: { children: React.ReactNode }) {
  const photoExpanded = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    // clientWidth/Height, not innerWidth/Height: the latter counts the
    // scrollbar gutter that this page's `fixed` container doesn't cover.
    const el = document.documentElement;
    const fit = () =>
      el.style.setProperty(
        "--wc-scale",
        String(
          Math.max(el.clientWidth / FRAME_WIDTH, el.clientHeight / FRAME_HEIGHT),
        ),
      );

    fit();
    window.addEventListener("resize", fit);
    return () => {
      window.removeEventListener("resize", fit);
      el.style.removeProperty("--wc-scale");
    };
  }, []);

  return (
    <div
      data-world-cup-stage
      className="fixed inset-0 overflow-hidden bg-[#dfe2e9]"
    >
      {/* The `group` + data attribute let the players and ball fade themselves
          out via CSS when the photo expands — the design's expanded frame drops
          them — without every one of them subscribing to the store. */}
      {/* Centred with absolute + translate, not grid/flex centring: the frame
          is deliberately larger than the viewport under "cover", and both grid
          and flex fall back to start-alignment once an item overflows. That
          top-aligned the frame and cropped the whole overflow off the bottom.
          `translate` and `transform` are separate properties, so the -50/-50
          shift and the scale compose rather than overwrite each other. */}
      <div
        className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        data-photo-expanded={photoExpanded ? "true" : undefined}
        style={{
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
          transform: "scale(var(--wc-scale, 1))",
        }}
      >
        {children}
      </div>
    </div>
  );
}
