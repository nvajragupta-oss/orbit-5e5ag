// Equal groups — the first step to multiplication.
// "3 groups of 4 = ?" with pictures. Easy: 2–3 small groups. Hard: 3–5 bigger groups.

import { equation, groups } from '../lib/visuals.js';
import { numberChoices } from '../lib/distractors.js';
import { el } from '../lib/dom.js';

const EMOJI = ['⭐', '🌙', '🪐', '👽', '🚀'];

export default {
  id: 'groups',
  generate({ stage, rng }) {
    const count = stage === 0 ? rng.int(2, 3) : rng.int(3, 5);
    const size = stage === 0 ? rng.int(2, 5) : rng.int(3, 6);
    const emoji = rng.pick(EMOJI);
    return { key: `${count}x${size}`, count, size, emoji, answer: count * size, say: `${count} groups of ${size}. How many altogether?` };
  },
  render(p) {
    return el('div', { class: 'stack' }, groups(p.count, p.size, p.emoji), el('p', { class: 'prompt', text: `${p.count} groups of ${p.size}` }), equation(['?']));
  },
  choices(p, rng) {
    return numberChoices(p.answer, rng, { mistakes: [p.count + p.size, p.answer + p.size, p.answer - p.size], offsets: [1, 2] });
  },
  hint(p) {
    return { text: `Add ${p.size}, ${p.count} times: ${Array(p.count).fill(p.size).join(' + ')}.`, visual: null };
  },
  explain(p) {
    return { text: `${Array(p.count).fill(p.size).join(' + ')} = ${p.answer}. So ${p.count} × ${p.size} = ${p.answer}.`, visual: null };
  },
};
