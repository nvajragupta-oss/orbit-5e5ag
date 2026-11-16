// "Who's playing?" — pick, add or (long-press) delete a player.

import { el, onLongPress } from '../lib/dom.js';
import { PLAYER_AVATARS, PLAYER_COLORS, MAX_PLAYERS, MAX_NAME_LENGTH } from '../config.js';

export function show(root, _params, app) {
  const { store } = app;
  app.setTop({ title: "Who's playing?", back: () => app.go('start') });

  const grid = el('div', { class: 'player-grid' });
  const render = () => {
    grid.replaceChildren(
      ...store.players().map((p) => playerCard(p)),
      store.players().length < MAX_PLAYERS ? el('button', { type: 'button', class: 'player-card add', onclick: () => newPlayer(app, render) }, el('span', { class: 'avatar add-avatar', text: '+' }), el('span', { class: 'player-name', text: 'New player' })) : null,
    );
  };

  const playerCard = (p) => {
    const card = el(
      'button',
      { type: 'button', class: 'player-card', 'aria-label': `Play as ${p.name}` },
      el('span', { class: 'avatar', style: { background: p.color }, text: p.avatar }),
      el('span', { class: 'player-name', text: p.name }),
      el('span', { class: 'player-stars', text: `★ ${store.totalStars(p.id)}` }),
    );
    const wasLong = onLongPress(card, 900, () => confirmDelete(app, p, render), (on) => card.classList.toggle('holding', on));
    card.addEventListener('click', () => {
      if (wasLong()) return;
      store.setCurrentPlayer(p.id);
      app.go('map');
    });
    return card;
  };

  render();

  const grownBtn = el('button', { type: 'button', class: 'btn btn-ghost btn-small grown-btn' }, '🔒 Grown-ups (hold)');
  onLongPress(grownBtn, 1200, () => app.go('grownups'), (on) => grownBtn.classList.toggle('holding', on));

  root.append(el('div', { class: 'players' }, grid, el('p', { class: 'muted small center', text: 'Hold a player to delete them.' }), grownBtn));

  app.speak(store.players().length ? "Who's playing? Tap your name." : "Hello! Tap New player to make your space explorer.");
}

function newPlayer(app, done) {
  let avatar = PLAYER_AVATARS[0];
  let color = PLAYER_COLORS[0];
  const input = el('input', { class: 'name-input', type: 'text', maxlength: MAX_NAME_LENGTH, placeholder: 'Your name', autocomplete: 'off', autocapitalize: 'words', enterkeyhint: 'done' });

  const pick = (items, cls, current, set, render) =>
    el(
      'div',
      { class: `picker ${cls}` },
      items.map((v) =>
        el('button', {
          type: 'button',
          class: `pick ${v === current() ? 'on' : ''}`,
          style: cls === 'colors' ? { background: v } : null,
          text: cls === 'colors' ? '' : v,
          'aria-label': cls === 'colors' ? 'color' : v,
          onclick: (e) => {
            set(v);
            e.currentTarget.parentNode.querySelectorAll('.pick').forEach((b) => b.classList.remove('on'));
            e.currentTarget.classList.add('on');
            render();
          },
        }),
      ),
    );

  const preview = el('span', { class: 'avatar avatar-big' });
  const renderPreview = () => {
    preview.textContent = avatar;
    preview.style.background = color;
  };
  renderPreview();

  const create = (close) => {
    const name = input.value.trim();
    if (!name) {
      input.focus();
      app.speak('Type your name first.');
      return;
    }
    const p = app.store.addPlayer({ name, avatar, color });
    close();
    app.speak(`Welcome, ${p.name}!`);
    done();
  };

  const close = app.modal({
    title: 'New player',
    body: el(
      'div',
      { class: 'new-player' },
      preview,
      input,
      pick(PLAYER_AVATARS, 'avatars', () => avatar, (v) => (avatar = v), renderPreview),
      pick(PLAYER_COLORS, 'colors', () => color, (v) => (color = v), renderPreview),
    ),
    actions: [
      { label: 'Cancel', kind: 'ghost', onClick: (c) => c() },
      { label: 'Create', kind: 'yellow', onClick: (c) => create(c) },
    ],
  });
  input.addEventListener('keydown', (e) => e.key === 'Enter' && create(close));
  setTimeout(() => input.focus(), 50);
  app.speak('What is your name?');
}

function confirmDelete(app, p, done) {
  app.modal({
    title: `Delete ${p.name}?`,
    body: el('p', { class: 'center', text: `All of ${p.name}'s stars will be lost on this device.` }),
    actions: [
      { label: 'Keep', kind: 'ghost', onClick: (c) => c() },
      {
        label: 'Delete',
        kind: 'danger',
        onClick: (c) => {
          app.store.removePlayer(p.id);
          c();
          done();
        },
      },
    ],
  });
}
