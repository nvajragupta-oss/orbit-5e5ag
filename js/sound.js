// Little sound effects made in code (Web Audio) — no sound files needed.

let ctx = null;
let enabled = true;

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start = 0, dur = 0.15, type = 'sine', vol = 0.16) {
  if (!enabled) return;
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + start;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export const sound = {
  unlock() {
    audio();
  },
  setEnabled(on) {
    enabled = on;
  },
  tap() {
    tone(520, 0, 0.05, 'sine', 0.05);
  },
  correct() {
    tone(660, 0, 0.12, 'triangle');
    tone(990, 0.1, 0.22, 'triangle');
  },
  wrong() {
    tone(260, 0, 0.18, 'sine', 0.12);
    tone(200, 0.12, 0.22, 'sine', 0.1);
  },
  star(i = 0) {
    [784, 988, 1175].forEach((f, k) => tone(f + i * 60, k * 0.06, 0.18, 'triangle', 0.12));
  },
  levelUp() {
    [523, 659, 784, 1047].forEach((f, k) => tone(f, k * 0.1, 0.25, 'triangle', 0.14));
  },
};
