/**
 * sui
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
// scripts/prune-branches.mjs
//
// Prune stale branches — delete every branch already merged into `origin/dev`
// (both local and on origin), keeping the long-lived `dev` / `master` and the
// branch you're currently on. Run it with `pnpm prune:branches`.
//
// It also stamps the prune time into `.git/last-branch-prune` (per-clone,
// untracked). The pre-commit guard (scripts/branch-prune-reminder.mjs) reads
// that stamp to nag after 7 days and block check-ins after 10 — running this
// resets the clock.
//
// Remote deletes use your normal git auth (the repo pushes over SSH); if you
// lack push rights, the local prune + stamp still succeed and the remote
// deletes are skipped with a note.

import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const sh = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim();
const lines = (cmd) => {
    try {
        return sh(cmd)
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean);
    } catch {
        return [];
    }
};

const KEEP = new Set(['dev', 'master', 'HEAD']);
try {
    KEEP.add(sh('git rev-parse --abbrev-ref HEAD'));
} catch {
    /* detached HEAD — nothing extra to keep */
}

const BASE = 'origin/dev';

console.log('Fetching + pruning remote-tracking refs…');
try {
    sh('git fetch --prune --quiet origin');
} catch {
    console.log('  ! could not fetch (offline?) — pruning against the local view');
}

// Local branches whose tip is reachable from origin/dev → already merged.
const localMerged = lines(`git branch --merged ${BASE}`)
    .map((b) => b.replace(/^[*+]\s*/, '').trim())
    .filter((b) => b && !KEEP.has(b));

// Remote branches merged into origin/dev (skip the origin/HEAD -> ... alias).
const remoteMerged = lines(`git branch -r --merged ${BASE}`)
    .filter((b) => b.startsWith('origin/') && !b.includes('->'))
    .map((b) => b.slice('origin/'.length).trim())
    .filter((b) => b && !KEEP.has(b));

let deleted = 0;
for (const b of localMerged) {
    try {
        sh(`git branch -d ${b}`);
        console.log(`  ✓ deleted local  ${b}`);
        deleted++;
    } catch (e) {
        console.log(`  ! skip local ${b}: ${String(e.message).split('\n')[0]}`);
    }
}
for (const b of remoteMerged) {
    try {
        sh(`git push origin --delete ${b}`);
        console.log(`  ✓ deleted remote origin/${b}`);
        deleted++;
    } catch (e) {
        console.log(`  ! skip remote ${b}: ${String(e.message).split('\n')[0]}`);
    }
}

writeFileSync('.git/last-branch-prune', String(Date.now()));
console.log(
    deleted
        ? `\nPruned ${deleted} stale branch(es). Prune clock reset (next due in 7 days).`
        : '\nNo stale branches to prune. Prune clock reset (next due in 7 days).',
);
