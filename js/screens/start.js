// Splash screen. The "Start" tap also unlocks sound and speech (needed on iPhone/iPad).

import { el } from '../lib/dom.js';
import { APP_NAME } from '../config.js';

export function show(root, _params, app) {
  app.setTop({ hidden: true });
  root.append(
    el(
      'div',
      { class: 'start' },
      el('div', { class: 'start-rocket', 'aria-hidden': 'true', text: '🚀' }),
      el('h1', { class: 'logo', text: APP_NAME }),
      el('p', { class: 'tagline', text: 'Blast off with numbers!' }),
      el('button', {
        type: 'button',
        class: 'btn btn-yellow btn-big',
        text: 'Start',
        onclick: () => {
          app.unlockAudio();
          app.go('players');
        },
      }),
    ),
  );
}
