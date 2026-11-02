// Música original para el reel. Estilo de referencia pedido: "Big Talk" de SOFY
// (pop británico relajado y juguetón, onda Lily Allen). No copia la canción:
// melodía, acordes y arreglo son propios. Guitarra cortada a contratiempo, bajo
// que camina, batería con pandereta, silbido como melodía y vientos en los golpes.
// Grilla de 150 BPM anclada para que el drop caiga en el estallido del logo (4,98 s)
// y el golpe final en el pulso ámbar (14,38 s). Determinista (semilla fija).
// Uso: node tools/music_vortex.mjs  → assets/audio/music_vortex.wav
import fs from "node:fs";

const SR = 48000, DUR = 15.0, N = Math.round(SR * DUR);
const TAU = Math.PI * 2;
const B = 0.4, A0 = 0.18; // negra = 0,4 s; tiempo 12 = 4,98 s
const tb = (n) => A0 + B * n;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

let seed = 77031;
const noise = () => ((seed = (Math.imul(seed, 1103515245) + 12345) >>> 0) / 4294967296) * 2 - 1;

const bus = () => ({ L: new Float32Array(N), R: new Float32Array(N) });
const drums = bus(), band = bus(), low = bus(), send = bus();

function add(target, t0, len, fn, gain, pan = 0, sendAmt = 0) {
  if (t0 < 0) { len += t0; t0 = 0; }
  const s0 = Math.round(t0 * SR), n = Math.min(N - s0, Math.round(len * SR));
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4) * Math.SQRT2;
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4) * Math.SQRT2;
  for (let i = 0; i < n; i++) {
    const v = fn(i / SR, i), k = s0 + i;
    target.L[k] += v * gl; target.R[k] += v * gr;
    if (sendAmt) { send.L[k] += v * gl * sendAmt; send.R[k] += v * gr * sendAmt; }
  }
}
function biquad(type, f0, Q) {
  let b0, b1, b2, a1, a2, x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  const w = (TAU * f0) / SR, c = Math.cos(w), a = Math.sin(w) / (2 * Q), a0 = 1 + a;
  if (type === "lp") { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; }
  else if (type === "hp") { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; }
  else { b0 = a; b1 = 0; b2 = -a; }
  b0 /= a0; b1 /= a0; b2 /= a0; a1 = (-2 * c) / a0; a2 = (1 - a) / a0;
  return (x) => { const y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = x; y2 = y1; y1 = y; return y; };
}
// cuerda pulsada (Karplus-Strong): guitarra y bajo con ataque real
function pluck(f, len, damp, bright) {
  const P = Math.max(2, Math.round(SR / f)), dl = new Float32Array(P);
  let lp = 0;
  for (let i = 0; i < P; i++) { lp = lp + bright * (noise() - lp); dl[i] = lp; }
  const out = new Float32Array(Math.round(len * SR));
  let idx = 0;
  for (let i = 0; i < out.length; i++) {
    const a = dl[idx], b = dl[(idx + 1) % P];
    out[i] = a;
    dl[idx] = damp * 0.5 * (a + b);
    idx = (idx + 1) % P;
  }
  return out;
}

