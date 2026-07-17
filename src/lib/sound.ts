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
    master.gain.value = 0.35; // overall UI sound volume — kept gentle
    master.connect(ctx.destination);
  }
  // AudioContext starts suspended until a user gesture — resume on first play.
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

// White noise, generated once per context and reused. A tone can't sound
// mechanical — a typebar hitting paper is broadband noise, not a pitch.
let noise: AudioBuffer | null = null;

function noiseBuffer(c: AudioContext) {
  if (!noise) {
    const frames = Math.floor(c.sampleRate * 0.2);
    noise = c.createBuffer(1, frames, c.sampleRate);
    const channel = noise.getChannelData(0);
    for (let i = 0; i < frames; i += 1) channel[i] = Math.random() * 2 - 1;
  }
  return noise;
}

type Clack = { freq: number; q?: number; gain?: number; dur?: number };

/** Short band-passed noise burst — the percussive "clack" of a key strike. */
function clack({ freq, q = 1, gain = 0.05, dur = 0.03 }: Clack) {
  const c = engine();
  if (!c || !master) return;
  const t = c.currentTime;

  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);

  const band = c.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = freq;
  band.Q.value = q;

  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.001); // near-instant attack
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  src.connect(band).connect(g).connect(master);
  src.onended = () => g.disconnect();
  src.start(t);
  src.stop(t + dur + 0.02);
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
  /** Short upward "lift" for picking up a draggable card. */
  grab: () => pop({ from: 300, to: 440, gain: 0.06, dur: 0.045 }),
  /** Soft downward "set down" for releasing a draggable card. */
  release: () => pop({ from: 320, to: 150, gain: 0.07, dur: 0.07 }),
  /** Typewriter key striking paper. Two layers: a bright noise clack for the
   *  typebar, and a low thump for the key bottoming out — a tone alone just
   *  sounds like a UI blip. Both wobble per stroke, since identical hits read
   *  as a machine rather than a hand. Kept short: dozens fire in a row and
   *  anything longer smears into a drone. */
  keystroke: () => {
    clack({
      freq: 1500 + Math.random() * 1400,
      q: 0.8,
      gain: 0.05 + Math.random() * 0.025,
      dur: 0.022 + Math.random() * 0.012,
    });
    pop({ from: 170, to: 80, gain: 0.022, dur: 0.03 });
  },
};
