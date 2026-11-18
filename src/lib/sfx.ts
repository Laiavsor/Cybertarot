/* WebAudio SFX — синтезатор без единого аудиофайла */
let ctx: AudioContext | null = null;
let enabled = true;

export const setSfxEnabled = (v: boolean) => { enabled = v; };

const ac = (): AudioContext | null => {
  if (!enabled) return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
};

const env = (g: GainNode, t0: number, peak: number, attack: number, decay: number) => {
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
};

const tone = (freq: number, type: OscillatorType, peak: number, attack: number, decay: number, when = 0, slideTo?: number) => {
  const c = ac(); if (!c) return;
  const t0 = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + attack + decay);
  env(g, t0, peak, attack, decay);
  o.connect(g).connect(c.destination);
  o.start(t0); o.stop(t0 + attack + decay + 0.05);
};

const noise = (peak: number, decay: number, when = 0, lowpass = 1800) => {
  const c = ac(); if (!c) return;
  const t0 = c.currentTime + when;
  const len = Math.floor(c.sampleRate * decay);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const filt = c.createBiquadFilter();
  filt.type = 'lowpass'; filt.frequency.value = lowpass;
  const g = c.createGain();
  env(g, t0, peak, 0.005, decay);
  src.connect(filt).connect(g).connect(c.destination);
  src.start(t0);
};

export const sfx = {
  boot() {
    tone(55, 'sine', 0.22, 0.02, 1.6, 0, 110);
    tone(220, 'square', 0.05, 0.01, 0.4, 0.15);
    tone(440, 'square', 0.05, 0.01, 0.3, 0.45);
    tone(880, 'square', 0.07, 0.01, 0.5, 0.75);
  },
  blip() { tone(1200, 'square', 0.05, 0.005, 0.06); },
  hover() { tone(1600, 'sine', 0.02, 0.004, 0.05); },
  deal() { noise(0.28, 0.24, 0, 2400); tone(320, 'triangle', 0.12, 0.01, 0.18, 0.02, 90); },
  flip() { tone(700, 'square', 0.06, 0.004, 0.05); noise(0.12, 0.1, 0.02, 3200); tone(980, 'square', 0.05, 0.004, 0.07, 0.07); },
  glitch() {
    tone(180, 'sawtooth', 0.1, 0.002, 0.05, 0, 60);
    tone(1500, 'square', 0.04, 0.002, 0.03, 0.06);
    noise(0.1, 0.06, 0.03, 4000);
  },
  reveal() {
    tone(660, 'sine', 0.09, 0.01, 0.5);
    tone(990, 'sine', 0.07, 0.01, 0.6, 0.09);
  },
  save() { tone(523, 'triangle', 0.1, 0.01, 0.16); tone(784, 'triangle', 0.1, 0.01, 0.22, 0.12); tone(1046, 'triangle', 0.1, 0.01, 0.3, 0.24); },
  denied() { tone(160, 'sawtooth', 0.1, 0.005, 0.2, 0, 110); },
};
