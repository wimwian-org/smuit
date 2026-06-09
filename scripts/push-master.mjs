/**
 * sui
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
// scripts/push-master.mjs
//
// Promote `dev` → `master` by fast-forward, authenticating with the
// GITHUB_TOKEN in `.env`. `master` is branch-protected (owner-only push,
// no PR, no force, enforce_admins) and only ever advances by fast-forward
// from `dev` — see .claude/gitflow.md. GitHub can't fast-forward through a
// PR, so this is how a release/sync to master is performed.
//
// Anyone holding the owner's token (in repo-root .env, symlinked to
// ~/.ssh/.env) can run it:  `pnpm push:master`
//
// It updates the master ref to origin/dev's current SHA via the API with
// force=false, so GitHub itself rejects anything that isn't a clean
// fast-forward (master must already be an ancestor of dev).

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const API = 'https://api.github.com';

// ── token: process.env first, else parse repo-root .env ──────────────────────
function loadToken() {
    if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN.trim();
    try {
        const env = readFileSync(new URL('../.env', import.meta.url), 'utf8');
        const m = env.match(/^(?:export\s+)?GITHUB_TOKEN=(.*)$/m);
        if (m) return m[1].trim().replace(/^["']|["']$/g, '');
    } catch {
        /* no .env */
    }
    return null;
}

// ── owner/repo from the origin remote (handles SSH, https, and host aliases) ─
function ownerRepo() {
    const url = execFileSync('git', ['remote', 'get-url', 'origin'], { encoding: 'utf8' }).trim();
    const m = url.match(/[:/]([^/:]+)\/([^/]+?)(?:\.git)?$/);
    if (!m) throw new Error(`could not parse owner/repo from remote: ${url}`);
    return { owner: m[1], repo: m[2] };
}

async function gh(token, method, path, body) {
    const res = await fetch(`${API}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'sui-push-master',
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${json.message ?? text}`);
    return json;
}

const token = loadToken();
if (!token) {
    console.error('✗ GITHUB_TOKEN not found — set it in the environment or repo-root .env.');
    process.exit(1);
}

const { owner, repo } = ownerRepo();

try {
    const dev = await gh(token, 'GET', `/repos/${owner}/${repo}/branches/dev`);
    const master = await gh(token, 'GET', `/repos/${owner}/${repo}/branches/master`);
    const devSha = dev.commit.sha;
    const masterSha = master.commit.sha;

    if (devSha === masterSha) {
        console.log(`✓ master is already up to date with dev (${devSha.slice(0, 7)}). Nothing to push.`);
        process.exit(0);
    }

    // force:false → the API performs a fast-forward only and 422s otherwise.
    await gh(token, 'PATCH', `/repos/${owner}/${repo}/git/refs/heads/master`, { sha: devSha, force: false });
    console.log(`✓ master fast-forwarded ${masterSha.slice(0, 7)} → ${devSha.slice(0, 7)} (== dev).`);
} catch (err) {
    const msg = String(err.message);
    if (msg.includes('422') || /not.*fast.?forward|Update is not a fast forward/i.test(msg)) {
        console.error('✗ Not a fast-forward: master is not an ancestor of dev.');
        console.error('  master only advances by fast-forward from dev. Reconcile first');
        console.error('  (merge master into dev via PR), then re-run `pnpm push:master`.');
    } else if (msg.includes('403') || msg.includes('404')) {
        console.error('✗ Push to master rejected — your token lacks owner push rights on this branch.');
        console.error(`  ${msg}`);
    } else {
        console.error(`✗ ${msg}`);
    }
    process.exit(1);
}
