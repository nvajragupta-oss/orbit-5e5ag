// Sharing equally — the first step to division.
// "12 stars shared by 3 rockets. How many each?"  Hard stage also shows 12 ÷ 3 = ?

import { equation, emojiRow, groups } from '../lib/visuals.js';
import { el } from '../lib/dom.js';

export default {
  id: 'share',
  generate({ stage, rng }) {
    const people = stage === 0 ? rng.int(2, 3) : rng.int(2, 5);
    const each = stage === 0 ? rng.int(2, 5) : rng.int(3, 10);
    const total = people * each;
    return {
      key: `${total}/${people}`, total, people, each, answer: each, showSymbol: stage === 1,
      say: `${total} stars are shared equally between ${people} rockets. How many stars does each rocket get?`,
    };
  },
  render(p) {
    return el(
      'div',
      { class: 'stack' },
      emojiRow(p.total, '⭐'),
      emojiRow(p.people, '🚀'),
      el('p', { class: 'prompt', text: `${p.total} stars shared by ${p.people} rockets. How many each?` }),
      equation(p.showSymbol ? [p.total, '÷', p.people, '=', '?'] : ['?']),
    );
  },
  hint(p) {
    return { text: `Give 1 star to each rocket, again and again, until none are left. Or think: ${p.people} × ? = ${p.total}.`, visual: null };
  },
  explain(p) {
    return { text: `Each rocket gets ${p.each}. ${p.people} × ${p.each} = ${p.total}, so ${p.total} ÷ ${p.people} = ${p.each}.`, visual: groups(p.people, p.each, '⭐') };
  },
};
