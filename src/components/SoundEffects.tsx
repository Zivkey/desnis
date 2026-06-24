"use client";

import { useEffect } from "react";
import { sound } from "@/lib/sound";

// Plays a subtle click on any interactive control, with a directional pop for
// the carousel prev/next arrows. Uses `click` (not pointerdown) so dragging a
// card or the carousel never triggers a sound. Mounted once, app-wide.
export function SoundEffects() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>('button, a[href], [role="button"]');
      if (!el || el.getAttribute("aria-disabled") === "true" || (el as HTMLButtonElement).disabled) {
        return;
      }

      const label = (el.getAttribute("aria-label") || "").toLowerCase();
      if (label.includes("previous") || label.includes("prev")) sound.prev();
      else if (label.includes("next")) sound.next();
      else sound.click();
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
