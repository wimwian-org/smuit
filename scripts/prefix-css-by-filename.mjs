#!/usr/bin/env node
/**
 * sui
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import postcss from 'postcss';

function filenameToClassname(filePath) {
    const base = path.basename(filePath, path.extname(filePath));
    return base.replace(/\./g, '-').toLowerCase();
}

async function prefixSelectors(css, rootClass) {
    // Safer prefixer: split selector by comma and prefix each segment with the root class
    return await postcss([
        (root) => {
            root.walkRules((rule) => {
                // don't prefix keyframe selectors
                if (rule.parent && rule.parent.type === 'atrule' && /keyframes$/.test(rule.parent.name)) return;

                try {
                    const parts = rule.selector.split(',').map((p) => p.trim());
                    const transformed = parts
                        .map((p) => {
                            // skip if selector already contains the root class or is :root/html/body
                            if (
                                p.includes('.' + rootClass) ||
                                p.startsWith(':root') ||
                                p.startsWith('html') ||
                                p.startsWith('body')
                            )
                                return p;
                            return `.${rootClass} ${p}`;
                        })
                        .join(', ');
                    rule.selector = transformed;
                } catch (err) {
                    console.error('Selector transform error for', rule.selector, err.message);
                }
            });
        },
    ])
        .process(css, { from: undefined })
        .then((r) => r.css);
}

async function collectFiles(root, exts) {
    const out = [];
    async function walk(dir) {
        const dirents = await fs.readdir(dir, { withFileTypes: true });
        for (const d of dirents) {
            const res = path.join(dir, d.name);
            if (d.isDirectory()) await walk(res);
            else if (exts.includes(path.extname(d.name))) out.push(res);
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
            files = await collectFiles(path.resolve('src'), ['.css', '.scss']);
        } catch (e) {
            console.error('Failed to scan src:', e.message);
            return;
        }
    }

    const skipNames = new Set(['index.css', 'utilities.css', 'inline-styles.generated.css', 'base.css']);
    for (const file of files) {
        const base = path.basename(file);
        if (skipNames.has(base)) continue;

        // only process css/scss files
        const ext = path.extname(base).toLowerCase();
        if (!['.css', '.scss'].includes(ext)) continue;

        // derive root class from the basename (Card.Root.css -> card-root, button.css -> button)
        const rootClass = filenameToClassname(file);
        const src = await fs.readFile(file, 'utf8');
        const prefixed = await prefixSelectors(src, rootClass);
        await fs.writeFile(file, prefixed, 'utf8');
        console.log('Updated', file, '→', '.' + rootClass);
    }
}

const pattern = process.argv[2] || 'src/**/*.*.@(css|scss)';
run(pattern).catch((e) => {
    console.error(e);
    process.exit(1);
});
