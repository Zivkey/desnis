"use client";

import { useEffect } from "react";
import { sound } from "@/lib/sound";

// Click fires on any interactive control; hover fires only on real buttons (not
// links or cards), excluding the segmented controls which play their own hover.
const CLICK_SELECTOR = 'button, a[href], [role="button"]';
// Real buttons + button-styled CTAs/links explicitly opted in via `sfx-hover`
// (flow-hover buttons and the WhatsApp buttons) — not plain links or cards.
const HOVER_SELECTOR = 'button, [role="button"], .sfx-hover';

const isDisabled = (el: HTMLElement) =>
  (el as HTMLButtonElement).disabled || el.getAttribute("aria-disabled") === "true";

// Plays a subtle click on any interactive control (directional pop for the
// carousel prev/next arrows) and a soft tick when hovering a button. Uses
// `click` (not pointerdown) so dragging never triggers a sound. Mounted once.
export function SoundEffects() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(CLICK_SELECTOR);
      if (!el || isDisabled(el)) return;

      const label = (el.getAttribute("aria-label") || "").toLowerCase();
      if (label.includes("previous") || label.includes("prev")) sound.prev();
      else if (label.includes("next")) sound.next();
      else sound.click();
    };

    // One tick per entry into a button. Skip touch (no real hover) and the
    // segmented controls, which play their own hover as the border slides.
    let lastHover: Element | null = null;
    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(HOVER_SELECTOR) ?? null;
      if (el === lastHover) return;
      lastHover = el;
      if (!el || isDisabled(el) || el.hasAttribute("aria-pressed")) return;
      sound.hover();
    };

    document.addEventListener("click", onClick);
    document.addEventListener("pointerover", onOver);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onOver);
    };
  }, []);

  return null;
}
