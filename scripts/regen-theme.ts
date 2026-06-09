/*
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
//
// Keep the GENERATED flat theme (packages/theme/src/output.css) in sync
// with its source (input.css) and the generator (theme-gen.ts). When the output
// is stale it is deleted and regenerated from scratch.
//
//   node scripts/regen-theme.ts            one-shot: regenerate iff stale
//   node scripts/regen-theme.ts --watch    keep regenerating whenever a source
//                                           file changes (use alongside dev)
//
// Note: this only governs the FLAT theme. The runtime theme (tailwind.css, used
// by `@wimwian-org/theme`) is hand-authored, not generated — keep its base colours in
// step with input.css yourself.

import { readFileSync, writeFileSync, rmSync, existsSync, watch } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate, minify } from '../packages/theme/src/theme-gen.ts';

const THEME = join(dirname(fileURLToPath(import.meta.url)), '..', 'packages', 'theme', 'src');
const INPUT = join(THEME, 'input.css');
const OUTPUT = join(THEME, 'output.css');
const GENERATOR = join(THEME, 'theme-gen.ts');

/** The fresh, minified flat theme for the current input.css. */
const fresh = (): string => minify(generate(readFileSync(INPUT, 'utf8')));

/** True when output.css is missing or no longer matches the fresh theme. */
function isStale(): boolean {
    return !existsSync(OUTPUT) || fresh() !== readFileSync(OUTPUT, 'utf8');
}

/** Delete the stale output and rebuild it (minified) from input.css. */
function regenerate(reason: string): void {
    if (existsSync(OUTPUT)) rmSync(OUTPUT);
    const out = fresh();
    writeFileSync(OUTPUT, out, 'utf8');
    console.log(`↻ regenerated output.css (${out.length} bytes, minified) — ${reason}`);
}

if (isStale()) regenerate('was stale');
else console.log('✓ output.css is already up to date');

if (process.argv.includes('--watch') || process.argv.includes('-w')) {
    console.log('👀 watching input.css + theme-gen.ts — Ctrl-C to stop');
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onChange = () => {
        clearTimeout(timer);
        // debounce: editors emit several events per save
        timer = setTimeout(() => {
            if (isStale()) regenerate('source changed');
        }, 50);
    };
    watch(INPUT, onChange);
    watch(GENERATOR, onChange);
}
