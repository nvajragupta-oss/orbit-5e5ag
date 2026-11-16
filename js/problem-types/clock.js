// Tell the time on an analog clock.
// Easy stage: o'clock and half past. Hard stage: quarter past and quarter to (and some easy ones).
// Answers are strings like "3:15".

import { clockFace } from '../lib/visuals.js';
import { optionChoices } from '../lib/distractors.js';
import { el } from '../lib/dom.js';

const label = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
const wrapH = (h) => ((h + 11) % 12) + 1; // keep 1..12

export function timeWords(h, m) {
  if (m === 0) return `${h} o'clock`;
  if (m === 30) return `half past ${h}`;
  if (m === 15) return `quarter past ${h}`;
  if (m === 45) return `quarter to ${wrapH(h + 1)}`;
  return label(h, m);
}

export default {
  id: 'clock',
  generate({ stage, rng }) {
    const h = rng.int(1, 12);
    const m = stage === 0 ? rng.pick([0, 30]) : rng.pick([15, 45, 15, 45, 30]);
    return { key: label(h, m), h, m, answer: label(h, m), say: 'What time does the clock show?' };
  },
  render: (p) => el('div', { class: 'stack' }, clockFace(p.h, p.m)),
  choices(p, rng) {
    // Typical mix-ups: next/previous hour, and the other "quarter".
    const pool = [
      label(wrapH(p.h + 1), p.m),
      label(wrapH(p.h - 1), p.m),
      label(p.h, p.m === 15 ? 45 : p.m === 45 ? 15 : p.m === 0 ? 30 : 0),
      label(p.m / 5 || 12, p.h * 5 === 60 ? 0 : p.h * 5), // hands swapped
    ].filter((v) => v !== p.answer);
    return optionChoices(p.answer, pool, rng);
  },
  format: (v) => v,
  hint() {
    return { text: 'The short hand points to the hour. The long hand shows the minutes — each number is 5 minutes.', visual: null };
  },
  explain(p) {
    const shortHand = p.m === 0 ? `on ${p.h}` : `between ${p.h} and ${wrapH(p.h + 1)}`;
    return { text: `The short hand is ${shortHand} and the long hand is on ${p.m === 0 ? 12 : p.m / 5}. It's ${timeWords(p.h, p.m)} — ${p.answer}.`, visual: null };
  },
};
