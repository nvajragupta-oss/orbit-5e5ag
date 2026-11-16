// Registry of answer inputs. To add one (e.g. drag-and-drop):
//   1. Create js/inputs/my-input.js exporting { id, mount(container, ctx) }.
//      ctx = { problem, onAnswer(value), onPreview(text), format, sound }
//      mount returns { markWrong(value), showCorrect(answer), lock(), destroy() }.
//   2. Register it below and add the file to sw.js ASSETS.
//   3. Use it in a level: { input: 'my-input' }

import choices from './choices.js';
import numpad from './numpad.js';
import compare from './compare.js';

const INPUTS = new Map([choices, numpad, compare].map((i) => [i.id, i]));

export function getInput(id) {
  const input = INPUTS.get(id);
  if (!input) throw new Error(`Unknown input "${id}". Register it in js/inputs/index.js`);
  return input;
}

export const inputIds = () => [...INPUTS.keys()];
