// The /world-cup scrap: click a player to beat *them* up. Whoever you click
// more loses ground, so the bar swings to their opponent. Land WIN_AT more hits
// on one player than the other and their opponent wins outright and takes the
// FAN FAVORITE badge.
//
// Persisted to localStorage so a refresh — or a new session — keeps the fight
// where it was left. Per-browser, not shared between visitors.
//
// Stored as a single net score rather than two counters: the bar, the winner
// and the reset are all functions of the *difference*, and keeping one number
// makes it impossible for the two to drift out of sync.

export type Team = "spain" | "argentina";

/** Bar colours from the design — reused to tint the hit feedback. */
export const TEAM_COLOR: Record<Team, string> = {
  spain: "#cd0e2f",
  argentina: "#87accf",
};

/** Net hits ahead needed to win. Also the range of the bar either side of 50. */
export const WIN_AT = 15;

const STORAGE_KEY = "desnis:world-cup-fight";
const DEFAULT_SNAPSHOT = "0";

const listeners = new Set<() => void>();

export function subscribe(listener: () => void) {
  listeners.add(listener);
  // `storage` only fires in *other* tabs, which is exactly what it's for here —
  // same-tab updates are announced through `listeners`.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

// Returns the raw string: useSyncExternalStore compares snapshots with
// Object.is, so this has to be a primitive, not a fresh object each call.
export function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_SNAPSHOT;
  } catch {
    return DEFAULT_SNAPSHOT; // Storage blocked (private mode, cookies off).
  }
}

export function getServerSnapshot() {
  return DEFAULT_SNAPSHOT;
}

/** Positive = Spain ahead. Clamped, so a hand-edited value can't break the bar. */
export function parseNet(snapshot: string): number {
  const net = Number(snapshot);
  if (!Number.isFinite(net)) return 0;
  return Math.max(-WIN_AT, Math.min(WIN_AT, Math.trunc(net)));
}

export function winnerOf(net: number): Team | null {
  if (net >= WIN_AT) return "spain";
  if (net <= -WIN_AT) return "argentina";
  return null;
}

/** Spain's share of the bar, 0-100. Starts dead even and moves with the fight. */
export function spainShareOf(net: number) {
  return Math.round(50 + (net / WIN_AT) * 50);
}

/**
 * How beaten up `team` is: 0 untouched, 1 knocked out. Drives which artwork a
 * player wears. Reads only the side of the score that went against `team` —
 * hits they land on the other player don't heal them.
 */
export function damageOf(net: number, team: Team) {
  const hitsTaken = team === "spain" ? Math.max(0, -net) : Math.max(0, net);
  return hitsTaken / WIN_AT;
}

function write(net: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(net));
  } catch {
    return; // Nothing persisted, so don't announce a change that didn't happen.
  }
  listeners.forEach((listener) => listener());
}

/** Land a hit *on* `team` — they lose ground. No-op once the fight is settled. */
export function attack(team: Team) {
  const net = parseNet(getSnapshot());
  if (winnerOf(net)) return;
  // net is Spain-positive, so hitting Spain drags it down and vice versa.
  write(parseNet(String(team === "spain" ? net - 1 : net + 1)));
}

export function resetFight() {
  write(0);
}
