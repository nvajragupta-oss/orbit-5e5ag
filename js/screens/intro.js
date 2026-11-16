// Level intro: the mascot explains what to do and shows one example.

import { el } from '../lib/dom.js';
import { getPack } from '../packs/index.js';
import { starRow } from '../ui.js';

export function show(root, { packId, levelIndex }, app) {
  const pack = getPack(packId);
  const level = pack.levels[levelIndex];
  const player = app.store.currentPlayer();
  if (!level || !player) return app.go('map');

  app.setTop({ title: `Level ${levelIndex + 1}`, back: () => app.go('map', { packId }) });
  const best = app.store.getStars(player.id, pack.id, level.id);

  root.append(
    el(
      'div',
      { class: 'intro' },
      el('div', { class: 'intro-icon', 'aria-hidden': 'true', text: level.icon }),
      el('h2', { class: 'intro-title', text: level.title }),
      best ? starRow(best, 3, 'small') : null,
      el('div', { class: 'bubble' }, el('span', { class: 'bubble-mascot', 'aria-hidden': 'true', text: '👽' }), el('p', { text: level.intro })),
      level.example ? el('div', { class: 'example' }, el('span', { class: 'example-label', text: 'Example' }), el('span', { class: 'example-text', text: level.example })) : null,
      el('button', { type: 'button', class: 'btn btn-yellow btn-big', text: 'Go! 🚀', onclick: () => app.go('play', { packId, levelIndex }) }),
    ),
  );

  app.speak(level.intro);
}
