// Reusable math pictures (no image files — just DOM + CSS + a little SVG).
// Every builder returns a DOM node. Styles live in css/style.css under "Visuals".

import { el } from './dom.js';

/**
 * A row of big equation tokens. '?' becomes the answer slot that fills in
 * as the child types or when the answer is shown.
 *   equation([47, '+', 38, '=', '?'])
 */
export function equation(tokens) {
  return el(
    'div',
    { class: 'eq' },
    tokens.map((t) => (t === '?' ? el('span', { class: 'slot', text: '?' }) : el('span', { class: isOp(t) ? 'op' : 'num', text: String(t) }))),
  );
}
const isOp = (t) => ['+', '−', '×', '÷', '=', '<', '>'].includes(t);

/** Ten-frames: rows of 10 dots (5 × 2) with n dots filled. */
export function tenFrames(n, color = 'yellow') {
  const frames = Math.max(1, Math.ceil(n / 10));
  return el(
    'div',
    { class: 'tf-row' },
    Array.from({ length: frames }, (_, f) =>
      el('div', { class: 'tf' }, Array.from({ length: 10 }, (_, i) => el('i', { class: f * 10 + i < n ? `on ${color}` : '' }))),
    ),
  );
}

/** Base-ten blocks: `tens` rods of ten and `ones` single cubes. */
export function blocks(tens, ones, label = true) {
  const words = `${tens} ${tens === 1 ? 'ten' : 'tens'} · ${ones} ${ones === 1 ? 'one' : 'ones'}`;
  return el(
    'div',
    { class: 'blocks', 'aria-label': words },
    el(
      'div',
      { class: 'blocks-vis' },
      el('div', { class: 'rods' }, Array.from({ length: tens }, () => el('div', { class: 'rod' }, Array.from({ length: 10 }, () => el('i'))))),
      ones > 0 ? el('div', { class: 'cubes' }, Array.from({ length: ones }, () => el('i', { class: 'cube' }))) : null,
    ),
    label ? el('div', { class: 'blocks-label', text: words }) : null,
  );
}

/** Two numbers as blocks side by side, e.g. for 47 + 38. */
export function blocksPair(a, b, op = '+') {
  return el(
    'div',
    { class: 'pair' },
    blocks(Math.floor(a / 10), a % 10),
    el('span', { class: 'pair-op', text: op }),
    blocks(Math.floor(b / 10), b % 10),
  );
}

/** A number line from `from` to `to`; `marks` are highlighted. */
export function numberLine(from, to, marks = []) {
  const cells = [];
  for (let n = from; n <= to; n++) cells.push(el('span', { class: marks.includes(n) ? 'nl-cell mark' : 'nl-cell', text: String(n) }));
  return el('div', { class: 'nl' }, cells);
}

/** `count` circles, each holding `size` emoji. */
export function groups(count, size, emoji = '⭐') {
  return el(
    'div',
    { class: 'groups' },
    Array.from({ length: count }, () => el('div', { class: 'group' }, Array.from({ length: size }, () => el('span', { text: emoji })))),
  );
}

/** Grid of dots: rows × cols (for times tables). */
export function dotArray(rows, cols) {
  return el(
    'div',
    { class: 'arr', style: { gridTemplateColumns: `repeat(${cols}, 1fr)` }, 'aria-label': `${rows} rows of ${cols}` },
    Array.from({ length: rows * cols }, () => el('i')),
  );
}

/** A wrapped row of n emoji. */
export function emojiRow(n, emoji) {
  return el('div', { class: 'emoji-row' }, Array.from({ length: n }, () => el('span', { text: emoji })));
}

/** Analog clock face (SVG) showing h:m. */
export function clockFace(h, m) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 200 200');
  svg.setAttribute('class', 'clock');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Clock');
  const add = (tag, attrs) => {
    const n = document.createElementNS(ns, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    svg.append(n);
    return n;
  };
  add('circle', { cx: 100, cy: 100, r: 94, class: 'clock-face' });
  for (let i = 0; i < 60; i++) {
    const a = (i * 6 * Math.PI) / 180;
    const big = i % 5 === 0;
    const r1 = big ? 80 : 86;
    add('line', {
      x1: 100 + r1 * Math.sin(a), y1: 100 - r1 * Math.cos(a),
      x2: 100 + 90 * Math.sin(a), y2: 100 - 90 * Math.cos(a),
      class: big ? 'tick big' : 'tick',
    });
  }
  for (let n = 1; n <= 12; n++) {
    const a = (n * 30 * Math.PI) / 180;
    const t = add('text', { x: 100 + 66 * Math.sin(a), y: 100 - 66 * Math.cos(a) + 7, class: 'clock-num', 'text-anchor': 'middle' });
    t.textContent = String(n);
  }
  const hourA = (((h % 12) + m / 60) * 30 * Math.PI) / 180;
  const minA = (m * 6 * Math.PI) / 180;
  add('line', { x1: 100, y1: 100, x2: 100 + 44 * Math.sin(hourA), y2: 100 - 44 * Math.cos(hourA), class: 'hand hour' });
  add('line', { x1: 100, y1: 100, x2: 100 + 72 * Math.sin(minA), y2: 100 - 72 * Math.cos(minA), class: 'hand minute' });
  add('circle', { cx: 100, cy: 100, r: 6, class: 'clock-pin' });
  return svg;
}

/** Small caption under a picture. */
export function caption(text) {
  return el('p', { class: 'caption', text });
}
