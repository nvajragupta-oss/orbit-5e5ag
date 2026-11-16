// Registry of problem types. To add a new kind of question:
//   1. Create js/problem-types/my-type.js (copy a small one like times.js).
//   2. Import it below and add it to TYPES.
//   3. Add it to the ASSETS list in sw.js (a test reminds you).
//   4. Use its id in a level: { type: 'my-type', ... }
//
// A problem type is an object:
//   id                       unique string
//   generate({params, stage, rng}) → problem   (must include key, answer, say)
//   render(problem)          → DOM node showing the question ('?' slot fills with the answer)
//   hint(problem)            → { text, visual: Node|null }   shown after the 💡 button / first miss
//   explain(problem)         → { text, say?, visual: Node|null }   shown after the last try
//                              (say = optional different wording for the voice)
//   choices?(problem, rng)   → array of options for 'choices' levels (default: near numbers)
//   format?(value)           → label for a choice button (default: String(value))

import add from './add.js';
import subtract from './subtract.js';
import missing from './missing.js';
import placeValue from './place-value.js';
import compare from './compare.js';
import skipCount from './skip-count.js';
import clock from './clock.js';
import groups from './groups.js';
import times from './times.js';
import share from './share.js';
import story from './story.js';

const TYPES = [add, subtract, missing, placeValue, compare, skipCount, clock, groups, times, share, story];

const byId = new Map(TYPES.map((t) => [t.id, t]));

export function getProblemType(id) {
  const t = byId.get(id);
  if (!t) throw new Error(`Unknown problem type "${id}". Register it in js/problem-types/index.js`);
  return t;
}

export const problemTypeIds = () => [...byId.keys()];
