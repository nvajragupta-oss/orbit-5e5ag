# Space Math — developer guide

An offline-first math game for kids (ages 7–8+), built as a **Progressive Web App** with plain HTML, CSS and
JavaScript modules. It has **no build step and no dependencies**, and loads no images, fonts or sound files
from the internet.

- Parents / setup on devices → see **[USER_MANUAL.md](USER_MANUAL.md)**
- Version history → **[CHANGELOG.md](CHANGELOG.md)**

## Run it

```bash
npm start          # = python3 -m http.server 8000  → open http://localhost:8000
npm test           # = node --test "tests/*.test.mjs"  (Node 20+)
```

> **Service-worker cache tip:** the service worker serves files cache-first. While you edit code, either
> bump the version (see *Release*), or in Chrome DevTools → Application → Service workers tick
> **Update on reload** (or use a private window).

## Project layout

```
index.html               page shell (top bar, screen, subtitle bar)
manifest.webmanifest     install-as-app info
sw.js                    service worker: offline cache (ASSETS list + VERSION)
css/style.css            all styles (tokens at the top)
icons/                   app icons (regenerate: python3 tools/make_icons.py)
js/
  app.js                 start-up + screen router  go('map', params)
  config.js              ★ tunable settings: questions per level, star rules, voices, colors, version
  engine.js              LevelRun: builds questions, scores, stars (no DOM — unit-tested)
  storage.js             players + progress in localStorage, versioned with migrate()
  speech.js              read-aloud + subtitles (Web Speech API, works offline)
  sound.js               chimes via Web Audio (no files)
  ui.js                  top bar, modal, star row, starry sky
  lib/                   dom.js (el helper), rng.js (seeded random), distractors.js, visuals.js
  packs/                 content packs (levels are data)
    index.js             pack registry
    space-math-1.js      the 16 levels
  problem-types/         one file per skill (plug-ins) + index.js registry
  inputs/                choices, numpad, compare (plug-ins) + index.js registry
  screens/               start, players, map, intro, play, results, grownups
tests/                   node:test suites (problem generators, engine/storage, offline guards)
tools/                   bump-version.mjs, make_icons.py
```

### How the pieces fit

```
pack (data) ──► level { type, params, input }
                   │          │
                   │          └─► inputs/<input>.js      draws answer UI, calls onAnswer(value)
                   └─► problem-types/<type>.js           generate / render / hint / explain
engine.js LevelRun ── builds 10 questions (easy half, hard half), checks answers, counts stars
screens/play.js ──── glues engine + problem type + input + speech/sound
storage.js ───────── best stars per player → { [packId]: { [levelId]: stars } }
```

## Common changes

### Change difficulty or rules

- **Questions per level, star thresholds, tries per question:** edit `js/config.js`.
- **Number ranges for a skill:** edit the `PICK` rules (or the `generate` function) in that skill's
  `js/problem-types/*.js` file. Stage `0` is the easy half of a level, and stage `1` is the hard half.
- Run `npm test`. The level rules in `tests/problem-types.test.mjs` check each level still practises its skill.

### Add a level (using an existing skill)

Add an object to `levels` in `js/packs/space-math-1.js`:

```js
{ id: 'add-3d', title: 'Giant Adding', icon: '🌋', type: 'add', params: { kind: 'tens-hundreds' },
  input: 'numpad', intro: 'Add big numbers!', example: '340 + 200 = 540' },
```

- `id` must be **unique and never change** after release, because saved stars are stored by id.
  You can reorder or insert levels freely.
- `type` can be an array to mix skills: `type: ['add', 'subtract']`.

### Add a new kind of question (problem type)

1. Copy a small one (e.g. `js/problem-types/times.js`) to `js/problem-types/money.js`.
2. Implement:
   - `generate({ params, stage, rng })` → `{ key, answer, say, ...data }`. `key` must be unique per question
     (it's used to avoid repeats), and `answer` is a number or a string.
   - `render(problem)` → DOM node. Use `equation([...tokens, '?'])` from `lib/visuals.js`, so the `?` slot shows typed answers.
   - `hint(problem)` and `explain(problem)` → `{ text, visual }` (`explain` may also return `say`).
   - Optional: `choices(problem, rng)` for button levels, and `format(value)` for button labels.
3. Register it in `js/problem-types/index.js`.
4. Add the file to `ASSETS` in `sw.js`. `npm test` fails if you forget.
5. Use it in a level, and add a level rule in `tests/problem-types.test.mjs`.

### Add a new answer input

Create `js/inputs/my-input.js` exporting `{ id, mount(container, ctx) }`, where
`ctx = { problem, onAnswer, onPreview, format, sound }`. `mount` returns
`{ markWrong(v), showCorrect(answer), lock(), destroy() }`. Then register it in `js/inputs/index.js`
and add it to `sw.js`.

### Add a new pack (e.g. "Space Math 2" or a reading pack)

1. Copy `js/packs/space-math-1.js` and give it a new `id`, `title` and `levels`.
2. Register it in `js/packs/index.js` and add it to `sw.js`.

The star map shows ◀ ▶ arrows to switch packs automatically.

### Change saved-data shape

Bump `SCHEMA_VERSION` in `js/storage.js` and add a step in `migrate()` that upgrades old data, so
children keep their stars. Add a test case in `tests/engine-storage.test.mjs`.

## Release checklist

1. `npm test` — everything green.
2. `node tools/bump-version.mjs 1.1.0` — updates `js/config.js`, `sw.js` and `package.json`, and adds a CHANGELOG stub.
3. Fill in `CHANGELOG.md`.
4. Commit, then upload the folder to your host (see USER_MANUAL §4 / §11). Devices update on their next online launch.

## Ground rules (keep these to stay offline-friendly)

- **No external resources:** no CDNs, web fonts or remote images. Use emoji, CSS or inline SVG.
- **Relative paths only** (`js/app.js`, not `/js/app.js`), so the app works on GitHub Pages sub-folders. A test checks this.
- **Every app file goes in `sw.js` ASSETS.** A test checks this.
- **Level ids are permanent.**
- Keep text short, and give every question a spoken `say` line.
