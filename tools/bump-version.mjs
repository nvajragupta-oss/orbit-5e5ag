// Set the app version everywhere it lives (js/config.js, sw.js, package.json)
// and add a CHANGELOG entry stub.
//   node tools/bump-version.mjs 1.1.0

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const version = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(version || '')) {
  console.error('Usage: node tools/bump-version.mjs 1.2.3');
  process.exit(1);
}

const edit = (file, re, replacement) => {
  const path = join(root, file);
  const before = readFileSync(path, 'utf8');
  const after = before.replace(re, replacement);
  if (before === after) throw new Error(`Version not found in ${file}`);
  writeFileSync(path, after);
  console.log(`updated ${file}`);
};

edit('js/config.js', /APP_VERSION = '[^']+'/, `APP_VERSION = '${version}'`);
edit('sw.js', /const VERSION = '[^']+'/, `const VERSION = '${version}'`);
edit('package.json', /"version": "[^"]+"/, `"version": "${version}"`);

const changelog = join(root, 'CHANGELOG.md');
const text = readFileSync(changelog, 'utf8');
if (!text.includes(`## ${version}`)) {
  const date = new Date().toISOString().slice(0, 10);
  writeFileSync(changelog, text.replace(/\n## /, `\n## ${version} — ${date}\n\n- (describe your changes)\n\n## `));
  console.log('added CHANGELOG.md entry — fill it in');
}
