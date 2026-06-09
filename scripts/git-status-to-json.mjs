/**
 * sui
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
// scripts/git-status-to-json.mjs
//
// Runs `git status --porcelain` and writes a per-bit clean/dirty
// snapshot to src/routes/git-status.json. The homepage card grid
// renders that as the [WT: clean] / [WT: dirty] badge next to the
// L/S/B/F coverage badges.
//
// A bit is "dirty" if any uncommitted change (modified, added, deleted,
// untracked) touches either of:
//   - src/components/<Bit>/       (the component code)
//   - src/routes/<bit>/           (the demo route, lowercased)
// All other bits are "clean".
//
// Why a snapshot file rather than a live vite plugin: matches the
// coverage.json model the homepage already uses, and makes the data
// visible in static builds too (the demo site freezes whatever state
// existed at build time, which is what consumers expect to see on a
// deployed playground). Run `pnpm status` to refresh.
//
// Bits are discovered by listing src/components/* directories — no manual
// list to keep in sync. A bit with no demo route just relies on the
// component-dir check; a bit with no component code (e.g. a future
// demo-only experiment) would fall out of the listing entirely.

import { execSync } from 'node:child_process';
import { readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const bitsRoot = resolve(repoRoot, 'components');
const outputPath = resolve(repoRoot, 'apps/playground/src/routes/git-status.json');

// 1. Enumerate the bits. Filter to directories; ignore anything else
//    that sneaks in at the top level.
const bits = readdirSync(bitsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

// 2. Pull the porcelain output. `--porcelain=v1` is the stable parseable
//    form: two-char status code, space, path. Renamed paths use ` -> `
//    notation which we DON'T split on — for our use case (any change at
//    all marks the bit dirty), either side of the arrow being inside the
//    bit's dirs is enough.
let porcelain = '';
try {
    porcelain = execSync('git status --porcelain=v1', {
        cwd: repoRoot,
        encoding: 'utf8',
    });
} catch (err) {
    // Not a git repo, or git not on PATH. Treat every bit as clean and
    // emit a marker so the homepage knows the snapshot is unreliable.
    console.warn(`[git-status-to-json] git unavailable (${err.message}); marking all bits clean.`);
}

// 3. For each changed line, identify the touched paths. Porcelain v1
//    layout is XY<space><path>[ -> <new-path>], with paths quoted if
//    they contain spaces (we sidestep quoting by checking substrings
//    rather than parsing path tokens exactly).
const changedPaths = new Set();
for (const line of porcelain.split('\n')) {
    if (!line) continue;
    // Drop the two status chars + the separator space (always 3 chars).
    const pathPart = line.slice(3);
    // For renames "old -> new" we want both halves to count, since a file
    // moved INTO a bit dir should still mark it dirty.
    const halves = pathPart.split(' -> ');
    for (const half of halves) {
        // Strip the optional surrounding quotes git adds for paths with
        // special chars — innermost characters matter, not the wrapping.
        const cleaned = half.replace(/^"|"$/g, '');
        if (cleaned) changedPaths.add(cleaned);
    }
}

// 4. Build the output map. A bit's filter check covers both possible
//    homes for its files. Lowercase the PascalCase bit name to derive
//    the demo route — the project convention used by every existing
//    bit (Combobox → combobox, ThemeToggle → themetoggle? actually the
//    routes use lowercase concatenation: theme-toggle isn't a route,
//    but no demo route exists for it anyway). We use a Set for O(1)
//    lookups instead of nested .some().
const output = {};
for (const bit of bits) {
    const componentPrefix = `components/${bit}/`;
    const demoPrefix = `apps/playground/src/routes/${bit.toLowerCase()}/`;
    let dirty = false;
    for (const path of changedPaths) {
        if (path.startsWith(componentPrefix) || path.startsWith(demoPrefix)) {
            dirty = true;
            break;
        }
    }
    output[bit] = dirty ? 'dirty' : 'clean';
}

// 5. Trailing newline + 2-space indent so diffs are stable. Same shape
//    as coverage.json (object keyed by PascalCase bit name) so the
//    homepage's lookup pattern stays uniform across the two files.
writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n');

const dirtyCount = Object.values(output).filter((v) => v === 'dirty').length;
console.log(
    `[git-status-to-json] ${bits.length} bits → ${outputPath}` +
        (dirtyCount > 0 ? ` (${dirtyCount} dirty)` : ' (all clean)'),
);
