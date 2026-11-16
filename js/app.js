// App start-up and screen router.
// Screens live in js/screens/*.js and export show(root, params, app).
// show() may return { destroy() } to clean up when leaving the screen.

import { createStore } from './storage.js';
import { initUi, setTop, modal, closeAllModals } from './ui.js';
import { initSpeech, speak, repeatSpeech, stopSpeech, unlockSpeech, setSpeechEnabled, setVoiceName, showSubtitle } from './speech.js';
import { sound } from './sound.js';

import * as start from './screens/start.js';
import * as players from './screens/players.js';
import * as map from './screens/map.js';
import * as intro from './screens/intro.js';
import * as play from './screens/play.js';
import * as results from './screens/results.js';
import * as grownups from './screens/grownups.js';

const SCREENS = { start, players, map, intro, play, results, grownups };

const store = createStore();
const screenEl = document.getElementById('screen');
let current = null;
let currentName = null;
let updateWaiting = false;

const app = {
  store,
  sound,
  speak,
  showSubtitle,
  setTop,
  modal,
  setSpeechEnabled,
  setVoiceName,
  lastPackId: null,
  go,
  unlockAudio() {
    unlockSpeech();
    sound.unlock();
  },
  async checkForUpdates() {
    try {
      const reg = await navigator.serviceWorker?.getRegistration();
      await reg?.update();
    } catch {
      /* offline — fine */
    }
    setTimeout(() => location.reload(), 800);
  },
};

function go(name, params = {}) {
  // A new version was downloaded: switch to it between screens (never in the middle of a level).
  if (updateWaiting && name !== 'play' && name !== 'results') {
    location.reload();
    return;
  }
  stopSpeech();
  closeAllModals();
  current?.destroy?.();
  screenEl.replaceChildren();
  screenEl.className = `screen screen-${name}`;
  screenEl.scrollTop = 0;
  currentName = name;
  current = SCREENS[name].show(screenEl, params, app) || null;
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js').catch(() => {});
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) return; // first install — nothing to refresh
    if (currentName === 'play' || currentName === 'results') updateWaiting = true;
    else location.reload();
  });
}

function boot() {
  const settings = store.settings();
  initUi({ onSpeak: () => repeatSpeech() });
  initSpeech({ subtitle: document.getElementById('subtitle-text'), enabled: settings.voice, voiceName: settings.voiceName });
  sound.setEnabled(settings.sound);
  navigator.storage?.persist?.().catch(() => {});
  registerServiceWorker();
  go('start');
}

boot();
