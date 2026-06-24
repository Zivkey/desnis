// Tiny Web Audio "pop" synth for subtle UI feedback. No assets — each sound is
// a short sine chirp with a fast envelope, in the spirit of @web-kits/audio.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function engine() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
  }
  // AudioContext starts suspended until a user gesture — resume on first play.
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type Pop = { from: number; to: number; gain?: number; dur?: number };

function pop({ from, to, gain = 0.09, dur = 0.05 }: Pop) {
  const c = engine();
  if (!c || !master) return;
  const t = c.currentTime;

  const osc = c.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + dur);

  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.004); // fast attack
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur); // soft decay

  osc.connect(g).connect(master);
  osc.onended = () => g.disconnect();
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sound = {
  /** Generic soft click for buttons and links. */
  click: () => pop({ from: 420, to: 150 }),
  /** Lower-pitched pop for "previous" / left. */
  prev: () => pop({ from: 360, to: 140, dur: 0.06 }),
  /** Higher-pitched pop for "next" / right. */
  next: () => pop({ from: 540, to: 220, dur: 0.06 }),
  /** Very soft, quick tick for hovering a non-selected segmented-control option. */
  hover: () => pop({ from: 720, to: 540, gain: 0.04, dur: 0.035 }),
};
