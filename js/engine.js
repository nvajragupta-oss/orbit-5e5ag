// Level runner: builds the questions for a level and keeps score.
// It knows nothing about the screen — js/screens/play.js drives it — so it can be unit-tested.

import { QUESTIONS_PER_LEVEL, EASY_SHARE, TRIES_PER_QUESTION, STAR_RULES } from './config.js';
import { getProblemType } from './problem-types/index.js';
import { numberChoices } from './lib/distractors.js';

export function starsFor(firstTryCorrect) {
  for (const rule of STAR_RULES) if (firstTryCorrect >= rule.minFirstTry) return rule.stars;
  return 0;
}

/** Make the list of questions for a level: easy stage first, then hard, no repeats. */
export function buildQuestions(level, rng, count = QUESTIONS_PER_LEVEL) {
  const typeIds = [].concat(level.type);
  const easyCount = Math.round(count * EASY_SHARE);
  const seen = new Set();
  const list = [];
  for (let i = 0; i < count; i++) {
    const stage = i < easyCount ? 0 : 1;
    let problem;
    let typeId;
    for (let tries = 0; tries < 60; tries++) {
      typeId = typeIds.length === 1 ? typeIds[0] : rng.pick(typeIds);
      problem = getProblemType(typeId).generate({ params: level.params || {}, stage, rng });
      if (!seen.has(`${typeId}:${problem.key}`)) break;
    }
    seen.add(`${typeId}:${problem.key}`);
    problem.type = typeId;
    problem.stage = stage;
    if (level.input === 'choices') {
      const type = getProblemType(typeId);
      problem.choices = type.choices ? type.choices(problem, rng) : numberChoices(problem.answer, rng);
    }
    list.push(problem);
  }
  return list;
}

export const isCorrect = (problem, value) => String(value).trim() === String(problem.answer);

export class LevelRun {
  constructor(level, rng, count = QUESTIONS_PER_LEVEL) {
    this.level = level;
    this.questions = buildQuestions(level, rng, count);
    this.index = 0;
    this.tries = 0;
    this.firstTry = 0;
    /** one entry per finished question: 'star' (first try) | 'ok' (second try) | 'miss' */
    this.results = [];
  }

  get current() {
    return this.questions[this.index];
  }

  get done() {
    return this.index >= this.questions.length;
  }

  /** Check an answer. Returns { correct, finished } — finished = no more tries for this question. */
  submit(value) {
    const correct = isCorrect(this.current, value);
    this.tries += 1;
    if (correct) {
      if (this.tries === 1) this.firstTry += 1;
      this.results.push(this.tries === 1 ? 'star' : 'ok');
      return { correct: true, finished: true };
    }
    if (this.tries >= TRIES_PER_QUESTION) {
      this.results.push('miss');
      return { correct: false, finished: true };
    }
    return { correct: false, finished: false };
  }

  next() {
    this.index += 1;
    this.tries = 0;
  }

  get stars() {
    return starsFor(this.firstTry);
  }
}