// ---------- instrumentos ----------
const chop = (notes, t0, vel, len = 0.11) => { // guitarra rasgueada muteada, a contratiempo
  notes.forEach((m, j) => {
    const s = pluck(mtof(m), len + 0.06, 0.996, 0.55);
    add(band, t0 + j * 0.006, len + 0.06, (t, i) => s[i] * (t < len ? 1 : Math.exp(-(t - len) / 0.012)), (0.34 * vel) / notes.length, 0.32, 0.2);
  });
};
const keys = (notes, t0, len, vel) => { // piano eléctrico corto, doblando el contratiempo
  notes.forEach((m, j) => {
    const f = mtof(m);
    add(band, t0, len + 0.12, (t) => {
      const env = Math.min(1, t / 0.003) * Math.exp(-t / 0.5) * (t < len ? 1 : Math.exp(-(t - len) / 0.04));
      return env * Math.sin(TAU * f * t + (1.3 * Math.exp(-t / 0.15) + 0.2) * Math.sin(TAU * f * t));
    }, (0.11 * vel) / notes.length, -0.28 + j * 0.05, 0.2);
  });
};
const bassNote = (m, t0, len, vel) => {
  const f = mtof(m), s = pluck(f, len + 0.08, 0.9985, 0.35), lp = biquad("lp", 900, 0.7);
  add(low, t0, len + 0.08, (t, i) => {
    const env = t < len ? 1 : Math.exp(-(t - len) / 0.02);
    return lp(s[i] * 1.4 + 0.55 * Math.sin(TAU * f * t) * Math.exp(-t / 0.5)) * env;
  }, 0.42 * vel, 0, 0);
};
const whistle = (m, t0, len, vel, from = null) => { // silbido: seno con vibrato y aire
  const f = mtof(m), f0 = from ? mtof(from) : f * Math.pow(2, -45 / 1200), hp = biquad("hp", 2500, 0.7);
  let ph = 0;
  add(band, t0, len + 0.1, (t) => {
    const glide = Math.min(1, t / 0.045);
    const vib = 1 + 0.012 * Math.sin(TAU * 5.6 * t) * Math.min(1, Math.max(0, (t - 0.09) / 0.12));
    ph += (TAU * (f0 + (f - f0) * glide) * vib) / SR;
    const env = Math.min(1, t / 0.025) * (t < len ? 1 : Math.exp(-(t - len) / 0.05));
    return env * (Math.sin(ph) + 0.03 * Math.sin(2 * ph) + 0.06 * hp(noise()));
  }, 0.13 * vel, -0.12, 0.35);
};
const horns = (notes, t0, len, vel) => { // vientos: sierra suave con brillo que cae
  notes.forEach((m, j) => [-6, 6].forEach((ct) => {
    const f = mtof(m) * Math.pow(2, ct / 1200);
    add(band, t0, len + 0.15, (t) => {
      const env = Math.min(1, t / 0.018) * (t < len ? 1 : Math.exp(-(t - len) / 0.06));
      const br = 0.35 + 0.65 * Math.exp(-t / 0.12);
      let s = 0;
      for (let k = 1; k <= 8; k++) s += (Math.sin(TAU * k * f * t) / k) * Math.pow(br, k - 1);
      return env * s;
    }, (0.075 * vel) / notes.length, ct > 0 ? 0.2 : -0.2, 0.3);
  }));
};
const kicks = [];
const kick = (t0, vel) => {
  kicks.push(t0);
  let ph = 0;
  add(drums, t0, 0.45, (t) => { ph += (TAU * (52 + 105 * Math.exp(-t / 0.028))) / SR; return Math.sin(ph) * Math.exp(-t / 0.22) + 0.2 * noise() * Math.exp(-t / 0.002); }, 0.42 * vel, 0, 0);
};
const snare = (t0, vel) => {
  const bp = biquad("bp", 2200, 0.6), hp = biquad("hp", 900, 0.7);
  let ph = 0;
  add(drums, t0, 0.35, (t) => { ph += (TAU * (195 - 30 * Math.min(1, t / 0.05))) / SR; return 0.6 * Math.sin(ph) * Math.exp(-t / 0.045) + 1.6 * hp(bp(noise())) * Math.exp(-t / 0.11); }, 0.26 * vel, 0.04, 0.3);
};
const hat = (t0, vel, open = false) => {
  const hp = biquad("hp", 8200, 0.7);
  add(drums, t0, open ? 0.3 : 0.08, (t) => hp(noise()) * Math.exp(-t / (open ? 0.11 : 0.022)), 0.1 * vel, 0.28, 0.05);
};
const tamb = (t0, vel) => {
  const bp = biquad("bp", 9500, 1.2);
  add(drums, t0, 0.14, (t) => bp(noise()) * (Math.exp(-t / 0.03) + 0.5 * Math.exp(-Math.max(0, t - 0.018) / 0.03) * (t > 0.018)) * 3, 0.07 * vel, -0.35, 0.1);
};
const crash = (t0, vel) => { const hp = biquad("hp", 4500, 0.6); add(drums, t0, 2.2, (t) => hp(noise()) * Math.exp(-t / 0.8), 0.09 * vel, 0.15, 0.35); };
const sub = (t0, vel, len = 1.2) => { let ph = 0; add(drums, t0, len, (t) => { ph += (TAU * (40 + 25 * Math.exp(-t / 0.2))) / SR; return Math.sin(ph) * Math.exp(-t / 0.6); }, 0.26 * vel, 0, 0); };
const swell = (t0, t1) => { // subida corta de platillo y ruido antes del drop
  const hp = biquad("hp", 3000, 0.6), len = t1 - t0;
  add(drums, t0, len, (t) => { const p = t / len; return hp(noise()) * p * p * p; }, 0.16, 0, 0.3);
};

