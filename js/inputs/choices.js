// Big answer buttons (tap one). Keys 1, 2, 3… also work on a computer.
// buttonInput() is shared with compare.js.

import { el } from '../lib/dom.js';

const COLORS = ['c-cyan', 'c-pink', 'c-green', 'c-purple'];

export function buttonInput(container, options, { onAnswer, format = String, captions = null, keys = null, className = '' }) {
  const buttons = options.map((value, i) =>
    el(
      'button',
      { class: `choice ${COLORS[i % COLORS.length]}`, type: 'button', 'data-value': String(value), onclick: () => onAnswer(value) },
      el('span', { class: 'choice-main', text: format(value) }),
      captions ? el('span', { class: 'choice-cap', text: captions[i] }) : null,
    ),
  );
  const wrap = el('div', { class: `choices ${className}` }, buttons);
  container.append(wrap);

  const onKey = (e) => {
    const i = keys ? keys.indexOf(e.key) : Number(e.key) - 1;
    if (i >= 0 && i < buttons.length && !buttons[i].disabled) {
      e.preventDefault();
      buttons[i].click();
    }
  };
  window.addEventListener('keydown', onKey);
  const find = (v) => buttons.find((b) => b.dataset.value === String(v));

  return {
    markWrong(v) {
      const b = find(v);
      if (b) {
        b.classList.add('wrong');
        b.disabled = true;
      }
    },
    showCorrect(v) {
      find(v)?.classList.add('correct');
    },
    lock() {
      buttons.forEach((b) => (b.disabled = true));
    },
    destroy() {
      window.removeEventListener('keydown', onKey);
    },
  };
}

export default {
  id: 'choices',
  mount(container, { problem, onAnswer, format }) {
    return buttonInput(container, problem.choices, { onAnswer, format });
  },
};
