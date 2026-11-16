// Registry of content packs. To add a pack:
//   1. Create js/packs/my-pack.js (copy space-math-1.js; give it a new unique id).
//   2. Import it below and add it to PACKS.
//   3. Add the file to the ASSETS list in sw.js.
// The star map shows arrows to switch packs automatically when there is more than one.

import spaceMath1 from './space-math-1.js';

export const PACKS = [spaceMath1];

export function getPack(id) {
  return PACKS.find((p) => p.id === id) || PACKS[0];
}
