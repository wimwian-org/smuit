/**
 * sui
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
// scripts/coverage-to-json.mjs
//
// Reads the json-summary v8 reports from BOTH test runs —
//   • coverage/coverage-summary.json          (node-mode: lowercase + *.variants tests)
//   • coverage-browser/coverage-summary.json  (browser-mode: PascalCase tests)
// — merges them, aggregates v8 metrics per bit folder under components/<bit>/,
// and writes apps/playground/src/routes/coverage.json. The homepage card grid
// imports that file at build time to render the per-bit L/S/F/P badges.
//
// Why both: components tested ONLY in the browser (e.g. sonner, data-grid's
// renderers) have no node-mode coverage, so reading just coverage/ left them
// absent → the homepage painted their badges red ("missing" == undefined).
// Merging both summaries gives every bit real numbers regardless of test mode.
//
// Why aggregate per folder rather than per file: a "bit" is the unit a
// user thinks about, and bigger bits (Combobox has ~13 files) would
// otherwise need 13 rows of micro-badges. The summary collapses all
// files under each bit to one number per metric.
//
// Aggregation is total-weighted: for each metric, sum `total` and
// `covered` across the bit's files, then percentage = covered/total.
// Simple averaging would over-count one-line files vs. a 200-line file.
//
// Output shape (one entry per bit):
//   {
//     "Avatar":  { "lines": 100, "statements": 100, "branches": 100, "functions": 100 },
//     "Button":  { "lines": 100, "statements": 100, "branches": 100, "functions": 100 },
//     …
//   }
//
// Falsy bits (no files matched, no tests) are omitted from the output;
// the homepage gracefully renders a card with no badges in that case.
//
// Usage (wired into the `coverage` npm script):
//   pnpm coverage   →   vitest run --coverage   →   this script
//
// Idempotent: re-runs produce byte-identical output for the same input.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const summaryPaths = [
    resolve(repoRoot, 'coverage/coverage-summary.json'), // node-mode run
    resolve(repoRoot, 'coverage-browser/coverage-summary.json'), // browser-mode run
];
const outputPath = resolve(repoRoot, 'apps/playground/src/routes/coverage.json');

// The summary keys are absolute file paths (or "total" for the repo
// aggregate). Filter to files under components/<bit>/, normalising the path
// separator so a Windows runner produces the same bit name.
const bitsPrefix = `components${sep}`;
const bitsPrefixPosix = 'components/';
const toRelPath = (absPath) =>
    absPath
        .slice(absPath.indexOf(bitsPrefix) === -1 ? 0 : absPath.indexOf('components'))
        .split(sep)
        .join('/');

// Merge both runs into one file → metrics map BEFORE aggregating. A `.ts` file
// can be instrumented by BOTH runs (e.g. data-grid/pipeline.ts has node tests
// AND is exercised by browser tests), so summing the two summaries directly
// would double-count it. Keying by path and keeping the better-covered entry
// per file dedupes and reflects whichever run exercised it more.
const mergedFiles = new Map();
let loaded = 0;
for (const summaryPath of summaryPaths) {
    if (!existsSync(summaryPath)) continue;
    loaded++;
    const summary = JSON.parse(readFileSync(summaryPath, 'utf8'));
    for (const [absPath, fileSummary] of Object.entries(summary)) {
        if (absPath === 'total') continue;
        const relPath = toRelPath(absPath);
        if (!relPath.startsWith(bitsPrefixPosix)) continue;
        const existing = mergedFiles.get(relPath);
        if (!existing || (fileSummary.lines?.covered ?? 0) > (existing.lines?.covered ?? 0)) {
            mergedFiles.set(relPath, fileSummary);
        }
    }
}

if (loaded === 0) {
    console.error(
        `[coverage-to-json] No coverage summary found in coverage/ or coverage-browser/. ` +
            `Run \`pnpm coverage\` first (it produces both).`,
    );
    process.exit(1);
}

// Bit → metric → { total, covered } accumulator. Sub-objects are
// initialised lazily on first hit.
const accum = new Map();

for (const [relPath, fileSummary] of mergedFiles) {
    // components/<bit>/<file> → take the first segment after the prefix.
    const after = relPath.slice(bitsPrefixPosix.length);
    const bit = after.split('/')[0];
    if (!bit) continue;

    const bucket = accum.get(bit) ?? {
        lines: { total: 0, covered: 0 },
        statements: { total: 0, covered: 0 },
        branches: { total: 0, covered: 0 },
        functions: { total: 0, covered: 0 },
    };
    for (const metric of ['lines', 'statements', 'branches', 'functions']) {
        bucket[metric].total += fileSummary[metric]?.total ?? 0;
        bucket[metric].covered += fileSummary[metric]?.covered ?? 0;
    }
    accum.set(bit, bucket);
}

// Compute percentages with one decimal of precision — the UI rounds to
// the nearest integer, but keeping a digit here lets future variants
// (sparklines, hover tooltips) show "99.4 %" instead of a flat "99 %".
// `total === 0` → percentage is 100 by v8/istanbul convention (nothing
// to instrument means nothing to miss); we mirror that.
const pct = (covered, total) => (total === 0 ? 100 : Math.round((covered / total) * 1000) / 10);

const output = {};
for (const [bit, metrics] of [...accum.entries()].sort()) {
    output[bit] = {
        lines: pct(metrics.lines.covered, metrics.lines.total),
        statements: pct(metrics.statements.covered, metrics.statements.total),
        branches: pct(metrics.branches.covered, metrics.branches.total),
        functions: pct(metrics.functions.covered, metrics.functions.total),
    };
}

// Sort keys + trailing newline for stable git diffs across regens.
writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n');
console.log(`[coverage-to-json] Wrote ${Object.keys(output).length} bits → ${outputPath}`);
