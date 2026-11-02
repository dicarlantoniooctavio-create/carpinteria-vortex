// Música original para el reel (estilo anuncio: marimba, piano eléctrico, palmas, bajo).
// Síntesis determinista (semilla fija). Grilla de 150 BPM anclada para que el "drop"
// caiga en el estallido del logo (4,98 s) y los cortes de escena caigan en tiempo.
// Uso: node tools/music_vortex.mjs  → assets/audio/music_vortex.wav
import fs from "node:fs";

const SR = 48000, DUR = 15.0, N = Math.round(SR * DUR);
const TAU = Math.PI * 2;
const B = 0.4, A0 = 0.18; // negra = 0,4 s; tiempo 0 en 0,18 s → tiempo 12 = 4,98 s
const tb = (n) => A0 + B * n;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

let seed = 20261016;
const noise = () => ((seed = (Math.imul(seed, 1103515245) + 12345) >>> 0) / 4294967296) * 2 - 1;

const bus = () => ({ L: new Float32Array(N), R: new Float32Array(N) });
const drums = bus(), duck = bus(), bass = bus(), send = bus();

function add(target, t0, len, fn, gain, pan = 0, sendAmt = 0) {
  if (t0 < 0) { len += t0; t0 = 0; }
  const s0 = Math.round(t0 * SR);
  const n = Math.min(N - s0, Math.round(len * SR));
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4) * Math.SQRT2;
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4) * Math.SQRT2;
  for (let i = 0; i < n; i++) {
    const v = fn(i / SR);
    const k = s0 + i;
    target.L[k] += v * gl; target.R[k] += v * gr;
    if (sendAmt) { send.L[k] += v * gl * sendAmt; send.R[k] += v * gr * sendAmt; }
  }
}

function biquad(type, f0, Q) {
  let b0, b1, b2, a1, a2, x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  const set = (f) => {
    const w = (TAU * f) / SR, c = Math.cos(w), a = Math.sin(w) / (2 * Q), a0 = 1 + a;
    if (type === "lp") { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; }
    else if (type === "hp") { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; }
    else { b0 = a; b1 = 0; b2 = -a; }
    b0 /= a0; b1 /= a0; b2 /= a0; a1 = (-2 * c) / a0; a2 = (1 - a) / a0;
  };
  set(f0);
  const f = (x) => { const y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = x; y2 = y1; y1 = y; return y; };
  f.set = set;
  return f;
}

