// Shared screen parts: top bar, pop-up dialogs, star rows, starry sky.

import { el } from './lib/dom.js';

let titleEl;
let backBtn;
let speakBtn;
let modalRoot;
let backHandler = null;

export function initUi({ onSpeak }) {
  titleEl = document.getElementById('title');
  backBtn = document.getElementById('btn-back');
  speakBtn = document.getElementById('btn-speak');
  modalRoot = document.getElementById('modal-root');
  backBtn.addEventListener('click', () => backHandler?.());
  speakBtn.addEventListener('click', onSpeak);
  document.getElementById('subtitle').addEventListener('click', onSpeak);
  makeSky(document.getElementById('sky'));
}

/** Configure the top bar for the current screen. */
export function setTop({ title = '', back = null, speak = true, hidden = false } = {}) {
  document.body.classList.toggle('no-top', hidden);
  titleEl.textContent = title;
  backHandler = back;
  backBtn.style.visibility = back ? 'visible' : 'hidden';
  speakBtn.style.visibility = speak ? 'visible' : 'hidden';
}

/**
 * Pop-up dialog.
 * actions: [{ label, kind: 'yellow'|'ghost'|'danger', onClick(close) }]
 * Returns close().
 */
export function modal({ title, body = null, actions = [] }) {
  const close = () => {
    overlay.remove();
    window.removeEventListener('keydown', onKey);
  };
  const onKey = (e) => e.key === 'Escape' && close();
  const overlay = el(
    'div',
    { class: 'modal-overlay', onclick: (e) => e.target === overlay && close() },
    el(
      'div',
      { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
      el('h2', { class: 'modal-title', text: title }),
      body,
      el(
        'div',
        { class: 'modal-actions' },
        actions.map((a) => el('button', { type: 'button', class: `btn btn-${a.kind || 'yellow'}`, text: a.label, onclick: () => a.onClick(close) })),
      ),
    ),
  );
  modalRoot.append(overlay);
  window.addEventListener('keydown', onKey);
  return close;
}

export function closeAllModals() {
  modalRoot?.replaceChildren();
}

/** ★★☆ row. */
export function starRow(count, max = 3, cls = '') {
  return el(
    'div',
    { class: `star-row ${cls}`, 'aria-label': `${count} of ${max} stars` },
    Array.from({ length: max }, (_, i) => el('span', { class: i < count ? 'on' : '', text: '★' })),
  );
}

function makeSky(sky) {
  const n = window.innerWidth > 900 ? 90 : 55;
  for (let i = 0; i < n; i++) {
    const size = Math.random() < 0.15 ? 3 : Math.random() < 0.5 ? 2 : 1;
    sky.append(
      el('i', {
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${(Math.random() * 4).toFixed(2)}s`,
          animationDuration: `${(2.5 + Math.random() * 3).toFixed(2)}s`,
        },
      }),
    );
  }
}
