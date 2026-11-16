// Scoring, unlocking and saved-data tests.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LevelRun, starsFor } from '../js/engine.js';
import { createStore, memoryBackend, migrate, SCHEMA_VERSION } from '../js/storage.js';
import { STORAGE_KEY } from '../js/config.js';
import { PACKS } from '../js/packs/index.js';
import { createRng } from '../js/lib/rng.js';

const pack = PACKS[0];

test('stars from first-try answers', () => {
  assert.equal(starsFor(10), 3);
  assert.equal(starsFor(9), 3);
  assert.equal(starsFor(8), 2);
  assert.equal(starsFor(7), 2);
  assert.equal(starsFor(6), 1);
  assert.equal(starsFor(5), 1);
  assert.equal(starsFor(4), 0);
});

test('LevelRun: first try, second try and miss', () => {
  const run = new LevelRun(pack.levels[6], createRng(1)); // numpad level
  // Q1 right first time
  assert.deepEqual(run.submit(run.current.answer), { correct: true, finished: true });
  run.next();
  // Q2 wrong then right
  assert.deepEqual(run.submit(-1), { correct: false, finished: false });
  assert.deepEqual(run.submit(run.current.answer), { correct: true, finished: true });
  run.next();
  // Q3 wrong twice
  run.submit(-1);
  assert.deepEqual(run.submit(-2), { correct: false, finished: true });
  run.next();
  assert.deepEqual(run.results, ['star', 'ok', 'miss']);
  assert.equal(run.firstTry, 1);
  while (!run.done) {
    run.submit(run.current.answer);
    run.next();
  }
  assert.equal(run.firstTry, 8);
  assert.equal(run.stars, 2);
});

test('store: players, best stars and unlocking', () => {
  const store = createStore(memoryBackend());
  const a = store.addPlayer({ name: '  Alex  ', avatar: '🚀', color: '#fff' });
  const b = store.addPlayer({ name: 'Sibling', avatar: '👽', color: '#000' });
  assert.equal(a.name, 'Alex');

  assert.equal(store.isUnlocked(a.id, pack, 0), true);
  assert.equal(store.isUnlocked(a.id, pack, 1), false);

  store.recordStars(a.id, pack.id, pack.levels[0].id, 2);
  assert.equal(store.isUnlocked(a.id, pack, 1), true);
  assert.equal(store.isUnlocked(b.id, pack, 1), false, 'progress is per player');

  // A worse run never lowers the best
  const r = store.recordStars(a.id, pack.id, pack.levels[0].id, 1);
  assert.deepEqual(r, { best: 2, improved: false });
  assert.equal(store.getStars(a.id, pack.id, pack.levels[0].id), 2);
  assert.equal(store.totalStars(a.id), 2);

  store.resetProgress(a.id);
  assert.equal(store.totalStars(a.id), 0);
  store.removePlayer(b.id);
  assert.equal(store.players().length, 1);
});

test('store: data survives a reload', () => {
  const backend = memoryBackend();
  const s1 = createStore(backend);
  const p = s1.addPlayer({ name: 'Ann', avatar: '⭐', color: '#123456' });
  s1.recordStars(p.id, pack.id, 'warmup-20', 3);
  s1.updateSettings({ voice: false });

  const s2 = createStore(backend);
  assert.equal(s2.getStars(p.id, pack.id, 'warmup-20'), 3);
  assert.equal(s2.settings().voice, false);
});

test('migrate: junk, old and current data', () => {
  assert.equal(migrate(null).schemaVersion, SCHEMA_VERSION);
  assert.deepEqual(migrate('nonsense').players, []);

  const old = migrate({ players: [{ id: 'p1', name: 'Old', progress: { x: { y: 1 } } }, { bad: true }] });
  assert.equal(old.schemaVersion, SCHEMA_VERSION);
  assert.equal(old.players.length, 1);
  assert.equal(old.players[0].avatar, '🚀');
  assert.deepEqual(old.players[0].progress, { x: { y: 1 } });
  assert.equal(old.settings.voice, true);

  const cur = migrate({ schemaVersion: 1, currentPlayerId: 'gone', players: [], settings: { sound: false } });
  assert.equal(cur.currentPlayerId, null);
  assert.equal(cur.settings.sound, false);
  assert.equal(cur.settings.voice, true);
});

test('store: corrupted saved data does not crash', () => {
  const backend = memoryBackend();
  backend.setItem(STORAGE_KEY, '{not json');
  const store = createStore(backend);
  assert.deepEqual(store.players(), []);
});