// ---------- armonía (Sol mayor): G – Em – C – D ----------
const CH = {
  G: { v: [62, 67, 71], root: 43 }, Em: { v: [64, 67, 71], root: 40 },
  C: { v: [64, 67, 72], root: 36 }, D: { v: [62, 66, 69], root: 38 },
};
// bajo que camina: tónica, quinta, octava y nota de paso hacia el compás siguiente
const walk = (r, next) => [[0, r, 0.3], [1, r + 7, 0.25], [2, r + 12, 0.3], [2.5, r + 12, 0.12], [3, next - 1, 0.28]];

// ---------- intro (0–4,80): guitarra a contratiempo + pandereta + silbido que anticipa ----------
const intro = [["G", 0], ["Em", 4], ["C", 8], ["D", 10]];
intro.forEach(([c, n0], k) => {
  const end = k < 3 ? intro[k + 1][1] : 12;
  for (let n = n0; n < end; n++) {
    const t = tb(n + 0.5);
    if (t < 4.79) chop(CH[c].v, t, 0.55 + n * 0.025);
    if (n >= 4) tamb(tb(n + 0.5), 0.6);
  }
});
chop([62, 67, 71], 0.0, 0.6); // ya suena en el frame 0
[[1, 79, 0.18], [1.5, 83, 0.18], [2, 86, 0.5], [5, 83, 0.18], [5.5, 81, 0.18], [6, 79, 0.5]].forEach(([n, m, l]) => whistle(m + 12, tb(n), l, 0.75));
[5, 7, 9].forEach((n) => snare(tb(n), 0.5));
[8, 10].forEach((n) => kick(tb(n), 0.6));
[11, 11.25, 11.5, 11.75].forEach((n, i) => snare(tb(n), 0.35 + i * 0.16));
[8, 9, 10, 11].forEach((n) => bassNote(CH[n < 10 ? "C" : "D"].root + 12, tb(n), 0.25, 0.7));
swell(3.78, 4.79);

