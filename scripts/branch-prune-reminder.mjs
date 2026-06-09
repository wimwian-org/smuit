/*
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
//
// pre-commit reminder (lefthook). Lists local branches that look prunable —
// already merged into an integration branch (dev/master), or whose upstream
// tracking ref is gone. Purely informational: it NEVER fails, so it can't block
// a commit. Skipped on merge/rebase via lefthook config.

import { execSync } from 'node:child_process';

const git = (cmd) => {
    try {
        return execSync(`git ${cmd}`, { encoding: 'utf8' }).trim();
    } catch {
        return '';
    }
};

const current = git('branch --show-current');
const clean = (line) => line.replace(/^[*+]?\s*/, '').trim();

// Never suggest pruning the integration/production branches or the current one.
const PROTECTED = new Set(['dev', 'master', 'main', current]);
const keep = (name) => name && !PROTECTED.has(name) && !name.startsWith('(');

// Local branches already merged into an existing integration branch.
const merged = new Set();
for (const base of ['dev', 'master']) {
    if (!git(`rev-parse --verify --quiet ${base}`)) continue;
    for (const line of git(`branch --merged ${base}`).split('\n')) {
        const name = clean(line);
        if (keep(name)) merged.add(name);
    }
}

// Local branches whose upstream has been deleted ([gone]).
for (const line of git("for-each-ref --format '%(refname:short) %(upstream:track)' refs/heads").split('\n')) {
    const [name, ...rest] = line.split(' ');
    if (rest.join(' ').includes('[gone]') && keep(name)) merged.add(name);
}

const prunable = [...merged];
if (prunable.length) {
    console.log(`\n🥊 ${prunable.length} local branch(es) look prunable: ${prunable.join(', ')}`);
    console.log('   Tidy up with:  pnpm prune:branches   (or  git branch -d <name>)\n');
}

process.exit(0);
