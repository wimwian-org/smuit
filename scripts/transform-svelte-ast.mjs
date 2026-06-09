#!/usr/bin/env node
/**
 * sui
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import { parse } from 'svelte/compiler';
import crypto from 'crypto';

function makeHash(s) {
    return crypto.createHash('sha1').update(s).digest('hex').slice(0, 8);
}

function parseStyleString(styleStr) {
    return styleStr
        .split(';')
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => {
            const idx = p.indexOf(':');
            if (idx === -1) return null;
            return { key: p.slice(0, idx).trim(), val: p.slice(idx + 1).trim() };
        })
        .filter(Boolean);
}

async function ensureImportInIndex(importLine) {
    const indexPath = path.resolve('src/assets/index.css');
    try {
        let content = await fs.readFile(indexPath, 'utf8');
        if (!content.includes(importLine)) {
            const lines = content.split('\n');
            let insertAt = 0;
            while (insertAt < lines.length && lines[insertAt].trim().startsWith('@import')) insertAt++;
            lines.splice(insertAt, 0, importLine);
            await fs.writeFile(indexPath, lines.join('\n'), 'utf8');
            console.log('Added import to', indexPath);
        }
    } catch (err) {
        console.error('Could not update src/assets/index.css:', err.message);
    }
}

function toClassToken(token) {
    return token.replace(/\./g, '-').toLowerCase();
}

function joinTextValues(values) {
    return values.map((v) => (v.type === 'Text' ? v.data : '')).join('');
}

function collectFiles(root, ext) {
    const out = [];
    async function walk(dir) {
        const dirents = await fs.readdir(dir, { withFileTypes: true });
        for (const d of dirents) {
            const res = path.join(dir, d.name);
            if (d.isDirectory()) await walk(res);
            else if (path.extname(d.name) === ext) out.push(res);
        }
    }
    return walk(root).then(() => out);
}

async function processFile(file, generatedMap, skipped) {
    const src = await fs.readFile(file, 'utf8');
    let ast;
    try {
        // modern: false → legacy AST (ast.html, node.type 'Element', attribute
        // .value as a Text array), which this walker is written against. Svelte 5
        // defaults to the modern AST (.fragment / 'RegularElement').
        ast = parse(src, { filename: file, modern: false });
    } catch (e) {
        console.error('Failed to parse', file, e.message);
        return null;
    }

    const edits = [];

    function addEdit(start, end, replacement) {
        edits.push({ start, end, replacement });
    }

    function insertAt(pos, text) {
        edits.push({ start: pos, end: pos, replacement: text });
    }

    function processAttributes(node) {
        if (!node.attributes || !node.attributes.length) return;
        const attrs = node.attributes;

        const styleAttr = attrs.find((a) => a.type === 'Attribute' && a.name === 'style');
        const classAttr = attrs.find((a) => a.type === 'Attribute' && a.name === 'class');

        // Is the class attribute a static (all-Text) value we can rewrite?
        const classIsStatic = classAttr && classAttr.value && classAttr.value.every((v) => v.type === 'Text');
        const origClass = classIsStatic ? joinTextValues(classAttr.value) : null;

        // Dot-convert the class tokens (Card.Root → card-root).
        let finalClass =
            origClass === null
                ? null
                : origClass
                      .split(/\s+/)
                      .filter(Boolean)
                      .map((t) => (t.includes('.') ? toClassToken(t) : t))
                      .join(' ');

        // Extract static style declarations into a generated class.
        let styleClassName = null;
        if (styleAttr && styleAttr.value && styleAttr.value.length === 1 && styleAttr.value[0].type === 'Text') {
            const styleStr = styleAttr.value[0].data;
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

            if (staticDecls.length) {
                const staticStr = staticDecls.join('; ');
                const pairs = parseStyleString(staticStr);
                if (pairs.length) {
                    styleClassName = `inline-style-${makeHash(staticStr)}`;
                    if (!generatedMap.has(styleClassName)) {
                        const cssBody = pairs.map((p) => `  ${p.key}: ${p.val};`).join('\n');
                        generatedMap.set(styleClassName, `.${styleClassName} {\n${cssBody}\n}\n`);
                    }
                    // Keep only the dynamic declarations; drop the attribute if none remain.
                    if (dynamicDecls.length) {
                        addEdit(styleAttr.start, styleAttr.end, `style="${dynamicDecls.join('; ')}"`);
                    } else {
                        addEdit(styleAttr.start, styleAttr.end, '');
                    }
                }
            } else if (dynamicDecls.length) {
                skipped.push({ file, reason: 'dynamic style(s) found', excerpt: styleStr.slice(0, 80) });
            }
        } else if (styleAttr) {
            // style attribute exists but is not a simple text node (contains mustache or expression)
            skipped.push({
                file,
                reason: 'complex/dynamic style attribute',
                excerpt: src.slice(styleAttr.start, styleAttr.end).slice(0, 120),
            });
        }

        // Emit ONE class edit combining the dot-conversion and the generated
        // style class, so the two transforms can't clobber each other's edit
        // on the same attribute range.
        if (styleClassName) {
            finalClass = finalClass ? `${finalClass} ${styleClassName}` : styleClassName;
        }
        if (classIsStatic) {
            if (finalClass !== origClass) {
                addEdit(classAttr.start, classAttr.end, `class="${finalClass}"`);
            }
        } else if (styleClassName) {
            insertAt(styleAttr.end, ` class="${styleClassName}"`);
        }
    }

    function walk(node) {
        if (!node) return;
        if (node.type === 'Element') processAttributes(node);
        const children = node.children || [];
        for (const c of children) walk(c);
    }

    walk(ast.html);

    if (!edits.length) return null;

    // apply edits in reverse order
    edits.sort((a, b) => b.start - a.start);
    let newSrc = src;
    for (const e of edits) {
        newSrc = newSrc.slice(0, e.start) + e.replacement + newSrc.slice(e.end);
    }

    await fs.writeFile(file, newSrc, 'utf8');
    return true;
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
    if (!files.length) files = await collectFiles(path.resolve('src'), '.svelte');

    const generatedMap = new Map();
    const skipped = [];

    for (const file of files) {
        const res = await processFile(file, generatedMap, skipped);
        if (res) console.log('Updated', file);
    }

    if (generatedMap.size) {
        const outPath = path.resolve('src/assets/inline-styles.generated.css');
        const outCss = Array.from(generatedMap.values()).join('\n') + '\n';
        await fs.writeFile(outPath, outCss, 'utf8');
        console.log('Wrote', outPath, 'with', generatedMap.size, 'generated classes');
        await ensureImportInIndex("@import './inline-styles.generated.css';");
    }

    if (skipped.length) {
        console.log('\nSkipped dynamic/complex inline styles (inspect manually):');
        for (const s of skipped.slice(0, 200)) console.log('-', s.file, '→', s.reason, '|', s.excerpt);
    }
}

const pattern = process.argv[2] || 'src/**/*.svelte';
run(pattern).catch((e) => {
    console.error(e);
    process.exit(1);
});
