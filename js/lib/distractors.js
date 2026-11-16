// Builds the answer buttons for "choices" levels: the right answer plus
// believable wrong answers (common mistakes first, then near misses).

/**
 * @param {number} answer
 * @param {object} rng
 * @param {object} [opts]
 * @param {number[]} [opts.mistakes]  likely mistakes, used first (e.g. forgot to carry)
 * @param {number[]} [opts.offsets]   near misses: answer ± each offset
 * @param {number}   [opts.min]       smallest allowed choice
 * @param {number}   [opts.count]     how many buttons
 */
export function numberChoices(answer, rng, { mistakes = [], offsets = [1, 2, 10], min = 0, count = 3 } = {}) {
  const picked = new Set([answer]);
  const valid = (v) => Number.isInteger(v) && v >= min && !picked.has(v);

  for (const v of rng.shuffle(mistakes)) {
    if (picked.size >= count) break;
    if (valid(v)) picked.add(v);
  }
  const near = rng.shuffle(offsets.flatMap((o) => [answer + o, answer - o]));
  for (const v of near) {
    if (picked.size >= count) break;
    if (valid(v)) picked.add(v);
  }
  for (let k = 3; picked.size < count; k++) {
    if (valid(answer + k)) picked.add(answer + k);
  }
  return rng.shuffle([...picked]);
}

/** Same idea for non-number answers (e.g. clock times): answer + items from a pool. */
export function optionChoices(answer, pool, rng, count = 3) {
  const others = rng.shuffle([...new Set(pool)].filter((v) => v !== answer)).slice(0, count - 1);
  return rng.shuffle([answer, ...others]);
}
