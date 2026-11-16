// Compare two numbers with <, = or >.
// Easy stage: 2-digit numbers. Hard stage: 3-digit numbers that look alike (482 vs 428).
// Use with the 'compare' input.

import { equation } from '../lib/visuals.js';

const WORDS = { '<': 'is less than', '>': 'is greater than', '=': 'is equal to' };

/** A 3-digit number that looks like `a` (two digits swapped, or one digit changed). */
function similar3(a, rng) {
  const d = String(a).split('');
  const swap = rng.pick([[1, 2], [0, 1], [0, 2]]);
  [d[swap[0]], d[swap[1]]] = [d[swap[1]], d[swap[0]]];
  const b = Number(d.join(''));
  if (b >= 100 && b !== a) return b;
  return Math.min(999, a + rng.pick([-10, 10, -1, 1, 100]));
}

export default {
  id: 'compare',
  generate({ stage, rng }) {
    const a = stage === 0 ? rng.int(10, 99) : rng.int(100, 999);
    let b;
    if (rng.chance(0.15)) b = a;
    else if (stage === 0) b = rng.chance(0.5) ? Number(String(a).split('').reverse().join('')) || a + 1 : a + rng.pick([-11, -10, -1, 1, 9, 10]);
    else b = similar3(a, rng);
    b = Math.max(stage === 0 ? 10 : 100, Math.min(stage === 0 ? 99 : 999, b));
    const answer = a < b ? '<' : a > b ? '>' : '=';
    return { key: `${a}?${b}`, a, b, answer, say: `Which sign goes between ${a} and ${b}?` };
  },
  render: (p) => equation([p.a, '?', p.b]),
  format: (v) => v,
  hint(p) {
    const big = p.a >= 100;
    return {
      text: `Compare the ${big ? 'hundreds first, then the tens' : 'tens first'}, then the ones. The open mouth faces the bigger number.`,
      visual: null,
    };
  },
  explain(p) {
    return { text: `${p.a} ${p.answer} ${p.b} — ${p.a} ${WORDS[p.answer]} ${p.b}.`, say: `${p.a} ${WORDS[p.answer]} ${p.b}.`, visual: null };
  },
};
