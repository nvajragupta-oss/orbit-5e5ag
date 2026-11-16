// Missing number: ? + 8 = 15, 7 + ? = 15, 14 − ? = 6, ? − 5 = 9 (all within 20).
// Easy stage: addition with the blank second. Hard stage: any form.

import { equation, numberLine } from '../lib/visuals.js';

const FORMS_EASY = ['a+?=c'];
const FORMS_HARD = ['?+b=c', 'a+?=c', 'c-?=a', '?-b=a'];

export default {
  id: 'missing',
  generate({ stage, rng }) {
    const max = stage === 0 ? 15 : 20;
    const c = rng.int(stage === 0 ? 8 : 11, max); // the total / starting amount
    const x = rng.int(2, c - 2); // one part
    const y = c - x; // other part
    const form = rng.pick(stage === 0 ? FORMS_EASY : FORMS_HARD);
    let tokens, answer, say;
    switch (form) {
      case 'a+?=c':
        tokens = [x, '+', '?', '=', c]; answer = y; say = `${x} plus what makes ${c}?`; break;
      case '?+b=c':
        tokens = ['?', '+', y, '=', c]; answer = x; say = `What number plus ${y} makes ${c}?`; break;
      case 'c-?=a':
        tokens = [c, '−', '?', '=', x]; answer = y; say = `${c} minus what makes ${x}?`; break;
      default: // '?-b=a'
        tokens = ['?', '−', y, '=', x]; answer = c; say = `What number minus ${y} makes ${x}?`;
    }
    return { key: `${form}:${x}:${y}`, form, x, y, c, tokens, answer, say };
  },
  render: (p) => equation(p.tokens),
  hint(p) {
    const tips = {
      'a+?=c': `Start at ${p.x} and count on until you reach ${p.c}.`,
      '?+b=c': `Think: what goes with ${p.y} to make ${p.c}? Try ${p.c} − ${p.y}.`,
      'c-?=a': `Count up from ${p.x} to ${p.c}. How many jumps?`,
      '?-b=a': `Work backwards: ${p.x} + ${p.y} = ?`,
    };
    return { text: tips[p.form], visual: numberLine(0, 20, [p.x]) };
  },
  explain(p) {
    const full = p.form.startsWith('c-') || p.form.startsWith('?-') ? `${p.c} − ${p.y} = ${p.x}` : `${p.x} + ${p.y} = ${p.c}`;
    return { text: `${full}, so the missing number is ${p.answer}.`, visual: numberLine(0, 20, [p.x, p.c]) };
  },
};
