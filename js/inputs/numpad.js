// On-screen number pad. What the child types appears in the '?' slot (via onPreview).
// Keyboard: digits, Backspace, Enter.

import { el } from '../lib/dom.js';

const MAX_DIGITS = 4;

export default {
  id: 'numpad',
  mount(container, { onAnswer, onPreview, sound }) {
    let value = '';
    let locked = false;
    const update = () => onPreview(value);

    const press = (k) => {
      if (locked) return;
      sound?.tap();
      if (k === 'del') value = value.slice(0, -1);
      else if (k === 'ok') {
        if (value !== '') onAnswer(Number(value));
        return;
      } else if (value.length < MAX_DIGITS) value = value === '0' ? k : value + k;
      update();
      okBtn.disabled = value === '';
    };

    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok'];
    const label = { del: '⌫', ok: '✓' };
    const aria = { del: 'Delete', ok: 'Check answer' };
    const buttons = keys.map((k) =>
      el('button', { type: 'button', class: `key ${k === 'ok' ? 'key-ok' : k === 'del' ? 'key-del' : ''}`, 'aria-label': aria[k] || k, onclick: () => press(k) }, label[k] || k),
    );
    const okBtn = buttons[buttons.length - 1];
    okBtn.disabled = true;
    container.append(el('div', { class: 'numpad' }, buttons));

    const onKey = (e) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') press('del');
      else if (e.key === 'Enter') press('ok');
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);

    return {
      markWrong() {
        value = '';
        update();
        okBtn.disabled = true;
      },
      showCorrect(answer) {
        onPreview(String(answer));
      },
      lock() {
        locked = true;
        buttons.forEach((b) => (b.disabled = true));
      },
      destroy() {
        window.removeEventListener('keydown', onKey);
      },
    };
  },
};
