/*
 * MIT License
 *
 * Copyright (c) 2026 wimwian
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

/*
 * Thin IO wrapper around the pure core in theme-gen.ts: read input.css, run
 * generate(), write output.css. All logic — and all tests — live in theme-gen.ts.
 *
 * Run with Node (>= 22.6, native TypeScript):
 *   node src/build-theme.ts
 *   pnpm --filter @smuit/theme build:theme
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate, minify, describe, ALL } from './theme-gen.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const INPUT = join(HERE, 'input.css');
const OUTPUT = join(HERE, 'output.css');

const source = readFileSync(INPUT, 'utf8');
// output.css ships minified — it's a generated artifact, not hand-edited.
const out = minify(generate(source));
writeFileSync(OUTPUT, out, 'utf8');

const { ramps, elevSteps } = describe(source);
const typeSummary = ramps.map((r) => `${r.role}(${r.steps})`).join(' ');
console.log(
    `Wrote ${OUTPUT} (${out.length} bytes · ${ALL.length} palettes · type: ${typeSummary} · elevation/shadow: ${elevSteps}-step · light + dark + media)`,
);
