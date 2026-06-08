/*
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
//
// Consolidate the two coverage runs into one report:
//   - node    (vitest.config.ts)         → coverage/            theme generator
//   - browser (vitest.browser.config.ts) → coverage-browser/    components
//
// They cover disjoint files, so merging is a union. Writes:
//   coverage/lcov.json   — merged per-file + total summary (JSON)
//   coverage/lcov.info   — merged lcov (node + browser concatenated) for CI
// …and prints a consolidated table to stdout.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const METRICS = ['statements', 'branches', 'functions', 'lines'];

const loadSummary = (dir) => {
    const p = join(ROOT, dir, 'coverage-summary.json');
    return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {};
};

const sources = [
    { label: 'node', dir: 'coverage' },
    { label: 'browser', dir: 'coverage-browser' },
];

// ── Merge per-file summaries (union; disjoint file sets) ──────────────────────
const files = {};
for (const { dir } of sources) {
    const summary = loadSummary(dir);
    for (const [k, v] of Object.entries(summary)) if (k !== 'total') files[k] = v;
}

// ── Recompute the grand total from the merged files ───────────────────────────
const total = {};
for (const m of METRICS) {
    let t = 0;
    let c = 0;
    for (const v of Object.values(files)) {
        t += v[m].total;
        c += v[m].covered;
    }
    total[m] = { total: t, covered: c, skipped: 0, pct: t ? Number(((c / t) * 100).toFixed(2)) : 100 };
}

const merged = { total, ...files };
writeFileSync(join(ROOT, 'coverage', 'lcov.json'), JSON.stringify(merged, null, 2) + '\n');

// ── Merge raw lcov.info (node + browser) ──────────────────────────────────────
let lcov = '';
for (const { dir } of sources) {
    const p = join(ROOT, dir, 'lcov.info');
    if (existsSync(p)) lcov += readFileSync(p, 'utf8');
}
if (lcov) writeFileSync(join(ROOT, 'coverage', 'lcov.info'), lcov);

// ── Print the consolidated table ──────────────────────────────────────────────
const rel = (p) => p.replace(ROOT + '/', '');
const pct = (x) => `${x.pct}%`.padStart(7);
const cell = (v) => `${v.covered}/${v.total}`.padStart(9);

const rows = Object.entries(files).sort(([a], [b]) => rel(a).localeCompare(rel(b)));
const nameW = Math.max(8, ...rows.map(([k]) => rel(k).length));

const line = (n, s, b, f, l) => `${n.padEnd(nameW)} │ ${s} │ ${b} │ ${f} │ ${l}`;
const hr = '─'.repeat(nameW + 1) + '┼─────────┼─────────┼─────────┼─────────';

console.log('\nConsolidated coverage — node (theme) + browser (components)\n');
console.log(line('File', 'Stmts'.padStart(7), 'Branch'.padStart(7), 'Funcs'.padStart(7), 'Lines'.padStart(7)));
console.log(hr);
for (const [k, v] of rows) {
    console.log(line(rel(k), pct(v.statements), pct(v.branches), pct(v.functions), pct(v.lines)));
}
console.log(hr);
console.log(line('TOTAL', pct(total.statements), pct(total.branches), pct(total.functions), pct(total.lines)));
console.log('\ncounts (covered/total)');
console.log(line('TOTAL', cell(total.statements), cell(total.branches), cell(total.functions), cell(total.lines)));

const allGreen = METRICS.every((m) => total[m].pct === 100);
console.log(`\n${allGreen ? '✓ 100% across statements, branches, functions, and lines.' : '✗ Coverage below 100%.'}`);
console.log('Wrote coverage/lcov.json and coverage/lcov.info\n');

process.exit(allGreen ? 0 : 1);