// ---------- instrumentos ----------
const marimba = (m, vel, pan = 0.25) => (t0) => {
  const f = mtof(m);
  add(duck, t0, 1.1, (t) => Math.min(1, t / 0.002) * (Math.sin(TAU * f * t) * Math.exp(-t / 0.3) + 0.32 * Math.sin(TAU * 3.98 * f * t) * Math.exp(-t / 0.05) + 0.07 * Math.sin(TAU * 9.9 * f * t) * Math.exp(-t / 0.018)), 0.2 * vel, pan, 0.25);
};
const epiano = (notes, t0, len, vel) => {
  notes.forEach((m, j) => [-1, 1].forEach((side) => {
    const f = mtof(m) * Math.pow(2, (side * 4) / 1200);
    add(duck, t0, len + 0.5, (t) => {
      const env = Math.min(1, t / 0.004) * Math.exp(-t / 1.0) * (t < len ? 1 : Math.exp(-(t - len) / 0.08));
      const I = 1.6 * Math.exp(-t / 0.22) + 0.25;
      return env * (Math.sin(TAU * f * t + I * Math.sin(TAU * f * t)) + 0.12 * Math.sin(TAU * 14 * f * t) * Math.exp(-t / 0.025));
    }, (0.07 * vel) / Math.sqrt(notes.length), side * 0.35 + (j - 1) * 0.08, 0.3);
  }));
};
const bassNote = (m, t0, len, vel) => {
  const f = mtof(m);
  add(bass, t0, len + 0.05, (t) => {
    const env = Math.min(1, t / 0.003) * Math.exp(-t / 0.4) * (t < len ? 1 : Math.exp(-(t - len) / 0.025));
    const x = Math.sin(TAU * f * t) + 0.45 * Math.sin(2 * TAU * f * t) + 0.18 * Math.sin(3 * TAU * f * t);
    return (env * Math.tanh(1.5 * x)) / 1.1;
  }, 0.26 * vel, 0, 0);
};
const pad = (notes, t0, len, vel) => {
  notes.forEach((m, j) => [-7, 0, 7].forEach((ct, v) => {
    const f = mtof(m) * Math.pow(2, ct / 1200);
    add(duck, t0, len + 0.7, (t) => {
      const env = Math.min(1, t / 0.45) * (t < len ? 1 : Math.exp(-(t - len) / 0.25));
      let s = 0;
      for (let k = 1; k <= 9; k++) s += Math.sin(TAU * k * f * t + k * v) / Math.pow(k, 1.45);
      return env * s;
    }, (0.022 * vel) / notes.length, (v - 1) * 0.55, 0.5);
  }));
};
const glock = (m, t0, vel) => {
  const f = mtof(m);
  add(duck, t0, 1.6, (t) => Math.min(1, t / 0.001) * (Math.sin(TAU * f * t) * Math.exp(-t / 0.7) + 0.22 * Math.sin(TAU * 2.76 * f * t) * Math.exp(-t / 0.14) + 0.08 * Math.sin(TAU * 5.4 * f * t) * Math.exp(-t / 0.05)), 0.1 * vel, -0.3, 0.45);
};
const kicks = [];
const kick = (t0, vel) => {
  kicks.push(t0);
  let ph = 0;
  add(drums, t0, 0.6, (t) => {
    ph += (TAU * (46 + 115 * Math.exp(-t / 0.032))) / SR;
    return Math.sin(ph) * Math.exp(-t / 0.3) + 0.25 * noise() * Math.exp(-t / 0.0025);
  }, 0.44 * vel, 0, 0);
};
const clap = (t0, vel) => {
  const bp = biquad("bp", 1450, 0.8), hp = biquad("hp", 600, 0.7);
  add(drums, t0, 0.5, (t) => {
    const e = Math.exp(-t / 0.004) + Math.exp(-Math.max(0, t - 0.009) / 0.004) * (t > 0.009) + Math.exp(-Math.max(0, t - 0.018) / 0.12) * (t > 0.018);
    return hp(bp(noise() * e)) * 2.6;
  }, 0.3 * vel, -0.08, 0.35);
};
const hat = (t0, vel) => {
  const hp = biquad("hp", 7800, 0.7);
  add(drums, t0, 0.12, (t) => hp(noise()) * Math.exp(-t / 0.026), 0.12 * vel, 0.3, 0.05);
};
const crash = (t0, vel) => {
  const hp = biquad("hp", 4200, 0.6);
  add(drums, t0, 2.4, (t) => hp(noise()) * Math.exp(-t / 0.9), 0.11 * vel, 0.15, 0.4);
};
const sub = (t0, vel, len = 1.4) => {
  let ph = 0;
  add(drums, t0, len, (t) => { ph += (TAU * (34 + 30 * Math.exp(-t / 0.25))) / SR; return Math.sin(ph) * Math.exp(-t / 0.75); }, 0.32 * vel, 0, 0);
};
const riser = (t0, t1) => {
  const lp = biquad("lp", 300, 1.4), len = t1 - t0;
  let ph = 0;
  add(drums, t0, len, (t) => {
    const p = t / len;
    if ((Math.round(t * SR) & 63) === 0) lp.set(300 * Math.pow(7000 / 300, Math.pow(p, 1.4)));
    ph += (TAU * (180 + 520 * p * p)) / SR;
    return (lp(noise()) * 0.9 + 0.12 * Math.sin(ph)) * (0.04 + 0.96 * p * p);
  }, 0.2, 0, 0.3);
};

// ---------- armonía (Re mayor) ----------
const CH = {
  D: { pad: [62, 66, 69], ep: [66, 69, 74], arp: [74, 78, 81, 86], root: 38, hook: [90, 93, 95, 93, 90] },
  A: { pad: [61, 64, 69], ep: [64, 69, 73], arp: [73, 76, 81, 85], root: 45, hook: [88, 92, 93, 92, 88] },
  Bm: { pad: [62, 66, 71], ep: [66, 71, 74], arp: [74, 78, 83, 86], root: 47, hook: [90, 93, 95, 98, 95] },
  G: { pad: [62, 67, 71], ep: [67, 71, 74], arp: [74, 79, 83, 86], root: 43, hook: [91, 95, 98, 95, 91] },
};
const prog = ["D", "A", "Bm", "D", "A", "Bm", "G", "D", "A"]; // compases 0..8 (el 3 es el drop)
const ARP = [0, 1, 2, 1, 3, 2, 1, 2];

// ---------- intro (0–4,80 s) ----------
marimba(69, 0.7)(0); // anacrusa en el frame 0
for (let b = 0; b < 3; b++) {
  const c = CH[prog[b]], n0 = 4 * b;
  pad(c.pad, tb(n0), 1.6, 0.8 + b * 0.25);
  for (let e = 0; e < 8; e++) {
    const t = tb(n0 + e * 0.5);
    if (t < 4.79) marimba(c.arp[ARP[e]], 0.55 + 0.1 * b + (e % 2 ? 0 : 0.12))(t);
  }
}
[5, 7, 9, 11].forEach((n, i) => clap(tb(n), 0.55 + i * 0.12));
[8, 9, 10, 10.5, 11, 11.5].forEach((n, i) => kick(tb(n), 0.45 + i * 0.09));
[11, 11.25, 11.5, 11.75].forEach((n, i) => clap(tb(n), 0.3 + i * 0.14));
riser(3.38, 4.8);

