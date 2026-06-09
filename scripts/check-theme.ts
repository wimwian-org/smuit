/*
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
//
// Guard against a stale or hand-edited @wimwian-org/theme output.css. Regenerates the
// flat theme IN MEMORY from input.css and compares it to the committed
// output.css — exits non-zero (with the first differing line) if they diverge.
// Does NOT write anything, so it's safe in CI and pre-commit.
//
//   node scripts/check-theme.ts   ·   pnpm check:theme

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate, minify } from '../packages/theme/src/theme-gen.ts';

const THEME = join(dirname(fileURLToPath(import.meta.url)), '..', 'packages', 'theme', 'src');
const input = readFileSync(join(THEME, 'input.css'), 'utf8');
const committed = readFileSync(join(THEME, 'output.css'), 'utf8');
const fresh = minify(generate(input));

if (fresh === committed) {
    console.log('✓ @wimwian-org/theme output.css is up to date.');
    process.exit(0);
}

const a = committed.split('\n');
const b = fresh.split('\n');
let i = 0;
while (i < a.length && i < b.length && a[i] === b[i]) i++;

console.error('✗ packages/theme/src/output.css does NOT match generate(input.css).');
console.error('  output.css is GENERATED — do not hand-edit it. Regenerate with:');
console.error('      pnpm --filter @wimwian-org/theme build:theme');
console.error(`  First difference at line ${i + 1}:`);
console.error(`    committed: ${JSON.stringify(a[i] ?? '<missing>')}`);
console.error(`    expected:  ${JSON.stringify(b[i] ?? '<missing>')}`);
process.exit(1);
