// Read-aloud with the device's built-in voice (works offline) + subtitles.
// Everything spoken is also shown as text in the subtitle bar.

import { SPEECH, PREFERRED_VOICES } from './config.js';

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
let enabled = true;
let preferredName = null;
let voice = null;
let lastText = '';
let subtitleEl = null;
let current = null; // keep a reference so the browser doesn't drop the utterance early

export function englishVoices() {
  if (!synth) return [];
  return synth.getVoices().filter((v) => v.lang && v.lang.toLowerCase().startsWith(SPEECH.lang));
}

function chooseVoice() {
  const voices = englishVoices();
  if (!voices.length) return null;
  if (preferredName) {
    const v = voices.find((x) => x.name === preferredName);
    if (v) return v;
  }
  for (const name of PREFERRED_VOICES) {
    const v = voices.find((x) => x.name.startsWith(name) && x.localService !== false);
    if (v) return v;
  }
  return voices.find((v) => v.localService) || voices[0];
}

export function initSpeech({ subtitle, enabled: on = true, voiceName = null }) {
  subtitleEl = subtitle;
  enabled = on;
  preferredName = voiceName;
  if (!synth) return;
  voice = chooseVoice();
  synth.addEventListener?.('voiceschanged', () => {
    voice = chooseVoice();
  });
}

export const speechSupported = () => !!synth;

export function setSpeechEnabled(on) {
  enabled = on;
  if (!on) stopSpeech();
}

export function setVoiceName(name) {
  preferredName = name;
  voice = chooseVoice();
}

export function showSubtitle(text) {
  if (subtitleEl) subtitleEl.textContent = text;
}

/** Speak text and show it as a subtitle. Resolves when finished (or right away if muted). */
export function speak(text) {
  lastText = text;
  showSubtitle(text);
  if (!enabled || !synth || !text) return Promise.resolve();
  const u = new SpeechSynthesisUtterance(forSpeech(text));
  if (voice) u.voice = voice;
  u.lang = voice?.lang || 'en-US';
  u.rate = SPEECH.rate;
  u.pitch = SPEECH.pitch;
  current = u;
  return new Promise((resolve) => {
    const done = () => {
      if (current === u) current = null;
      resolve();
    };
    u.onend = done;
    u.onerror = done;
    // Safari sometimes drops an utterance queued right after cancel(); a short gap avoids it.
    if (synth.speaking || synth.pending) {
      synth.cancel();
      setTimeout(() => synth.speak(u), 80);
    } else {
      synth.speak(u);
    }
  });
}

export function repeatSpeech() {
  return speak(lastText);
}

export function stopSpeech() {
  synth?.cancel();
}

/** iOS only allows speech after a tap — call this from the first tap. */
export function unlockSpeech() {
  if (!synth) return;
  const u = new SpeechSynthesisUtterance(' ');
  u.volume = 0;
  synth.speak(u);
}

/** Make symbols sound right. */
function forSpeech(text) {
  return text
    .replace(/(\d+):00\b/g, "$1 o'clock")
    .replace(/(\d+):(\d\d)\b/g, '$1 $2')
    .replace(/−/g, ' minus ')
    .replace(/×/g, ' times ')
    .replace(/÷/g, ' divided by ')
    .replace(/</g, ' is less than ')
    .replace(/>/g, ' is greater than ')
    .replace(/→/g, ', ')
    .replace(/…/g, '.')
    .replace(/(\d)\s*=\s*/g, '$1 equals ');
}
