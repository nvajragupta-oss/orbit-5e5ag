// Place value. Easy stage: count base-ten blocks (4 rods + 7 cubes = 47).
// Hard stage: regrouping (5 tens and 13 ones = 63) or 3-digit expanded form (400 + 60 + 2).

import { equation, blocks } from '../lib/visuals.js';
import { numberChoices } from '../lib/distractors.js';
import { el } from '../lib/dom.js';

export default {
  id: 'place-value',
  generate({ stage, rng }) {
    if (stage === 0) {
      const tens = rng.int(1, 9);
      const ones = rng.int(0, 9);
      return { key: `b${tens}-${ones}`, form: 'blocks', tens, ones, answer: tens * 10 + ones, say: 'How many altogether? Each rod is ten.' };
    }
    if (rng.chance(0.5)) {
      const tens = rng.int(2, 7);
      const ones = rng.int(10, 16);
      return { key: `r${tens}-${ones}`, form: 'regroup', tens, ones, answer: tens * 10 + ones, say: `${tens} tens and ${ones} ones. What number is that?` };
    }
    const h = rng.int(1, 9);
    const t = rng.int(0, 9);
    const o = rng.int(1, 9);
    const parts = [h * 100, t * 10, o].filter((v) => v > 0);
    return { key: `e${h}${t}${o}`, form: 'expanded', h, t, o, parts, answer: h * 100 + t * 10 + o, say: `What is ${parts.join(' plus ')}?` };
  },
  render(p) {
    if (p.form === 'blocks') return el('div', { class: 'stack' }, blocks(p.tens, p.ones, false), equation(['?']));
    if (p.form === 'regroup') return el('div', { class: 'stack' }, el('p', { class: 'prompt', text: `${p.tens} tens and ${p.ones} ones` }), blocks(p.tens, p.ones, false), equation(['=', '?']));
    return equation([...p.parts.flatMap((v, i) => (i ? ['+', v] : [v])), '=', '?']);
  },
  choices(p, rng) {
    const mistakes = [];
    if (p.form === 'blocks' && p.ones > 0) mistakes.push(p.ones * 10 + p.tens); // swapped digits
    if (p.form === 'regroup') mistakes.push(p.tens * 10 + (p.ones % 10), Number(`${p.tens}${p.ones}`)); // forgot to regroup
    if (p.form === 'expanded') mistakes.push(p.h * 100 + p.o * 10 + p.t, p.h * 10 + p.t + p.o);
    return numberChoices(p.answer, rng, { mistakes, offsets: [10, 1, 100] });
  },
  hint(p) {
    if (p.form === 'blocks') return { text: 'Count the rods by tens: 10, 20, 30… then count the little cubes.', visual: null };
    if (p.form === 'regroup') return { text: `${p.ones} ones is 1 ten and ${p.ones - 10} ones. So you have ${p.tens + 1} tens.`, visual: null };
    return { text: 'Hundreds go first, then tens, then ones.', visual: null };
  },
  explain(p) {
    if (p.form === 'blocks') return { text: `${p.tens} tens is ${p.tens * 10}, plus ${p.ones} ones makes ${p.answer}.`, visual: blocks(p.tens, p.ones) };
    if (p.form === 'regroup') return { text: `${p.ones} ones = 1 ten and ${p.ones - 10} ones. ${p.tens + 1} tens and ${p.ones - 10} ones is ${p.answer}.`, visual: blocks(p.tens + 1, p.ones - 10) };
    return { text: `${p.h} hundreds, ${p.t} tens and ${p.o} ones make ${p.answer}.`, visual: null };
  },
};
