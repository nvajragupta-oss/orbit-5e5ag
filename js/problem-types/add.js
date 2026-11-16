// Addition. params.kind:
//   'within20'      sums up to 20 (hard stage crosses ten: 8 + 5)
//   '2d'            two-digit + two-digit; params.regroup true = with carrying (47 + 38)
//   'tens-hundreds' add 10s or 100s to a 3-digit number (340 + 200, 380 + 50)

import { sample } from '../lib/rng.js';
import { equation, tenFrames, blocksPair } from '../lib/visuals.js';
import { el } from '../lib/dom.js';

const ones = (n) => n % 10;
const tensDigit = (n) => Math.floor(n / 10) % 10;

const PICK = {
  within20: ({ rng, stage }) =>
    stage === 0
      ? sample(() => [rng.int(10, 16), rng.int(2, 8)], ([a, b]) => a + b <= 19 && ones(a) + b < 10)
      : sample(() => [rng.int(4, 9), rng.int(3, 9)], ([a, b]) => a + b >= 11),

  '2d': ({ rng, stage, params }) => {
    const carry = ([a, b]) => ones(a) + ones(b) >= 10;
    if (params.regroup) {
      return stage === 0
        ? sample(() => [rng.int(15, 49), rng.int(11, 29)], (p) => carry(p) && p[0] + p[1] <= 79)
        : sample(() => [rng.int(25, 75), rng.int(25, 69)], (p) => carry(p) && p[0] + p[1] <= 99);
    }
    return stage === 0
      ? sample(() => [rng.int(12, 59), rng.int(11, 30)], (p) => !carry(p) && p[0] + p[1] <= 99)
      : sample(() => [rng.int(21, 78), rng.int(21, 68)], (p) => !carry(p) && p[0] + p[1] <= 99);
  },

  'tens-hundreds': ({ rng, stage }) => {
    if (stage === 0) {
      return rng.chance(0.5)
        ? sample(() => [rng.int(1, 7) * 100 + rng.int(0, 9) * 10, rng.int(1, 3) * 100], ([a, b]) => a + b < 1000)
        : sample(() => [rng.int(1, 8) * 100 + rng.int(1, 6) * 10, rng.int(1, 5) * 10], ([a, b]) => tensDigit(a) + b / 10 < 10);
    }
    return sample(() => [rng.int(1, 8) * 100 + rng.int(3, 9) * 10, rng.int(2, 9) * 10], ([a, b]) => tensDigit(a) + b / 10 >= 10 && a + b < 1000);
  },
};

/** Step-by-step thinking used for hints (all but the last step) and explanations (all steps). */
function steps({ a, b, answer, kind }) {
  if (kind === 'within20') {
    if (ones(a) + b >= 10 && a < 10) {
      const need = 10 - a;
      return [`Make 10 first: ${a} + ${need} = 10.`, `Then add the rest: 10 + ${b - need} = ${answer}.`];
    }
    return [`Start at ${a} and count on ${b}.`, `${a} + ${b} = ${answer}.`];
  }
  if (kind === '2d') {
    const t = Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10;
    const o = ones(a) + ones(b);
    return [`Add the tens: ${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10} = ${t}.`, `Add the ones: ${ones(a)} + ${ones(b)} = ${o}.`, `Put them together: ${t} + ${o} = ${answer}.`];
  }
  // tens-hundreds
  if (b % 100 === 0) return [`Add the hundreds: ${Math.floor(a / 100)} hundreds + ${b / 100} hundreds.`, `${a} + ${b} = ${answer}.`];
  const toNext = 100 - (a % 100);
  if (b > toNext) return [`Jump to the next hundred: ${a} + ${toNext} = ${a + toNext}.`, `Then add ${b - toNext} more: ${a + toNext} + ${b - toNext} = ${answer}.`];
  return [`Add the tens: ${tensDigit(a)} tens + ${b / 10} tens.`, `${a} + ${b} = ${answer}.`];
}

function picture({ a, b, kind }) {
  if (kind === 'within20') return el('div', { class: 'pair' }, tenFrames(a, 'yellow'), el('span', { class: 'pair-op', text: '+' }), tenFrames(b, 'cyan'));
  if (kind === '2d') return blocksPair(a, b, '+');
  return null;
}

export default {
  id: 'add',
  generate({ params, stage, rng }) {
    const kind = params.kind || 'within20';
    const [a, b] = PICK[kind]({ rng, stage, params });
    return { key: `${a}+${b}`, a, b, kind, answer: a + b, say: `What is ${a} plus ${b}?` };
  },
  render: (p) => equation([p.a, '+', p.b, '=', '?']),
  hint(p) {
    const s = steps(p);
    return { text: s.slice(0, -1).join(' '), visual: picture(p) };
  },
  explain(p) {
    return { text: steps(p).join(' '), visual: picture(p) };
  },
};
