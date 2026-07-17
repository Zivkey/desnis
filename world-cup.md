# /world-cup

A single full-bleed poster for the 2026 World Cup final (Spain v Argentina,
19 July 2026). Built 1:1 from Figma `Zafrkavanje`, then hand-tuned in review —
see [Drift from Figma](#drift-from-figma).

Four objects are interactive: **Yamal**, **Messi**, **the ball**, and **the
photo**. All four hover, click, and can be dragged.

---

## Files

| File | Role |
| --- | --- |
| `src/app/world-cup/page.tsx` | The frame. Server component; holds the design's markup and absolute geometry. |
| `components/WorldCupStage.tsx` | Scales the fixed 1440×900 frame to the viewport. |
| `components/AlphaHoverScale.tsx` | The three cutouts: alpha hover, label, bounce, vote, drag. |
| `components/WorldCupPhoto.tsx` | The photo and its expanded state. |
| `components/WorldCupPaper.tsx` | The head-to-head paper (opened by the ball). |
| `components/WorldCupVoteBar.tsx` | The Spain/Argentina tally. |
| `components/WorldCupCountdown.tsx` | Live countdown to kick-off. |
| `components/writeOn.tsx` | Shared typewriter: per-character reveal + keystroke sound. |
| `lib/worldCupVotes.ts` | Vote tally, persisted to localStorage. |
| `lib/worldCupPhoto.ts`, `lib/worldCupPaper.ts` | Open/expanded state (see `lib/toggleStore.ts`). |
| `lib/springDrag.ts` | Drag with spring-back, shared with the homepage ClubCard's behaviour. |

Assets live in `public/assets/world-cup/`, mapped in `lib/assets.ts`. They are
Figma's originals, unoptimised and full-size, by request — the stadium is a 16MB
PNG. `next/image` is used with `unoptimized`, so they ship as-is.

## Figma nodes

| Node | State |
| --- | --- |
| `2224:127` | Base frame |
| `2224:154` | Photo expanded ("It all started here.") |
| `2232:139` | Head-to-head paper |

---

## The layering model

The frame is a fixed 1440×900 poster with everything absolutely positioned. It
is **scaled to cover** the viewport, so it is always *larger* than the screen and
the overflow is cropped.

Three consequences drive most of the structure:

1. **The frame is centred with `absolute` + `translate`, not grid/flex
   centring.** Both grid and flex silently fall back to start-alignment when an
   item overflows its container — which, under cover scaling, is always. That
   top-aligned the frame and threw the entire crop off the bottom.

2. **The header and vote bar are pinned to the viewport**, not inside the frame.
   They sit within 24px/31px of the frame's edges, which cover scaling crops
   away on any viewport shorter than 5:3.

3. **The paper renders last, on its own scaled layer.** It has to cover the
   header and vote bar, and those are sibling fixed layers painted *after* the
   stage — so nothing nested inside the stage can rise above them, whatever
   z-index it's given. It re-uses `--wc-scale` to keep the frame's coordinates.

`--wc-scale` is primed by an inline script before first paint (otherwise the
server-rendered markup paints at scale 1 and visibly jumps) and updated on
resize. `<html>` carries `suppressHydrationWarning` because of it.

## Alpha hit-testing

The players are rectangular PNGs that are **mostly transparent** — 62% of
Yamal's box is empty, 82% of Messi's. A CSS `:hover` fires anywhere in that box,
metres from the player.

`AlphaHoverScale` draws each cutout into an offscreen canvas and samples its
alpha under the cursor, so hover, click, vote, cursor, sound, and drag all
respect the silhouette. Notes:

- Threshold is `16/255`, not zero — the cutouts have a soft anti-aliased fringe.
- Sampled at 800px wide, not the native 4000 — coarse alpha is plenty and keeps
  the canvas ~1.4MB instead of ~36MB.
- Keyed by source in a cache: Messi and the ball are two crops of *one* image.
- `offsetX/offsetY` arrive already in the image's local space, so the stage scale
  and the players' rotation need no unwinding.
- The photo is opaque, so its hover is honestly box-shaped. It goes through a
  different path (a real `<button>`).

## Gotchas worth keeping

Each of these cost a debugging round; they'll bite again if the code is moved.

- **`box-shadow` vs `drop-shadow`.** Figma's shadow follows an image's alpha;
  CSS `box-shadow` always paints the element's *rectangle*. On the torn paper it
  rendered as a pale rectangular halo; on Messi it would be a dark box. Cutouts
  use `drop-shadow`.
- **`backdrop-filter` and `opacity`.** Any ancestor below `opacity: 1` becomes a
  backdrop root, leaving a descendant's `backdrop-blur` nothing to blur — so the
  blur vanishes for the whole fade and snaps in at the end. The vote bar fades
  each child individually, never the wrapper.
- **Tailwind v4 puts `scale`/`translate`/`rotate` on their own properties**, not
  in `transform`. They compose, and CSS applies them *after* `transform`. Hence
  `transition-[scale]`, and hence `springDrag` must attach to an element with no
  transform of its own — inside a scaled element GSAP's drag comes out
  multiplied; inside a rotated one, skewed.
- **Two `transition-*` utilities on one element fight** over
  `transition-property`; whichever lands later in the CSS wins. Use one
  (`transition-[scale,opacity]`).
- **`next/image` with `fill` rejects an explicit `style.width`** — the expanded
  photo needs percentage sizing, so it uses intrinsic dimensions.
- **A full-frame `absolute inset-0` wrapper is a sheet of glass.** The photo's
  group spans the whole frame and paints last; without `pointer-events-none` it
  swallows every other object's hover.
- **The bounce lives on a nested element.** Sharing `scale` with the hover let
  the hover-out transition stomp a bounce mid-flight.

## Behaviour

**Voting.** Clicking a player casts a vote, bursts a ring in the team's colour,
bounces the player, and swells the winning bar. The tally is **per-browser**
(`localStorage`) — it survives refreshes and sessions, but is not shared between
visitors; that would need a backend. Seeded at 20/20 so a fresh browser opens at
50:50 and one vote moves the bar ~1%; from an empty tally the first click would
swing it to 100% and collapse the other side. The bar pulse keys off vote
*counts*, not widths — at 50/50 both bars move, but only one gained anything.

**The photo.** Click morphs it to Figma's expanded frame (`2224:154`); the
players and vote bar fade out, as the design omits them. Click anywhere or press
Escape to close. Copy types on once the card settles.

**The paper.** Click the ball. The sheet is laid down with an overshoot, then 14
results type on as one continuous pass. Click anywhere or Escape to close.

**Typewriter** (`writeOn.tsx`). Characters are grouped into `inline-block` words
— loose per-character spans each become a line-break opportunity and shred the
wrapping. The animated copy is `aria-hidden` with an `sr-only` twin, or a screen
reader reads it letter by letter. Keystroke sound is paced on its own ~70ms
clock, not per character: the body types at 6ms/char, and 166 ticks a second is a
drone, not a typewriter.

**Sound.** All four objects share the site's `sound.hover()` / `sound.click()`.
The photo gets them free from the global `SoundEffects` (it's a `<button>`); the
cutouts fire their own, gated on alpha. Dragging adds `grab`/`release`. The
keystroke is a noise clack layered with a low thump — a tone alone reads as a UI
blip, not a key striking paper.

**Reduced motion** is respected throughout: bounce, burst, typing, keystrokes,
and the paper's settle are all skipped.

## Drift from Figma

Deliberate, from review. Anyone re-exporting the frame should expect these:

| Element | Figma | Now |
| --- | --- | --- |
| Yamal | `left: 24, top: 141`, scale 1 | `left: 72, top: 107`, scale `0.8075` |
| Messi | `left: 50%+95, top: 216`, scale 1 | `left: 50%+36, top: 136`, scale `0.765` |
| Ball | scale 1 | scale `0.68`, 16px up |
| Photo | `top: 458`, scale 1 | `top: 458`, scale `0.85` |
| Headline | 64/72px, `top: 129` | 52/58px, `top: 161` |
| Paper | scale 1 | scale `0.8` |
| Countdown | static `2d : 6h : 30m` | live, with seconds |

The 14 results are in Figma's order, which is **not chronological** (1952, 1960,
1953, 1966…). Kept as designed.

## Open

- Votes are per-browser; a shared tally needs a backend.
- Assets are unoptimised originals (~39MB) by request.
- Flag emoji in the hover labels render as "ES"/"AR" on Windows. SVG flags would
  fix it.
- The headline is 559px wide inside a 532px column — it centres by overflow, so
  `min-w-full` on the `<h1>` does nothing.
