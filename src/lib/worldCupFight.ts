// The /world-cup scrap: click a player to beat *them* up. Whoever you click
// more loses ground, so the bar swings to their opponent. Land WIN_AT more hits
// on one player than the other and their opponent wins outright and takes the
// FAN FAVORITE badge.
//
// Persisted to localStorage so a refresh — or a new session — keeps the fight
// where it was left. Per-browser, not shared between visitors.
//
// Stored as hits *taken* per player rather than a single net score. The bar and
// the winner only care about the difference, but damage must not un-happen:
// derived from net, hitting one player would heal the other back to an earlier
// sprite. Hits only ever go up, so damage only ever goes up.

export type Team = "spain" | "argentina";

/** Bar colours from the design — reused to tint the hit feedback. */
export const TEAM_COLOR: Record<Team, string> = {
  spain: "#cd0e2f",
  argentina: "#87accf",
};

/** Net hits ahead needed to win. Also the range of the bar either side of 50. */
export const WIN_AT = 15;

const STORAGE_KEY = "desnis:world-cup-fight";
const DEFAULT_SNAPSHOT = '{"spain":0,"argentina":0}';

export type Fight = {
  /** Hits taken by each player. Monotonic within a round. */
  hits: Record<Team, number>;
  /** Positive = Spain ahead. Clamped to +-WIN_AT. */
  net: number;
};

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

export function parseFight(snapshot: string): Fight {
  let spain = 0;
  let argentina = 0;
  try {
    const parsed = JSON.parse(snapshot);
    const read = (v: unknown) =>
      typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.floor(v)) : 0;
    spain = read(parsed?.spain);
    argentina = read(parsed?.argentina);
  } catch {
    // Corrupt, hand-edited, or the old single-number format — start fresh.
  }
  const net = Math.max(-WIN_AT, Math.min(WIN_AT, argentina - spain));
  return { hits: { spain, argentina }, net };
}

export function winnerOf(fight: Fight): Team | null {
  if (fight.net >= WIN_AT) return "spain";
  if (fight.net <= -WIN_AT) return "argentina";
  return null;
}

/** Spain's share of the bar, 0-100. Starts dead even and moves with the fight. */
export function spainShareOf(fight: Fight) {
  return Math.round(50 + (fight.net / WIN_AT) * 50);
}

/**
 * How beaten up `team` is: 0 untouched, 1 knocked out. Drives which sprite a
 * player wears. Reads hits taken, so it never walks backwards — once a player
 * picks up bandages they keep them for the round.
 */
export function damageOf(fight: Fight, team: Team) {
  return Math.min(1, fight.hits[team] / WIN_AT);
}

function write(fight: Fight["hits"]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fight));
  } catch {
    return; // Nothing persisted, so don't announce a change that didn't happen.
  }
  listeners.forEach((listener) => listener());
}

/** Land a hit *on* `team` — they lose ground. No-op once the fight is settled. */
export function attack(team: Team) {
  const fight = parseFight(getSnapshot());
  if (winnerOf(fight)) return;
  write({ ...fight.hits, [team]: fight.hits[team] + 1 });
}

export function resetFight() {
  write({ spain: 0, argentina: 0 });
}
