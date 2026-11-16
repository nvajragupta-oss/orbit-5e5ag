// Star map: each level is a planet. Locked planets show a 🔒.

import { el } from '../lib/dom.js';
import { PACKS, getPack } from '../packs/index.js';
import { PLANET_COLORS, STARS_TO_UNLOCK_NEXT } from '../config.js';
import { starRow } from '../ui.js';

export function show(root, params, app) {
  const { store } = app;
  const player = store.currentPlayer();
  if (!player) return app.go('players');

  const pack = getPack(params.packId || app.lastPackId);
  app.lastPackId = pack.id;
  app.setTop({ title: `${player.avatar} ${player.name}`, back: () => app.go('players') });

  // Pack switcher (only when there is more than one pack).
  const packIndex = PACKS.indexOf(pack);
  const switcher =
    PACKS.length > 1
      ? el(
          'div',
          { class: 'pack-switch' },
          el('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Previous pack', disabled: packIndex === 0, onclick: () => app.go('map', { packId: PACKS[packIndex - 1].id }) }, '◀'),
          el('span', { class: 'pack-title', text: pack.title }),
          el('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Next pack', disabled: packIndex === PACKS.length - 1, onclick: () => app.go('map', { packId: PACKS[packIndex + 1].id }) }, '▶'),
        )
      : el('div', { class: 'pack-switch' }, el('span', { class: 'pack-title', text: pack.title }), el('span', { class: 'pack-sub', text: pack.subtitle || '' }));

  const total = pack.levels.reduce((s, l) => s + store.getStars(player.id, pack.id, l.id), 0);

  // The level to play next: first unlocked one without stars.
  let nextIndex = pack.levels.findIndex((l, i) => store.isUnlocked(player.id, pack, i) && store.getStars(player.id, pack.id, l.id) === 0);

  const levels = pack.levels.map((level, i) => {
    const unlocked = store.isUnlocked(player.id, pack, i);
    const stars = store.getStars(player.id, pack.id, level.id);
    const color = PLANET_COLORS[i % PLANET_COLORS.length];
    return el(
      'button',
      {
        type: 'button',
        class: `level ${unlocked ? '' : 'locked'} ${i === nextIndex ? 'current' : ''}`,
        'aria-label': `Level ${i + 1}: ${level.title}${unlocked ? `, ${stars} stars` : ', locked'}`,
        onclick: () => {
          if (unlocked) app.go('intro', { packId: pack.id, levelIndex: i });
          else app.speak(`Get ${STARS_TO_UNLOCK_NEXT === 1 ? 'a star' : `${STARS_TO_UNLOCK_NEXT} stars`} on planet ${i} to open this one.`);
        },
      },
      el(
        'span',
        { class: 'planet', style: { '--planet': color } },
        el('span', { class: 'planet-icon', text: unlocked ? level.icon : '🔒' }),
        el('span', { class: 'planet-num', text: String(i + 1) }),
        i === nextIndex ? el('span', { class: 'orbit', 'aria-hidden': 'true', text: '🚀' }) : null,
      ),
      el('span', { class: 'level-title', text: level.title }),
      starRow(stars),
    );
  });

  root.append(
    el(
      'div',
      { class: 'map' },
      switcher,
      el('p', { class: 'map-total', text: `★ ${total} of ${pack.levels.length * 3}` }),
      el('div', { class: 'map-grid' }, levels),
    ),
  );

  root.querySelector('.level.current')?.scrollIntoView({ block: 'center', behavior: 'instant' });

  if (nextIndex === -1) app.speak(`Amazing, ${player.name}! Every planet has stars. Can you get three stars on all of them?`);
  else if (nextIndex === 0 && total === 0) app.speak(`Hi ${player.name}! Tap the first planet to start your space mission.`);
  else app.speak(`Pick a planet, ${player.name}! Planet ${nextIndex + 1} is waiting for you.`);
}
