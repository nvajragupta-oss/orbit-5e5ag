// Times tables. params.tables = which tables to practise, e.g. [2, 5, 10].
// Easy stage: × 1–5. Hard stage: × 6–10.

import { equation, dotArray } from '../lib/visuals.js';

export default {
  id: 'times',
  generate({ params, stage, rng }) {
    const table = rng.pick(params.tables || [2, 5, 10]);
    const n = stage === 0 ? rng.int(1, 5) : rng.int(6, 10);
    const [a, b] = rng.chance(0.5) ? [n, table] : [table, n];
    return { key: `${a}x${b}`, a, b, table, n, answer: a * b, say: `What is ${a} times ${b}?` };
  },
  render: (p) => equation([p.a, '×', p.b, '=', '?']),
  hint(p) {
    const firstSteps = Array.from({ length: Math.min(3, p.n) }, (_, i) => p.table * (i + 1));
    return { text: `Count by ${p.table}s, ${p.n} times: ${firstSteps.join(', ')}…`, visual: dotArray(p.n, p.table) };
  },
  explain(p) {
    const all = Array.from({ length: p.n }, (_, i) => p.table * (i + 1));
    return { text: `Count by ${p.table}s ${p.n} times: ${all.join(', ')}. So ${p.a} × ${p.b} = ${p.answer}.`, visual: dotArray(p.n, p.table) };
  },
};
