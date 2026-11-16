// Generates lots of questions for every level and checks they make sense.
// Run: npm test   (or: node --test "tests/*.test.mjs")

import './fake-dom.mjs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PACKS } from '../js/packs/index.js';
import { buildQuestions } from '../js/engine.js';
import { getProblemType } from '../js/problem-types/index.js';
import { inputIds } from '../js/inputs/index.js';
import { createRng } from '../js/lib/rng.js';

const ROUNDS = 100; // 100 levels × 10 questions = 1000 questions per level

const ones = (n) => n % 10;

// Extra rules per level id — makes sure each level really practises its skill.
const LEVEL_RULES = {
  'warmup-20': (q) => q.answer >= 0 && q.answer <= 20 && q.a <= 20,
  'missing-number': (q) => q.answer > 0 && q.answer <= 20,
  'tens-ones': (q) => q.answer >= 10 && q.answer <= 999,
  compare: (q) => ['<', '=', '>'].includes(q.answer) && (q.a < q.b ? '<' : q.a > q.b ? '>' : '=') === q.answer,
  'skip-count': (q) => q.seq.every((n) => n >= 0) && q.seq[q.gap] === q.answer,
  clock: (q) => /^(1[0-2]|[1-9]):(00|15|30|45)$/.test(q.answer),
  'add-2d': (q) => q.a >= 10 && q.b >= 10 && ones(q.a) + ones(q.b) < 10 && q.answer <= 99,
  'add-2d-regroup': (q) => q.a >= 10 && q.b >= 10 && ones(q.a) + ones(q.b) >= 10 && q.answer <= 99,
  'sub-2d': (q) => q.b >= 10 && ones(q.a) >= ones(q.b) && q.answer > 0,
  'sub-2d-regroup': (q) => q.b >= 10 && ones(q.a) < ones(q.b) && q.answer > 0,
  'tens-hundreds': (q) => q.a >= 100 && q.a % 10 === 0 && q.b % 10 === 0 && q.answer >= 100 && q.answer < 1000,
  'equal-groups': (q) => q.answer === q.count * q.size,
  'times-2-5-10': (q) => [2, 5, 10].includes(q.table) && q.answer === q.a * q.b,
  'times-3-4': (q) => [3, 4].includes(q.table) && q.answer === q.a * q.b,
  sharing: (q) => q.answer * q.people === q.total,
  story: (q) => Number.isInteger(q.answer) && q.answer > 0 && q.steps.length === 2,
};

for (const pack of PACKS) {
  test(`${pack.id}: level ids are unique`, () => {
    const ids = pack.levels.map((l) => l.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  for (const level of pack.levels) {
    test(`${pack.id} / ${level.id}`, () => {
      assert.ok(inputIds().includes(level.input), `unknown input ${level.input}`);
      assert.ok(level.intro && level.title && level.icon, 'level needs title, icon and intro');
      const rule = LEVEL_RULES[level.id];

      for (let round = 0; round < ROUNDS; round++) {
        const rng = createRng(1000 + round);
        const questions = buildQuestions(level, rng);
        const keys = questions.map((q) => `${q.type}:${q.key}`);
        assert.equal(new Set(keys).size, keys.length, `repeated question in ${level.id}: ${keys}`);

        for (const q of questions) {
          const where = `${level.id} ${JSON.stringify({ key: q.key, answer: q.answer })}`;
          assert.ok(q.say && typeof q.say === 'string', `missing say: ${where}`);
          if (typeof q.answer === 'number') {
            assert.ok(Number.isInteger(q.answer) && q.answer >= 0, `bad answer: ${where}`);
            if (level.input === 'numpad') assert.ok(q.answer < 10000, `too many digits for numpad: ${where}`);
          }
          for (const v of [q.a, q.b, q.x, q.y, q.c, q.total]) if (typeof v === 'number') assert.ok(v >= 0, `negative number: ${where}`);
          if (rule) assert.ok(rule(q), `level rule failed: ${where}`);

          if (level.input === 'choices') {
            assert.equal(q.choices.length, 3, `need 3 choices: ${where}`);
            assert.equal(new Set(q.choices.map(String)).size, 3, `duplicate choices: ${where} ${q.choices}`);
            assert.ok(q.choices.map(String).includes(String(q.answer)), `answer missing from choices: ${where}`);
            for (const c of q.choices) if (typeof c === 'number') assert.ok(c >= 0, `negative choice: ${where}`);
          }

          const type = getProblemType(q.type);
          const hint = type.hint(q);
          const ex = type.explain(q);
          assert.ok(hint.text && ex.text, `hint/explain text missing: ${where}`);
          assert.ok(!/undefined|NaN/.test(hint.text + ex.text + q.say), `bad text: ${where} ${hint.text} | ${ex.text}`);
        }
      }
    });
  }
}

test('easy stage comes first, hard stage second', () => {
  const level = PACKS[0].levels.find((l) => l.id === 'times-2-5-10');
  const qs = buildQuestions(level, createRng(5));
  assert.deepEqual(
    qs.map((q) => q.stage),
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
  );
  assert.ok(qs.slice(0, 5).every((q) => q.n <= 5));
  assert.ok(qs.slice(5).every((q) => q.n >= 6));
});