// ---------- drop y groove (4,98–13,38) ----------
const prog = { 3: "G", 4: "Em", 5: "C", 6: "D", 7: "G", 8: "D" };
const roots = { 3: 43, 4: 40, 5: 36, 6: 38, 7: 43, 8: 38, 9: 43 };
sub(tb(12), 1.0); crash(tb(12), 1.0); horns([67, 71, 74], tb(12), 0.26, 1.0);
// melodía del silbido (original), compás por compás
const mel = {
  3: [[0.5, 83, 0.16], [1, 86, 0.16], [1.5, 83, 0.16], [2.5, 81, 0.16], [3, 79, 0.36]],
  4: [[0.5, 79, 0.16], [1, 83, 0.16], [2, 81, 0.6]],
  5: [[0.5, 79, 0.16], [1, 76, 0.16], [1.5, 79, 0.16], [2.5, 81, 0.16], [3, 79, 0.36]],
  6: [[0.5, 78, 0.16], [1, 81, 0.16], [2, 86, 0.6]],
  7: [[0.5, 83, 0.16], [1, 86, 0.16], [1.5, 83, 0.16], [2.5, 81, 0.16], [3, 79, 0.36]],
  8: [[0.5, 81, 0.16], [1, 78, 0.16], [2, 74, 0.9]],
};
for (let b = 3; b <= 8; b++) {
  const c = CH[prog[b]], n0 = 4 * b, last = b === 8;
  for (let o = 0.5; o < 4; o += 1) { chop(c.v, tb(n0 + o), 0.95); keys(c.v.map((m) => m + 12), tb(n0 + o), 0.09, 0.8); }
  if (!last) {
    kick(tb(n0), 1.0); kick(tb(n0 + 2), 0.9); if (b % 2 === 0) kick(tb(n0 + 2.5), 0.6);
    snare(tb(n0 + 1), 1.0); snare(tb(n0 + 3), 1.0);
    for (let o = 0; o < 4; o += 0.5) hat(tb(n0 + o), o % 1 ? 0.9 : 0.55, o === 3.5);
    for (let o = 0.25; o < 4; o += 0.5) tamb(tb(n0 + o), 0.55);
    walk(roots[b], roots[b + 1]).forEach(([o, m, l]) => bassNote(m, tb(n0 + o), l, 0.95));
  } else {
    snare(tb(n0 + 1), 0.8); snare(tb(n0 + 3), 0.8);
    for (let o = 0.25; o < 4; o += 0.5) tamb(tb(n0 + o), 0.5);
    bassNote(38, tb(n0), 1.2, 0.8);
  }
  mel[b].forEach(([o, m, l], i) => whistle(m + 12, tb(n0 + o), l, 1.0, i ? mel[b][i - 1][1] + 12 : null));
  if (b === 6) horns([66, 69, 74], tb(n0 + 3.5), 0.18, 0.8);
}

// ---------- golpe final (14,38) ----------
const tf = tb(35.5);
kick(tf, 1.0); crash(tf, 0.7); sub(tf, 0.5, 0.62);
horns([67, 71, 74, 79], tf, 0.55, 1.1);
chop([55, 62, 67, 71, 79], tf, 1.0, 0.5);
whistle(91, tf, 0.5, 0.9, 86);
bassNote(43, tf, 0.6, 1.0);

// ---------- mezcla ----------
const sc = new Float32Array(N).fill(1);
for (const tk of kicks) {
  const s0 = Math.round(tk * SR);
  for (let i = 0; i < SR * 0.3 && s0 + i < N; i++) { const t = i / SR; sc[s0 + i] = Math.min(sc[s0 + i], 1 - 0.22 * Math.exp(-t / 0.1)); }
}
const gate = (t) => (t < 4.79 ? 1 : t < 4.975 ? Math.max(0, 1 - (t - 4.79) / 0.012) : 1);
class Comb { constructor(n) { this.b = new Float32Array(n); this.i = 0; this.f = 0; } p(x) { const y = this.b[this.i]; this.f = y * 0.7 + this.f * 0.3; this.b[this.i] = x + this.f * 0.78; if (++this.i >= this.b.length) this.i = 0; return y; } }
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
  let l = (drums.L[i] + band.L[i] * sc[i] + low.L[i] * (0.6 + 0.4 * sc[i])) * g + wl * 0.8;
  let r = (drums.R[i] + band.R[i] * sc[i] + low.R[i] * (0.6 + 0.4 * sc[i])) * g + wr * 0.8;
  const fade = t > DUR - 0.3 ? (DUR - t) / 0.3 : 1;
  l = Math.tanh(l * 0.85) * fade; r = Math.tanh(r * 0.85) * fade;
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
