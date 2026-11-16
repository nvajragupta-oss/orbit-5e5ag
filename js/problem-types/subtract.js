// Subtraction ("take away"). params.kind mirrors add.js:
//   'within20'      up to 20 (hard stage crosses ten: 13 − 5)
//   '2d'            two-digit − two-digit; params.regroup true = with borrowing (52 − 27)
//   'tens-hundreds' take 10s or 100s from a 3-digit number (560 − 200, 430 − 50)

import { sample } from '../lib/rng.js';
import { equation, tenFrames, blocks } from '../lib/visuals.js';
import { el } from '../lib/dom.js';

const ones = (n) => n % 10;
const tensDigit = (n) => Math.floor(n / 10) % 10;

const PICK = {
  within20: ({ rng, stage }) =>
    stage === 0
      ? sample(() => [rng.int(12, 19), rng.int(2, 8)], ([a, b]) => ones(a) >= b && a - b >= 10)
      : sample(() => [rng.int(11, 18), rng.int(3, 9)], ([a, b]) => ones(a) < b && a - b >= 2),

  '2d': ({ rng, stage, params }) => {
    const borrow = ([a, b]) => ones(a) < ones(b);
    if (params.regroup) {
      return stage === 0
        ? sample(() => [rng.int(30, 60), rng.int(11, 29)], (p) => borrow(p) && p[0] - p[1] >= 5)
        : sample(() => [rng.int(50, 99), rng.int(21, 69)], (p) => borrow(p) && p[0] - p[1] >= 5);
    }
    return stage === 0
      ? sample(() => [rng.int(25, 69), rng.int(11, 29)], (p) => !borrow(p) && p[0] - p[1] >= 5)
      : sample(() => [rng.int(45, 99), rng.int(21, 69)], (p) => !borrow(p) && p[0] - p[1] >= 10);
  },

  'tens-hundreds': ({ rng, stage }) => {
    if (stage === 0) {
      return rng.chance(0.5)
        ? sample(() => [rng.int(3, 9) * 100 + rng.int(0, 9) * 10, rng.int(1, 4) * 100], ([a, b]) => a - b >= 100)
        : sample(() => [rng.int(1, 9) * 100 + rng.int(3, 9) * 10, rng.int(1, 5) * 10], ([a, b]) => tensDigit(a) >= b / 10);
    }
    return sample(() => [rng.int(2, 9) * 100 + rng.int(0, 5) * 10, rng.int(2, 9) * 10], ([a, b]) => tensDigit(a) < b / 10 && a - b >= 100);
  },
};

function steps({ a, b, answer, kind }) {
  if (kind === 'within20') {
    if (a >= 10 && ones(a) < b) {
      const first = ones(a);
      return [`Take away ${first} to get to 10: ${a} − ${first} = 10.`, `Then take away ${b - first} more: 10 − ${b - first} = ${answer}.`];
    }
    return [`Count back ${b} from ${a}.`, `${a} − ${b} = ${answer}.`];
  }
  if (kind === '2d') {
    const tensA = Math.floor(a / 10) * 10;
    const tensB = Math.floor(b / 10) * 10;
    if (ones(a) < ones(b)) {
      const bigOnes = ones(a) + 10;
      return [
        `You can't take ${ones(b)} from ${ones(a)}, so swap 1 ten for 10 ones: ${a} = ${tensA - 10} + ${bigOnes}.`,
        `Tens: ${tensA - 10} − ${tensB} = ${tensA - 10 - tensB}. Ones: ${bigOnes} − ${ones(b)} = ${bigOnes - ones(b)}.`,
        `Put them together: ${answer}.`,
      ];
    }
    return [`Take away the tens: ${tensA} − ${tensB} = ${tensA - tensB}.`, `Take away the ones: ${ones(a)} − ${ones(b)} = ${ones(a) - ones(b)}.`, `Put them together: ${answer}.`];
  }
  if (b % 100 === 0) return [`Take away the hundreds: ${Math.floor(a / 100)} hundreds − ${b / 100} hundreds.`, `${a} − ${b} = ${answer}.`];
  const toHundred = a % 100;
  if (b > toHundred) return [`Jump back to the hundred: ${a} − ${toHundred} = ${a - toHundred}.`, `Then take away ${b - toHundred} more: ${a - toHundred} − ${b - toHundred} = ${answer}.`];
  return [`Take away the tens: ${tensDigit(a)} tens − ${b / 10} tens.`, `${a} − ${b} = ${answer}.`];
}

function picture({ a, b, kind }) {
  if (kind === 'within20') return el('div', { class: 'pair' }, tenFrames(a, 'yellow'), el('span', { class: 'pair-op', text: `− ${b}` }));
  if (kind === '2d') return el('div', { class: 'pair' }, blocks(Math.floor(a / 10), a % 10), el('span', { class: 'pair-op', text: `− ${b}` }));
  return null;
}

export default {
  id: 'subtract',
  generate({ params, stage, rng }) {
    const kind = params.kind || 'within20';
    const [a, b] = PICK[kind]({ rng, stage, params });
    return { key: `${a}-${b}`, a, b, kind, answer: a - b, say: `What is ${a} minus ${b}?` };
  },
  render: (p) => equation([p.a, '−', p.b, '=', '?']),
  hint(p) {
    const s = steps(p);
    return { text: s.slice(0, -1).join(' '), visual: picture(p) };
  },
  explain(p) {
    return { text: steps(p).join(' '), visual: picture(p) };
  },
};