// ---------- drop y groove (4,98–13,38 s) ----------
sub(tb(12), 1.0);
crash(tb(12), 1.0);
for (let b = 3; b <= 8; b++) {
  const c = CH[prog[b]], n0 = 4 * b, last = b === 8;
  pad(c.pad, tb(n0), 1.6, 1.0);
  epiano(c.ep, tb(n0), 0.7, 1.0);
  [1.5, 2.5].forEach((o) => epiano(c.ep, tb(n0 + o), 0.14, 0.75));
  epiano(c.ep, tb(n0 + 3), 0.3, 0.85);
  for (let e = 0; e < 8; e++) marimba(c.arp[ARP[e]] + (e === 4 ? 0 : 0), 0.45 + (e % 2 ? 0 : 0.1), 0.35)(tb(n0 + e * 0.5));
  clap(tb(n0 + 1), 1.0); clap(tb(n0 + 3), 1.0);
  if (!last) {
    kick(tb(n0), 1.0); kick(tb(n0 + 2), 0.95);
    if (b % 2 === 0) kick(tb(n0 + 3.5), 0.7);
    [0.5, 1.5, 2.5, 3.5].forEach((o) => hat(tb(n0 + o), 1.0));
    [0, 1, 2, 3].forEach((o) => hat(tb(n0 + o), 0.45));
    [[0, 0, 0.18, 1], [0.5, 12, 0.12, 0.6], [1.5, 0, 0.18, 0.9], [2, 0, 0.18, 1], [2.5, 12, 0.12, 0.55], [3.5, 0, 0.18, 0.85]].forEach(([o, oct, len, v]) => bassNote(c.root + oct, tb(n0 + o), len, v));
  } else {
    bassNote(c.root, tb(n0), 1.3, 0.8);
  }
  if (b === 3 || b === 5 || b === 7) [0, 0.5, 1, 2, 3].forEach((o, i) => glock(c.hook[i], tb(n0 + o), 1.0));
}

// ---------- golpe final (14,38 s) — coincide con el pulso ámbar ----------
const tf = tb(35.5);
kick(tf, 1.0); crash(tf, 0.8); sub(tf, 0.6, 0.62);
epiano([62, 64, 66, 69, 74], tf, 0.62, 1.1);
glock(98, tf, 1.1); marimba(86, 0.8)(tf);
bassNote(38, tf, 0.62, 1.0);

// ---------- mezcla ----------
const sc = new Float32Array(N).fill(1); // sidechain desde el bombo
for (const tk of kicks) {
  const s0 = Math.round(tk * SR);
  for (let i = 0; i < SR * 0.4 && s0 + i < N; i++) {
    const t = i / SR, g = 1 - 0.5 * Math.min(1, t / 0.005) * Math.exp(-t / 0.12);
    sc[s0 + i] = Math.min(sc[s0 + i], g);
  }
}
// silencio de 4 frames antes del drop (la pausa del punto de luz)
const gate = (t) => (t < 4.79 ? 1 : t < 4.975 ? Math.max(0, 1 - (t - 4.79) / 0.012) : 1);

// reverb (Freeverb simplificado)
class Comb { constructor(n) { this.b = new Float32Array(n); this.i = 0; this.f = 0; } p(x) { const y = this.b[this.i]; this.f = y * 0.75 + this.f * 0.25; this.b[this.i] = x + this.f * 0.82; if (++this.i >= this.b.length) this.i = 0; return y; } }
class AP { constructor(n) { this.b = new Float32Array(n); this.i = 0; } p(x) { const bo = this.b[this.i]; const y = -x + bo; this.b[this.i] = x + bo * 0.5; if (++this.i >= this.b.length) this.i = 0; return y; } }
const mk = (sp) => ({ c: [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((d) => new Comb(Math.round((d + sp) * 1.088))), a: [556, 441, 341, 225].map((d) => new AP(Math.round((d + sp) * 1.088))) });
const rvL = mk(0), rvR = mk(23);
const run = (rv, x) => { let s = 0; for (const c of rv.c) s += c.p(x); for (const a of rv.a) s = a.p(s); return s; };

const outL = new Float32Array(N), outR = new Float32Array(N);
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR, g = gate(t);
  const inp = (send.L[i] + send.R[i]) * 0.015 * g;
  const wl = run(rvL, inp), wr = run(rvR, inp);
  let l = (drums.L[i] + duck.L[i] * sc[i] + bass.L[i] * (0.4 + 0.6 * sc[i])) * g + wl * 0.9;
  let r = (drums.R[i] + duck.R[i] * sc[i] + bass.R[i] * (0.4 + 0.6 * sc[i])) * g + wr * 0.9;
  const fade = t > DUR - 0.3 ? (DUR - t) / 0.3 : 1;
  l = Math.tanh(l * 0.8) * fade; r = Math.tanh(r * 0.8) * fade;
  outL[i] = l; outR[i] = r;
  peak = Math.max(peak, Math.abs(l), Math.abs(r));
}
const norm = 0.89 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, outL[i] * norm)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, outR[i] * norm)) * 32767), 46 + i * 4);
}
fs.mkdirSync("assets/audio", { recursive: true });
fs.writeFileSync("assets/audio/music_vortex.wav", buf);
console.log("ok assets/audio/music_vortex.wav", (N / SR).toFixed(2) + "s", "peak", peak.toFixed(3));
