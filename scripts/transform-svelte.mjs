#!/usr/bin/env node
/**
 * sui
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import crypto from 'crypto';

function toClassToken(token) {
    // convert dotted token to hyphenated lowercase
    if (token.includes('.')) return token.replace(/\./g, '-').toLowerCase();
    return token;
}

function makeHash(s) {
    return crypto.createHash('sha1').update(s).digest('hex').slice(0, 8);
}

async function ensureImportInIndex(importLine) {
    const indexPath = path.resolve('src/assets/index.css');
    try {
        let content = await fs.readFile(indexPath, 'utf8');
        if (!content.includes(importLine)) {
            // add import after the first import section if present, otherwise append top
            const lines = content.split('\n');
            let insertAt = 0;
            // after any existing @import lines at the top
            while (insertAt < lines.length && lines[insertAt].trim().startsWith('@import')) insertAt++;
            lines.splice(insertAt, 0, importLine);
            await fs.writeFile(indexPath, lines.join('\n'), 'utf8');
            console.log('Added import to', indexPath);
        }
    } catch (err) {
        console.error('Could not update src/assets/index.css:', err.message);
    }
}

function parseStyleString(styleStr) {
    // naive parser: splits by semicolon, keeps key: value pairs
    const pairs = styleStr
        .split(';')
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => {
            const idx = p.indexOf(':');
            if (idx === -1) return null;
            const key = p.slice(0, idx).trim();
            const val = p.slice(idx + 1).trim();
            return { key, val };
        })
        .filter(Boolean);
    return pairs;
}

async function collectFiles(root, ext) {
    const out = [];
    async function walk(dir) {
        const dirents = await fs.readdir(dir, { withFileTypes: true });
        for (const d of dirents) {
            const res = path.join(dir, d.name);
            if (d.isDirectory()) await walk(res);
            else if (path.extname(d.name) === ext) out.push(res);
        }
    }
    await walk(root);
    return out;
}

async function run(pattern) {
    let files = [];
    if (pattern && pattern.includes('*')) {
        try {
            files = await glob(pattern, { nodir: true });
        } catch {
            files = [];
        }
    }
    if (!files.length) {
        try {
            files = await collectFiles(path.resolve('src'), '.svelte');
        } catch (e) {
            console.error('Failed to scan src for .svelte files:', e.message);
            return;
        }
    }

    const generated = []; // { className, css }
    const skipped = [];

    for (const file of files) {
        let src = await fs.readFile(file, 'utf8');
        let changed = false;

        // 1) transform class="..." and class='...'
        src = src.replace(/class\s*=\s*"([^"]*)"/gs, (match, cls) => {
            const tokens = cls.split(/\s+/).filter(Boolean);
            const newTokens = tokens.map((t) => (t.includes('.') ? toClassToken(t) : t));
            const newCls = newTokens.join(' ');
            if (newCls !== cls) changed = true;
            return `class="${newCls}"`;
        });

        src = src.replace(/class\s*=\s*'([^']*)'/gs, (match, cls) => {
            const tokens = cls.split(/\s+/).filter(Boolean);
            const newTokens = tokens.map((t) => (t.includes('.') ? toClassToken(t) : t));
            const newCls = newTokens.join(' ');
            if (newCls !== cls) changed = true;
            return `class='${newCls}'`;
        });

        // 2) class={"literal"} or class={'literal'} where expression is a literal string
        src = src.replace(/class\s*=\s*\{\s*(["'])([^"']+)\1\s*\}/gs, (match, quote, cls) => {
            const tokens = cls.split(/\s+/).filter(Boolean);
            const newTokens = tokens.map((t) => (t.includes('.') ? toClassToken(t) : t));
            const newCls = newTokens.join(' ');
            if (newCls !== cls) changed = true;
            return `class={${quote}${newCls}${quote}}`;
        });

        // 3) static style="..." — split static declarations from dynamic ones.
        const styleRegex = /style\s*=\s*"([^"]*)"/gs;
        src = src.replace(styleRegex, (match, styleStr) => {
            // split declarations
            const decls = styleStr
                .split(';')
                .map((s) => s.trim())
                .filter(Boolean);
            const staticDecls = [];
            const dynamicDecls = [];
            for (const d of decls) {
                if (d.includes('{') || d.includes('}')) dynamicDecls.push(d);
                else staticDecls.push(d);
            }

            if (!staticDecls.length) {
                // nothing static to extract — leave original attribute untouched (report dynamic if present)
                if (dynamicDecls.length)
                    skipped.push({ file, reason: 'dynamic style(s) found', excerpt: styleStr.slice(0, 80) });
                return match;
            }

            const staticStr = staticDecls.join('; ');
            const pairs = parseStyleString(staticStr);
            if (!pairs.length) return match;

            const className = `inline-style-${makeHash(staticStr)}`;
            const cssBody = pairs.map((p) => `  ${p.key}: ${p.val};`).join('\n');
            const cssRule = `.${className} {\n${cssBody}\n}\n`;
            generated.push({ className, css: cssRule });
            changed = true;

            // rebuild the remaining dynamic style attribute (if any)
            if (dynamicDecls.length) {
                const rest = dynamicDecls.join('; ');
                return `data-inline-class="${className}" style="${rest}"`;
            }

            return `data-inline-class="${className}"`;
        });

        // 4) handle style='...' single quotes — same split logic
        src = src.replace(/style\s*=\s*'([^']*)'/gs, (match, styleStr) => {
            const decls = styleStr
                .split(';')
                .map((s) => s.trim())
                .filter(Boolean);
            const staticDecls = [];
            const dynamicDecls = [];
            for (const d of decls) {
                if (d.includes('{') || d.includes('}')) dynamicDecls.push(d);
                else staticDecls.push(d);
            }

            if (!staticDecls.length) {
                if (dynamicDecls.length)
                    skipped.push({ file, reason: 'dynamic style(s) found', excerpt: styleStr.slice(0, 80) });
                return match;
            }

            const staticStr = staticDecls.join('; ');
            const pairs = parseStyleString(staticStr);
            if (!pairs.length) return match;
            const className = `inline-style-${makeHash(staticStr)}`;
            const cssBody = pairs.map((p) => `  ${p.key}: ${p.val};`).join('\n');
            const cssRule = `.${className} {\n${cssBody}\n}\n`;
            generated.push({ className, css: cssRule });
            changed = true;

            if (dynamicDecls.length) {
                const rest = dynamicDecls.join('; ');
                return `data-inline-class='${className}' style='${rest}'`;
            }

            return `data-inline-class='${className}'`;
        });

        // 5) After marking data-inline-class attributes, merge them into class attributes when present on same tag
        // Merge pattern: <tag ... class="..." ... data-inline-class="name" ...>
        src = src.replace(
            /(<[a-zA-Z0-9-]+\b[^>]*?)\sdata-inline-class=("|')([^"']+)("|')/gs,
            (match, before, q, cname) => {
                // try to find class="..." inside 'before'
                if (/class\s*=/.test(before)) {
                    const updated = before.replace(/class\s*=\s*("|')([^"']*)("|')/s, (m, qq, clsVal) => {
                        const newCls = (clsVal + ' ' + cname).trim();
                        return `class=${qq}${newCls}${qq}`;
                    });
                    return updated;
                } else {
                    // no existing class - add one
                    return `${before} class="${cname}"`;
                }
            },
        );

        // Remove any leftover data-inline-class attributes (if any didn't match above)
        src = src.replace(/\sdata-inline-class=("|')[^"']+("|')/gs, '');

        if (changed) {
            await fs.writeFile(file, src, 'utf8');
            console.log('Updated', file);
        }
    }

    // write generated CSS to src/assets/inline-styles.generated.css
    if (generated.length) {
        const outPath = path.resolve('src/assets/inline-styles.generated.css');
        const dedup = new Map();
        for (const g of generated) dedup.set(g.className, g.css);
        const outCss = Array.from(dedup.values()).join('\n') + '\n';
        await fs.writeFile(outPath, outCss, 'utf8');
        console.log('Wrote', outPath, 'with', dedup.size, 'generated classes');

        // ensure index.css imports it
        await ensureImportInIndex("@import './inline-styles.generated.css';");
    }

    if (skipped.length) {
        console.log('\nSkipped dynamic inline styles (inspect manually):');
        for (const s of skipped.slice(0, 50)) {
            console.log('-', s.file, '→', s.reason, '|', s.excerpt);
        }
    }
}

const pattern = process.argv[2] || 'src/**/*.svelte';
run(pattern).catch((e) => {
    console.error(e);
    process.exit(1);
});
