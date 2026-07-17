import { sound } from "@/lib/sound";

export type Segment = { text: string; className?: string };

// Keystrokes are paced on their own clock rather than fired per character: the
// copy types far faster than a hand could, and a tick per character is a drone,
// not a typewriter. ~70ms lands around a brisk 14 strokes a second, jittered so
// it doesn't sound mechanical.
const KEYSTROKE_MS = 70;
const KEYSTROKE_JITTER_MS = 24;

/**
 * Splits text into per-character spans, each delayed by its position so the
 * copy writes on. Characters are grouped into inline-block words: left loose,
 * every character would become its own line-break opportunity and text would
 * wrap mid-word.
 *
 * Pair with `scheduleKeystrokes` for the sound, and an `sr-only` copy of the
 * text — a screen reader would otherwise read this letter by letter.
 */
export function writeOn(
  segments: Segment[],
  startMs: number,
  msPerChar: number,
  keyPrefix = "",
) {
  let index = 0;

  return segments.map((segment, s) => (
    <span key={`${keyPrefix}${s}`} className={segment.className}>
      {segment.text
        .split(/(\s+)/)
        .filter(Boolean)
        .map((token, t) => {
          if (/^\s+$/.test(token)) {
            index += token.length;
            return token; // A real space — keeps the line breakable.
          }
          return (
            <span key={t} className="inline-block whitespace-pre">
              {[...token].map((char, c) => {
                const delay = startMs + index * msPerChar;
                index += 1;
                return (
                  <span
                    key={c}
                    className="wc-write-in"
                    style={{ animationDelay: `${delay}ms` }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          );
        })}
    </span>
  ));
}

/** Ticks along with text writing on. Returns timer ids for cleanup. */
export function scheduleKeystrokes(startMs: number, endMs: number) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return [];

  const timers: number[] = [];
  for (let at = startMs; at < endMs; ) {
    timers.push(window.setTimeout(() => sound.keystroke(), at));
    at += KEYSTROKE_MS + Math.random() * KEYSTROKE_JITTER_MS;
  }
  return timers;
}
