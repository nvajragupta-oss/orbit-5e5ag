// ─────────────────────────────────────────────────────────────
// Space Math — central settings.
// Tweak difficulty and rules here; the rest of the code reads from this file.
// ─────────────────────────────────────────────────────────────

// App version. MUST match VERSION in sw.js (a test checks this).
// Use `node tools/bump-version.mjs 1.2.3` to change both at once.
export const APP_VERSION = '1.0.0';

export const APP_NAME = 'Space Math';

// How many questions in one level.
export const QUESTIONS_PER_LEVEL = 10;

// The first part of every level uses the "easy" stage, the rest the "hard" stage.
// 0.5 = first half easy, second half hard.
export const EASY_SHARE = 0.5;

// Tries per question before the answer is shown.
export const TRIES_PER_QUESTION = 2;

// Stars earned, based on answers that were right on the FIRST try.
// Checked top to bottom; first rule that matches wins.
export const STAR_RULES = [
  { stars: 3, minFirstTry: 9 },
  { stars: 2, minFirstTry: 7 },
  { stars: 1, minFirstTry: 5 },
];

// Stars needed on a level to unlock the next one.
export const STARS_TO_UNLOCK_NEXT = 1;

// localStorage key that holds all players and settings.
export const STORAGE_KEY = 'space-math';

// Speech defaults (the device's built-in voice is used — works offline).
export const SPEECH = { lang: 'en', rate: 0.9, pitch: 1.05 };

// Voices we prefer when present (first match wins). Others still work.
export const PREFERRED_VOICES = [
  'Samantha', 'Karen', 'Moira', 'Daniel', 'Serena', 'Tessa',
  'Google US English', 'Google UK English Female',
  'Microsoft Aria', 'Microsoft Jenny', 'Microsoft Zira',
];

// Player avatars and colors offered when making a new player.
export const PLAYER_AVATARS = ['🚀', '👽', '🪐', '🌙', '⭐', '🛸', '☀️', '🌍'];
export const PLAYER_COLORS = ['#ff6b9a', '#3ddcff', '#46e08a', '#ffd23f', '#a98bff', '#ff9f43'];
export const MAX_PLAYERS = 8;
export const MAX_NAME_LENGTH = 14;

// Planet colors used on the star map (cycled).
export const PLANET_COLORS = ['#ff6b9a', '#3ddcff', '#46e08a', '#ffd23f', '#a98bff', '#ff9f43'];

// Things the mascot says.
export const PRAISE = ['Great job!', 'Super!', 'Out of this world!', 'You got it!', 'Stellar!', 'Awesome!', 'Brilliant!'];
export const TRY_AGAIN = ['Not quite. Try again!', 'Almost! Try again!', 'Oops! Have another go!'];
