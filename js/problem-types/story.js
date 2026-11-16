// Two-step story problems, read aloud.
// Each template returns { text, answer, steps }. Easy stage: + and − with smaller numbers.
// Hard stage: bigger numbers and some × / ÷ steps.
// To add a story: push a new function into EASY or HARD below.

import { sample } from '../lib/rng.js';
import { equation } from '../lib/visuals.js';
import { el } from '../lib/dom.js';

const EASY = [
  (r) => {
    const [a, b, c] = sample(() => [r.int(10, 20), r.int(2, 9), r.int(2, 9)], ([a, b]) => a - b > 0);
    return { icon: '🚀', text: `A rocket has ${a} fuel cans. It uses ${b}, then picks up ${c} more. How many fuel cans does it have now?`, answer: a - b + c, steps: [`${a} − ${b} = ${a - b}`, `${a - b} + ${c} = ${a - b + c}`] };
  },
  (r) => {
    const [a, b, c] = sample(() => [r.int(8, 18), r.int(2, 9), r.int(2, 9)], ([a, b, c]) => a + b - c > 0);
    return { icon: '🛰️', text: `There are ${a} astronauts on the space station. ${b} more arrive, then ${c} fly home. How many astronauts are on the station now?`, answer: a + b - c, steps: [`${a} + ${b} = ${a + b}`, `${a + b} − ${c} = ${a + b - c}`] };
  },
  (r) => {
    const [a, b, c] = sample(() => [r.int(5, 15), r.int(3, 12), r.int(2, 9)], ([a, b, c]) => a + b - c > 0);
    return { icon: '👽', text: `Zip the alien finds ${a} moon rocks on Monday and ${b} on Tuesday. Zip gives ${c} to a friend. How many moon rocks does Zip have left?`, answer: a + b - c, steps: [`${a} + ${b} = ${a + b}`, `${a + b} − ${c} = ${a + b - c}`] };
  },
  (r) => {
    const [a, b, c] = sample(() => [r.int(15, 30), r.int(2, 9), r.int(2, 9)], ([a, b, c]) => a - b - c > 0);
    return { icon: '🍪', text: `The space shop has ${a} space cookies. Astronauts eat ${b} on Monday and ${c} on Tuesday. How many cookies are left?`, answer: a - b - c, steps: [`${a} − ${b} = ${a - b}`, `${a - b} − ${c} = ${a - b - c}`] };
  },
  (r) => {
    const [a, b, c] = sample(() => [r.int(6, 15), r.int(3, 9), r.int(2, 9)], ([a, b, c]) => a + b + c <= 30);
    return { icon: '🌕', text: `A planet has ${a} craters. A meteor shower makes ${b} more, and then ${c} more. How many craters are there now?`, answer: a + b + c, steps: [`${a} + ${b} = ${a + b}`, `${a + b} + ${c} = ${a + b + c}`] };
  },
];

const HARD = [
  (r) => {
    const [a, b, c] = sample(() => [r.int(30, 70), r.int(8, 25), r.int(8, 25)], ([a, b]) => a - b > 0);
    return { icon: '🚀', text: `A rocket has ${a} fuel cans. It uses ${b}, then picks up ${c} more. How many fuel cans does it have now?`, answer: a - b + c, steps: [`${a} − ${b} = ${a - b}`, `${a - b} + ${c} = ${a - b + c}`] };
  },
  (r) => {
    const [n, k, c] = sample(() => [r.int(2, 5), r.pick([2, 3, 4, 5, 10]), r.int(3, 15)], () => true);
    return { icon: '🧑‍🚀', text: `${n} rockets each carry ${k} astronauts. Then ${c} more astronauts join them. How many astronauts are there in all?`, answer: n * k + c, steps: [`${n} × ${k} = ${n * k}`, `${n * k} + ${c} = ${n * k + c}`] };
  },
  (r) => {
    const [w, c] = sample(() => [r.int(4, 10), r.int(2, 9)], ([w, c]) => w * 2 - c > 0);
    return { icon: '🪟', text: `A spaceship has ${w} windows on each side. It has 2 sides. ${c} windows are dirty. How many windows are clean?`, answer: w * 2 - c, steps: [`${w} × 2 = ${w * 2}`, `${w * 2} − ${c} = ${w * 2 - c}`] };
  },
  (r) => {
    const [a, b] = sample(() => [r.int(8, 30), r.int(4, 20)], ([a, b]) => (a + b) % 2 === 0);
    return { icon: '⭐', text: `Luna has ${a} star stickers and gets ${b} more. Luna shares them equally with a friend. How many stickers does each get?`, answer: (a + b) / 2, steps: [`${a} + ${b} = ${a + b}`, `${a + b} ÷ 2 = ${(a + b) / 2}`] };
  },
  (r) => {
    const [a, b, c] = sample(() => [r.int(50, 99), r.int(10, 30), r.int(10, 30)], ([a, b, c]) => a - b - c > 0);
    return { icon: '🍪', text: `The space shop has ${a} space cookies. Astronauts eat ${b} on Monday and ${c} on Tuesday. How many cookies are left?`, answer: a - b - c, steps: [`${a} − ${b} = ${a - b}`, `${a - b} − ${c} = ${a - b - c}`] };
  },
  (r) => {
    const [p, each, extra] = sample(() => [r.int(2, 5), r.int(3, 10), r.int(2, 9)], () => true);
    return { icon: '🪐', text: `${p * each} moon rocks are shared equally by ${p} aliens. Each alien then finds ${extra} more. How many moon rocks does each alien have now?`, answer: each + extra, steps: [`${p * each} ÷ ${p} = ${each}`, `${each} + ${extra} = ${each + extra}`] };
  },
];

export default {
  id: 'story',
  generate({ stage, rng }) {
    const s = rng.pick(stage === 0 ? EASY : HARD)(rng);
    return { key: s.text, ...s, say: s.text };
  },
  render(p) {
    return el('div', { class: 'story' }, el('div', { class: 'story-icon', text: p.icon }), el('p', { class: 'story-text', text: p.text }), equation(['?']));
  },
  hint(p) {
    return { text: `Do it in two steps. First: ${p.steps[0].split('=')[0].trim()}. Then use that answer for the next step.`, visual: null };
  },
  explain(p) {
    return { text: `First: ${p.steps[0]}. Then: ${p.steps[1]}.`, visual: null };
  },
};
