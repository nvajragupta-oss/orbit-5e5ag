// Skip counting: fill the gap in a number pattern.
// Easy stage: count up by 2s, 5s or 10s from a multiple (10, 15, 20, ?, 30).
// Hard stage: odd starts (23, 33, ?), 100s, or counting backwards.

import { equation } from '../lib/visuals.js';
import { numberChoices } from '../lib/distractors.js';
import { el } from '../lib/dom.js';

const LENGTH = 5;

export default {
  id: 'skip-count',
  generate({ stage, rng }) {
    let step, start, dir = 1;
    if (stage === 0) {
      step = rng.pick([2, 5, 10]);
      start = step * rng.int(0, 6);
    } else {
      step = rng.pick([2, 5, 10, 100]);
      start = step === 100 ? rng.int(1, 4) * 100 + rng.pick([0, 50, 20, 70]) : step * rng.int(1, 8) + (step === 2 ? 1 : rng.int(1, step - 1));
      if (rng.chance(0.4)) {
        dir = -1;
        start += step * (LENGTH - 1);
      }
    }
    const seq = Array.from({ length: LENGTH }, (_, i) => start + dir * step * i);
    const gap = rng.int(stage === 0 ? 2 : 1, LENGTH - 1);
    return { key: seq.join(',') + `@${gap}`, step, dir, seq, gap, answer: seq[gap], say: 'What number is missing from the pattern?' };
  },
  render(p) {
    const tokens = p.seq.map((n, i) => (i === p.gap ? '?' : n));
    const row = equation(tokens);
    row.classList.add('seq');
    return el('div', { class: 'stack' }, row);
  },
  choices(p, rng) {
    return numberChoices(p.answer, rng, { mistakes: [p.answer + p.step, p.answer - p.step, p.answer + 1], offsets: [1, 10] });
  },
  hint(p) {
    const a = p.seq[0];
    const b = p.seq[1];
    return { text: `Look at ${a} and then ${b}. The numbers go ${p.dir > 0 ? 'up' : 'down'} by ${p.step} each time.`, visual: null };
  },
  explain(p) {
    const prev = p.seq[p.gap - 1];
    return { text: `The pattern goes ${p.dir > 0 ? 'up' : 'down'} by ${p.step}. ${prev} ${p.dir > 0 ? '+' : '−'} ${p.step} = ${p.answer}.`, visual: null };
  },
};
