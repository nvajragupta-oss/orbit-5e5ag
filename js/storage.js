// Saved data: players, their stars and settings — kept on this device in localStorage.
//
// Shape (schemaVersion 1):
// {
//   schemaVersion: 1,
//   currentPlayerId: 'p_xxx' | null,
//   settings: { voice: true, sound: true, voiceName: null },
//   players: [{ id, name, avatar, color, createdAt, progress: { [packId]: { [levelId]: stars } } }]
// }
//
// Changing the shape later? Bump SCHEMA_VERSION and add a step in migrate() so
// children keep their stars after the update.

import { STORAGE_KEY, STARS_TO_UNLOCK_NEXT, MAX_NAME_LENGTH } from './config.js';

export const SCHEMA_VERSION = 1;

const DEFAULT_SETTINGS = { voice: true, sound: true, voiceName: null };

export function emptyState() {
  return { schemaVersion: SCHEMA_VERSION, currentPlayerId: null, settings: { ...DEFAULT_SETTINGS }, players: [] };
}

/** Turn whatever was saved (any older version, or junk) into the current shape. */
export function migrate(raw) {
  if (!raw || typeof raw !== 'object') return emptyState();
  let s = { ...raw };

  if (!s.schemaVersion) s = { ...emptyState(), players: Array.isArray(raw.players) ? raw.players : [] };

  // Future example:
  // if (s.schemaVersion === 1) { s = { ...s, newField: 'default' }; s.schemaVersion = 2; }

  s.schemaVersion = SCHEMA_VERSION;
  s.settings = { ...DEFAULT_SETTINGS, ...(s.settings || {}) };
  s.players = (Array.isArray(s.players) ? s.players : [])
    .filter((p) => p && typeof p.id === 'string' && typeof p.name === 'string')
    .map((p) => ({ avatar: '🚀', color: '#3ddcff', createdAt: 0, ...p, progress: p.progress && typeof p.progress === 'object' ? p.progress : {} }));
  if (!s.players.some((p) => p.id === s.currentPlayerId)) s.currentPlayerId = null;
  return s;
}

export function memoryBackend() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
}

function defaultBackend() {
  try {
    const ls = globalThis.localStorage;
    const probe = '__space_math_probe__';
    ls.setItem(probe, '1');
    ls.removeItem(probe);
    return ls;
  } catch {
    return memoryBackend(); // private mode / blocked storage: game still works, just doesn't remember
  }
}

const makeId = () => 'p_' + Math.random().toString(36).slice(2, 10);

export function createStore(backend = defaultBackend()) {
  let state;
  try {
    const text = backend.getItem(STORAGE_KEY);
    state = migrate(text ? JSON.parse(text) : null);
  } catch {
    state = emptyState();
  }

  const save = () => {
    try {
      backend.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked — ignore */
    }
  };
  const player = (id) => state.players.find((p) => p.id === id) || null;

  return {
    get state() {
      return state;
    },
    players: () => state.players,
    getPlayer: player,
    currentPlayer: () => player(state.currentPlayerId),
    setCurrentPlayer(id) {
      state.currentPlayerId = id;
      save();
    },

    addPlayer({ name, avatar, color }) {
      const p = { id: makeId(), name: String(name).trim().slice(0, MAX_NAME_LENGTH) || 'Player', avatar, color, createdAt: Date.now(), progress: {} };
      state.players.push(p);
      save();
      return p;
    },
    removePlayer(id) {
      state.players = state.players.filter((p) => p.id !== id);
      if (state.currentPlayerId === id) state.currentPlayerId = null;
      save();
    },
    resetProgress(id) {
      const p = player(id);
      if (p) p.progress = {};
      save();
    },

    getStars(playerId, packId, levelId) {
      return player(playerId)?.progress?.[packId]?.[levelId] ?? 0;
    },
    /** Saves the best result. Returns { best, improved }. */
    recordStars(playerId, packId, levelId, stars) {
      const p = player(playerId);
      if (!p) return { best: stars, improved: false };
      const pack = (p.progress[packId] ||= {});
      const before = pack[levelId] ?? 0;
      const best = Math.max(before, stars);
      pack[levelId] = best;
      save();
      return { best, improved: stars > before };
    },
    totalStars(playerId) {
      const p = player(playerId);
      if (!p) return 0;
      return Object.values(p.progress).reduce((sum, pack) => sum + Object.values(pack).reduce((a, b) => a + b, 0), 0);
    },
    /** First level is always open; others need stars on the level before. */
    isUnlocked(playerId, pack, levelIndex) {
      if (levelIndex <= 0) return true;
      const prev = pack.levels[levelIndex - 1];
      return this.getStars(playerId, pack.id, prev.id) >= STARS_TO_UNLOCK_NEXT;
    },

    settings: () => state.settings,
    updateSettings(patch) {
      state.settings = { ...state.settings, ...patch };
      save();
    },
  };
}
