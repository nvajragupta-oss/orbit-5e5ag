// Grown-ups page: short guide, install help, settings, players, version/updates.

import { el } from '../lib/dom.js';
import { APP_VERSION, APP_NAME, QUESTIONS_PER_LEVEL, STAR_RULES } from '../config.js';
import { englishVoices, speechSupported } from '../speech.js';
import { PACKS } from '../packs/index.js';

function platform() {
  const ua = navigator.userAgent;
  const iOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (iOS) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}
const isInstalled = () => window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone === true;

const INSTALL = {
  ios: ['Open this app in Safari.', 'Tap the Share button (square with an arrow).', 'Tap "Add to Home Screen", then "Add".', 'Open it from the Home Screen once while online. After that it works offline.'],
  android: ['Open this app in Chrome.', 'Tap the ⋮ menu.', 'Tap "Install app" or "Add to Home screen".', 'Open it once while online. After that it works offline.'],
  desktop: ['Chrome / Edge: click the install icon in the address bar (or ⋮ → Cast, save and share → Install).', 'Safari on Mac: File → Add to Dock.', 'Open it once while online. After that it works offline.'],
};

export function show(root, _params, app) {
  const { store } = app;
  app.setTop({ title: 'Grown-ups', back: () => app.go('players'), speak: false });
  app.showSubtitle('Settings and help for parents and teachers.');

  const section = (title, ...children) => el('details', { class: 'gu-section' }, el('summary', { text: title }), el('div', { class: 'gu-body' }, children));
  const toggle = (label, key, apply) => {
    const box = el('input', { type: 'checkbox', checked: store.settings()[key] });
    box.addEventListener('change', () => {
      store.updateSettings({ [key]: box.checked });
      apply(box.checked);
    });
    return el('label', { class: 'gu-toggle' }, box, el('span', { text: label }));
  };

  // Voice picker
  const voiceSelect = el('select', { class: 'gu-select', 'aria-label': 'Voice' });
  const fillVoices = () => {
    const voices = englishVoices();
    const current = store.settings().voiceName;
    voiceSelect.replaceChildren(el('option', { value: '', text: 'Automatic (best available)' }), ...voices.map((v) => el('option', { value: v.name, text: `${v.name} (${v.lang})`, selected: v.name === current })));
  };
  fillVoices();
  window.speechSynthesis?.addEventListener?.('voiceschanged', fillVoices);
  voiceSelect.addEventListener('change', () => {
    store.updateSettings({ voiceName: voiceSelect.value || null });
    app.setVoiceName(voiceSelect.value || null);
    app.speak('Hello! This is my space voice.');
  });

  // Offline status
  const offline = el('p', { class: 'gu-status' });
  const updateStatus = () => {
    const ready = !!navigator.serviceWorker?.controller;
    offline.textContent = ready ? '✅ Ready to play offline on this device.' : '⚠️ Not ready for offline yet. Open the app from its https link (or localhost) while online, then reload once.';
  };
  updateStatus();

  // Players
  const playersList = el('div', { class: 'gu-players' });
  const renderPlayers = () => {
    const players = store.players();
    playersList.replaceChildren(
      ...(players.length
        ? players.map((p) =>
            el(
              'div',
              { class: 'gu-player' },
              el('span', { class: 'avatar avatar-small', style: { background: p.color }, text: p.avatar }),
              el('span', { class: 'gu-player-name', text: `${p.name} — ★ ${store.totalStars(p.id)}` }),
              el('button', { type: 'button', class: 'btn btn-ghost btn-small', text: 'Reset stars', onclick: () => confirm(`Reset all stars for ${p.name}?`, () => store.resetProgress(p.id)) }),
              el('button', { type: 'button', class: 'btn btn-danger btn-small', text: 'Delete', onclick: () => confirm(`Delete ${p.name}?`, () => store.removePlayer(p.id)) }),
            ),
          )
        : [el('p', { class: 'muted', text: 'No players yet.' })]),
    );
  };
  const confirm = (title, action) =>
    app.modal({
      title,
      body: el('p', { class: 'center', text: 'This cannot be undone.' }),
      actions: [
        { label: 'Cancel', kind: 'ghost', onClick: (c) => c() },
        { label: 'Yes', kind: 'danger', onClick: (c) => { action(); c(); renderPlayers(); } },
      ],
    });
  renderPlayers();

  const levelsList = el('ol', { class: 'gu-levels' }, PACKS.flatMap((pack) => pack.levels.map((l) => el('li', { text: `${l.title} — ${l.example}` }))));

  const pf = platform();
  root.append(
    el(
      'div',
      { class: 'grownups' },
      el('p', { class: 'gu-intro', text: `${APP_NAME} is a math practice game for ages 7–8+. It works offline once installed. Progress is saved on this device only.` }),
      section(
        'How it works',
        el('p', { text: `Each level has ${QUESTIONS_PER_LEVEL} questions. The first half are easier, the second half harder.` }),
        el('p', { text: `Stars count answers right on the first try: ${STAR_RULES.map((r) => `${r.minFirstTry}+ = ${'★'.repeat(r.stars)}`).join(', ')}. One star opens the next planet.` }),
        el('p', { text: 'A wrong answer shows a hint and gives a second try. After two misses the game explains the answer and moves on.' }),
        el('p', { text: 'Everything is read aloud and shown as subtitles. Tap 🔊 or the subtitle bar to hear it again.' }),
        levelsList,
      ),
      section(
        'Install on this device',
        el('p', { class: 'gu-status', text: isInstalled() ? '✅ Running as an installed app.' : 'Not installed yet — follow the steps below.' }),
        el('ol', {}, INSTALL[pf].map((s) => el('li', { text: s }))),
        el('p', { class: 'muted small', text: 'Full step-by-step guide for every device (and free hosting): see USER_MANUAL.md in the app folder.' }),
      ),
      section(
        'Sound & voice',
        toggle('Read aloud (voice)', 'voice', (on) => app.setSpeechEnabled(on)),
        toggle('Sound effects', 'sound', (on) => app.sound.setEnabled(on)),
        speechSupported() ? el('label', { class: 'gu-field' }, el('span', { text: 'Voice' }), voiceSelect) : el('p', { class: 'muted', text: 'This browser has no built-in voice. Subtitles still show.' }),
        el('button', { type: 'button', class: 'btn btn-ghost btn-small', text: '▶ Test voice', onclick: () => app.speak('Three, two, one, blast off!') }),
        el('p', { class: 'muted small', text: 'iPhone/iPad: no voice? Check the silent switch and volume. Nicer voices: Settings → Accessibility → Spoken Content → Voices → English (download e.g. "Samantha (Enhanced)").' }),
      ),
      section('Players', playersList),
      section(
        'Offline & updates',
        offline,
        el('p', { text: `Version ${APP_VERSION}` }),
        el('button', {
          type: 'button',
          class: 'btn btn-ghost btn-small',
          text: '⟳ Check for updates',
          onclick: async (e) => {
            e.currentTarget.textContent = 'Checking…';
            await app.checkForUpdates();
          },
        }),
      ),
    ),
  );
}
