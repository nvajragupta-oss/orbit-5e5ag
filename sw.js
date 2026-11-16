// Service worker: saves every app file on the device so Space Math works offline.
//
// RELEASING AN UPDATE: change VERSION (must match APP_VERSION in js/config.js —
// `node tools/bump-version.mjs x.y.z` does both). Devices pick up the new version
// the next time they open the app while online.
//
// ADDING A FILE: add it to ASSETS below (the tests fail if you forget).

const VERSION = '1.0.0';
const CACHE = `space-math-${VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './js/app.js',
  './js/config.js',
  './js/engine.js',
  './js/storage.js',
  './js/speech.js',
  './js/sound.js',
  './js/ui.js',
  './js/lib/dom.js',
  './js/lib/rng.js',
  './js/lib/distractors.js',
  './js/lib/visuals.js',
  './js/packs/index.js',
  './js/packs/space-math-1.js',
  './js/problem-types/index.js',
  './js/problem-types/add.js',
  './js/problem-types/subtract.js',
  './js/problem-types/missing.js',
  './js/problem-types/place-value.js',
  './js/problem-types/compare.js',
  './js/problem-types/skip-count.js',
  './js/problem-types/clock.js',
  './js/problem-types/groups.js',
  './js/problem-types/times.js',
  './js/problem-types/share.js',
  './js/problem-types/story.js',
  './js/inputs/index.js',
  './js/inputs/choices.js',
  './js/inputs/numpad.js',
  './js/inputs/compare.js',
  './js/screens/start.js',
  './js/screens/players.js',
  './js/screens/map.js',
  './js/screens/intro.js',
  './js/screens/play.js',
  './js/screens/results.js',
  './js/screens/grownups.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('space-math-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Cache first (fast + offline); fall back to the network; pages fall back to index.html.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(
      (hit) =>
        hit ||
        fetch(req).catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())),
    ),
  );
});
