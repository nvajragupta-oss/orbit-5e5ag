// Guards for offline mode: every app file must be in the service worker's
// ASSETS list, and the version numbers must match.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { APP_VERSION } from '../js/config.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sw = readFileSync(join(root, 'sw.js'), 'utf8');
const assets = [...sw.matchAll(/'\.\/([^']*)'/g)].map((m) => m[1]).filter(Boolean);

const walk = (dir) =>
  readdirSync(join(root, dir)).flatMap((f) => {
    if (f.startsWith('.')) return []; // skip hidden files such as macOS .DS_Store
    const p = join(dir, f);
    return statSync(join(root, p)).isDirectory() ? walk(p) : [p];
  });

test('every app file is cached for offline use', () => {
  const appFiles = [
    'index.html',
    'manifest.webmanifest',
    ...walk('js'),
    ...walk('css'),
    ...walk('icons').filter((f) => /\.(png|svg)$/.test(f)),
  ].map((f) => f.split('\\').join('/'));
  const missing = appFiles.filter((f) => !assets.includes(f));
  assert.deepEqual(missing, [], `Add these to ASSETS in sw.js: ${missing.join(', ')}`);
});

test('every cached file exists', () => {
  const gone = assets.filter((f) => !existsSync(join(root, f)));
  assert.deepEqual(gone, [], `Remove these from ASSETS in sw.js: ${gone.join(', ')}`);
});

test('sw.js VERSION matches APP_VERSION in js/config.js', () => {
  const v = sw.match(/const VERSION = '([^']+)'/)[1];
  assert.equal(v, APP_VERSION, 'Run: node tools/bump-version.mjs <version>');
});

test('index.html only uses relative paths (works on GitHub Pages sub-folders)', () => {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  const absolute = [...html.matchAll(/(?:src|href)="(\/[^"]*)"/g)].map((m) => m[1]);
  assert.deepEqual(absolute, []);
});
