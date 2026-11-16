// Small seeded random number generator (mulberry32) + helpers.
// Seeded so tests are repeatable; the game seeds it with the current time.

export function createRng(seed = Date.now()) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    /** Whole number from min to max (both included). */
    int(min, max) {
      return min + Math.floor(next() * (max - min + 1));
    },
    /** Random item from an array. */
    pick(arr) {
      return arr[Math.floor(next() * arr.length)];
    },
    /** true with probability p. */
    chance(p) {
      return next() < p;
    },
    /** New shuffled copy of an array. */
    shuffle(arr) {
      const out = arr.slice();
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    },
  };
}

/**
 * Keep calling make() until ok(value) is true. Used by problem generators
 * to describe "what a valid problem looks like" instead of hand-tuning ranges.
 */
export function sample(make, ok, tries = 2000) {
  for (let i = 0; i < tries; i++) {
    const v = make();
    if (ok(v)) return v;
  }
  throw new Error('sample(): could not find a valid value — check the generator rules');
}
