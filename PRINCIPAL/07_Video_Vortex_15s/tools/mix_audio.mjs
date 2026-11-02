// Arma assets/audio/vortex_mix.wav: música (tools/music_vortex.mjs) + SFX en los cortes
// (librería media-use, Pixabay). Uso: node tools/music_vortex.mjs && node tools/mix_audio.mjs
// Necesita ffmpeg en el PATH.
import { execFileSync } from "node:child_process";
const DUR = 15;
const WITH_MUSIC = false; // true = suma assets/audio/music_vortex.wav
const MUSIC = 0.92;
// [archivo, segundo, volumen]
const cues = [
  ["whoosh-short", 0.0, 0.2], ["whoosh-short", 0.46, 0.18],
  ["whoosh", 2.14, 0.24],
  ["impact-bass-1", 4.98, 0.3],
  ["sparkle", 5.6, 0.14],
  ["whoosh-cinematic", 6.32, 0.24],
  ["whoosh-short", 7.58, 0.2],
  ["click-soft", 8.22, 0.24], ["click-soft", 8.31, 0.22], ["click-soft", 8.4, 0.22],
  ["click-soft", 8.49, 0.22], ["click-soft", 8.58, 0.22], ["click-soft", 8.67, 0.24],
  ["whoosh-short", 8.78, 0.2],
  ["click", 9.38, 0.3],
  ["whoosh-short", 10.2, 0.18],
  ["click", 10.52, 0.32], ["impact-bass-1", 10.66, 0.28],
  ["whoosh-short", 11.18, 0.2],
  ["ping", 12.04, 0.16],
  ["whoosh-short", 12.4, 0.18],
  ["whoosh", 13.18, 0.24],
];
const args = ["-y"];
if (WITH_MUSIC) args.push("-i", "assets/audio/music_vortex.wav");
else args.push("-f", "lavfi", "-t", String(DUR), "-i", "anullsrc=r=48000:cl=stereo");
cues.forEach(([n]) => args.push("-i", `assets/sfx/${n}.mp3`));
let fc = `[0:a]aresample=48000,aformat=channel_layouts=stereo,volume=${WITH_MUSIC ? MUSIC : 1}[mus];`;
cues.forEach(([, t, v], k) => {
  const ms = Math.round(t * 1000);
  fc += `[${k + 1}:a]aresample=48000,aformat=channel_layouts=stereo,volume=${v},adelay=${ms}|${ms}[c${k}];`;
});
fc += `[mus]${cues.map((_, k) => `[c${k}]`).join("")}amix=inputs=${cues.length + 1}:normalize=0:duration=first,alimiter=limit=0.89,atrim=0:${DUR}[out]`;
args.push("-filter_complex", fc, "-map", "[out]", "-ar", "48000", "-c:a", "pcm_s16le", "assets/audio/vortex_mix.wav");
execFileSync("ffmpeg", args, { stdio: "inherit" });
console.log("ok assets/audio/vortex_mix.wav");
