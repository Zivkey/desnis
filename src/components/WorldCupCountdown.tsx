"use client";

import { useEffect, useState } from "react";

// Kickoff of the 2026 World Cup final: Sunday 19 July 2026, 3:00pm ET at
// MetLife Stadium. July is EDT (UTC-4), so 15:00 ET is 19:00 UTC. Pinned as a
// fixed instant so the countdown reads the same wherever the visitor is.
const KICKOFF_MS = Date.UTC(2026, 6, 19, 19, 0, 0);

function formatRemaining(remainingMs: number) {
  const seconds = Math.floor(Math.max(0, remainingMs) / 1_000);
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);
  // Seconds are padded: unpadded they'd change width every tick from 9s to 10s
  // and shake the centred line. Days/hours/minutes tick too slowly to matter.
  const paddedSeconds = String(seconds % 60).padStart(2, "0");
  return `${days}d : ${hours}h : ${minutes}m : ${paddedSeconds}s`;
}

export function WorldCupCountdown({ className }: { className?: string }) {
  // Starts null on both server and client so the first render matches and
  // hydration stays clean; the real value lands on mount. Rendering a
  // server-computed time instead would ship a stale one on a prerendered page.
  const [remaining, setRemaining] = useState<string | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    // Re-scheduled onto each whole second rather than setInterval(1000), which
    // drifts and eventually swallows a tick — very visible once seconds show.
    const tick = () => {
      const now = Date.now();
      setRemaining(formatRemaining(KICKOFF_MS - now));
      timeout = setTimeout(tick, 1_000 - (now % 1_000));
    };

    tick();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <p className={className}>
      {/* Non-breaking space holds the slot for the frame before mount. */}
      {remaining ?? " "}
    </p>
  );
}
