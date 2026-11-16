// Play a level: show each question, check answers, give hints and explanations.

import { el, wait } from '../lib/dom.js';
import { createRng } from '../lib/rng.js';
import { getPack } from '../packs/index.js';
import { LevelRun } from '../engine.js';
import { getProblemType } from '../problem-types/index.js';
import { getInput } from '../inputs/index.js';
import { PRAISE, TRY_AGAIN } from '../config.js';

export function show(root, { packId, levelIndex }, app) {
  const pack = getPack(packId);
  const level = pack.levels[levelIndex];
  const player = app.store.currentPlayer();
  if (!level || !player) return app.go('map');

  const rng = createRng();
  const run = new LevelRun(level, rng);
  let input = null;
  let busy = false;
  let alive = true;

  app.setTop({ title: `${levelIndex + 1} · ${level.title}`, back: () => app.go('map', { packId }) });

  const progress = el('div', { class: 'progress', 'aria-label': 'Progress' }, run.questions.map(() => el('span', { text: '★' })));
  const qArea = el('div', { class: 'question' });
  const feedback = el('div', { class: 'feedback', role: 'status' });
  const helpArea = el('div', { class: 'help' });
  const inputArea = el('div', { class: 'answer' });
  const hintBtn = el('button', { type: 'button', class: 'btn btn-ghost btn-small', onclick: () => showHint() }, '💡 Hint');
  const nextBtn = el('button', { type: 'button', class: 'btn btn-yellow', onclick: () => advance() }, 'Next ➜');

  root.append(
    el(
      'div',
      { class: 'play' },
      progress,
      el(
        'div',
        { class: 'play-body' },
        el('div', { class: 'play-main' }, qArea, feedback, helpArea),
        el('div', { class: 'play-side' }, inputArea, el('div', { class: 'play-tools' }, hintBtn, nextBtn)),
      ),
    ),
  );

  const typeOf = (q) => getProblemType(q.type);
  const fmt = (q, v) => (typeOf(q).format || String)(v);

  function preview(text) {
    const slot = qArea.querySelector('.slot');
    if (!slot) return;
    slot.textContent = text === '' ? '?' : text;
    slot.classList.toggle('typed', text !== '');
  }

  function card(kind, icon, text, visual) {
    return el('div', { class: `help-card ${kind}` }, el('div', { class: 'help-text' }, el('span', { class: 'help-icon', 'aria-hidden': 'true', text: icon }), el('p', { text })), visual || null);
  }

  function showQuestion() {
    const q = run.current;
    busy = false;
    input?.destroy();
    qArea.replaceChildren(typeOf(q).render(q));
    qArea.classList.remove('enter');
    void qArea.offsetWidth; // restart the entry animation
    qArea.classList.add('enter');
    helpArea.replaceChildren();
    feedback.textContent = '';
    feedback.className = 'feedback';
    inputArea.replaceChildren();
    inputArea.classList.remove('done');
    nextBtn.hidden = true;
    hintBtn.hidden = false;
    hintBtn.disabled = false;
    progress.children[run.index].classList.add('now');
    input = getInput(level.input).mount(inputArea, { problem: q, onAnswer: answer, onPreview: preview, format: typeOf(q).format || String, sound: app.sound });
    app.speak(q.say);
  }

  function showHint() {
    const q = run.current;
    const h = typeOf(q).hint(q);
    helpArea.replaceChildren(card('hint', '💡', h.text, h.visual));
    hintBtn.disabled = true;
    app.speak(h.text);
  }

  async function answer(value) {
    if (busy) return;
    const q = run.current;
    const res = run.submit(value);
    const dot = progress.children[run.index];

    if (res.correct) {
      busy = true;
      input.lock();
      input.showCorrect(q.answer);
      preview(fmt(q, q.answer));
      dot.classList.remove('now');
      dot.classList.add(run.results.at(-1));
      app.sound.correct();
      const praise = rng.pick(PRAISE);
      feedback.textContent = `🎉 ${praise}`;
      feedback.className = 'feedback good';
      app.speak(praise);
      await wait(1400);
      if (alive) advance();
      return;
    }

    if (!res.finished) {
      app.sound.wrong();
      input.markWrong(value);
      preview('');
      const msg = rng.pick(TRY_AGAIN);
      feedback.textContent = msg;
      feedback.className = 'feedback oops';
      const h = typeOf(q).hint(q);
      helpArea.replaceChildren(card('hint', '💡', h.text, h.visual));
      hintBtn.disabled = true;
      app.speak(`${msg} ${h.text}`);
      return;
    }

    // Out of tries: show the answer and how to get it.
    busy = true;
    input.lock();
    input.showCorrect(q.answer);
    preview(fmt(q, q.answer));
    dot.classList.remove('now');
    dot.classList.add('miss');
    const ex = typeOf(q).explain(q);
    feedback.textContent = `The answer is ${fmt(q, q.answer)}`;
    feedback.className = 'feedback info';
    helpArea.replaceChildren(card('explain', '👽', ex.text, ex.visual));
    inputArea.classList.add('done'); // hides the number pad (choice buttons stay, showing the answer)
    hintBtn.hidden = true;
    nextBtn.hidden = false;
    nextBtn.focus({ preventScroll: true });
    nextBtn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    app.speak(ex.say || ex.text);
  }

  function advance() {
    nextBtn.hidden = true;
    run.next();
    if (run.done) finish();
    else showQuestion();
  }

  function finish() {
    const { best, improved } = app.store.recordStars(player.id, pack.id, level.id, run.stars);
    app.go('results', { packId, levelIndex, stars: run.stars, firstTry: run.firstTry, total: run.questions.length, best, improved });
  }

  showQuestion();

  return {
    destroy() {
      alive = false;
      input?.destroy();
    },
  };
}
