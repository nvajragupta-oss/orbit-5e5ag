// End of level: stars, score and what to do next.

import { el, wait } from '../lib/dom.js';
import { getPack } from '../packs/index.js';
import { STAR_RULES } from '../config.js';

export function show(root, { packId, levelIndex, stars, firstTry, total, best, improved }, app) {
  const pack = getPack(packId);
  const player = app.store.currentPlayer();
  if (!player) return app.go('players');
  app.setTop({ title: `Level ${levelIndex + 1}`, back: () => app.go('map', { packId }) });

  const hasNext = levelIndex + 1 < pack.levels.length;
  const nextOpen = hasNext && app.store.isUnlocked(player.id, pack, levelIndex + 1);
  const needed = STAR_RULES[STAR_RULES.length - 1].minFirstTry;

  const starEls = [0, 1, 2].map(() => el('span', { class: 'big-star', text: '★' }));
  const headline = stars === 3 ? 'Perfect mission!' : stars > 0 ? 'Mission complete!' : 'Good try!';

  root.append(
    el(
      'div',
      { class: 'results' },
      el('h2', { class: 'results-title', text: headline }),
      el('div', { class: 'big-stars' }, starEls),
      el('p', { class: 'results-score', text: `${firstTry} of ${total} right on the first try` }),
      improved && best > 0 ? el('p', { class: 'badge', text: '🏅 New best!' }) : null,
      stars === 0 ? el('p', { class: 'muted center', text: `Get ${needed} right on the first try to earn a star.` }) : null,
      el(
        'div',
        { class: 'results-actions' },
        nextOpen ? el('button', { type: 'button', class: 'btn btn-yellow btn-big', text: 'Next planet ➜', onclick: () => app.go('intro', { packId, levelIndex: levelIndex + 1 }) }) : null,
        el('button', { type: 'button', class: `btn ${nextOpen ? 'btn-ghost' : 'btn-yellow btn-big'}`, text: '↻ Play again', onclick: () => app.go('play', { packId, levelIndex }) }),
        el('button', { type: 'button', class: 'btn btn-ghost', text: '🪐 Star map', onclick: () => app.go('map', { packId }) }),
      ),
    ),
  );

  (async () => {
    for (let i = 0; i < stars; i++) {
      await wait(450);
      starEls[i].classList.add('on');
      app.sound.star(i);
    }
    if (stars === 3) app.sound.levelUp();
  })();

  let msg;
  if (stars === 3) msg = `Wow, ${player.name}! Three stars! You got ${firstTry} out of ${total}.`;
  else if (stars > 0) msg = `Well done, ${player.name}! You earned ${stars} ${stars === 1 ? 'star' : 'stars'}.${nextOpen ? ' The next planet is open!' : ''}`;
  else msg = `Good try, ${player.name}! Get ${needed} right on the first try to earn a star. Let's practise again!`;
  app.speak(msg);
}
