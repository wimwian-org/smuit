/*
 * @smuit/theme — flat theme generator (CLI shell)
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */

/*
 * Thin IO wrapper around the pure core in theme-gen.ts: read input.css, run
 * generate(), write output.css. All logic — and all tests — live in theme-gen.ts.
 *
 * Run with Node (>= 22.6, native TypeScript):
 *   node src/theme/build-theme.ts
 *   pnpm --filter @smuit/theme build:theme
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate, describe, ALL } from './theme-gen.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const INPUT = join(HERE, 'input.css');
const OUTPUT = join(HERE, 'output.css');

const source = readFileSync(INPUT, 'utf8');
const out = generate(source);
writeFileSync(OUTPUT, out, 'utf8');

const { ramps, elevSteps } = describe(source);
const typeSummary = ramps.map((r) => `${r.role}(${r.steps})`).join(' ');
console.log(
    `Wrote ${OUTPUT} (${out.length} bytes · ${ALL.length} palettes · type: ${typeSummary} · elevation/shadow: ${elevSteps}-step · light + dark + media)`,
);
