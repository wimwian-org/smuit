/*
 * MIT License
 *
 * Copyright (c) 2026 Anand Panchapakesan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
import { test, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    fmt,
    parseOklch,
    mix,
    tone,
    sizeToRem,
    weightFor,
    round,
    clamp,
    conf,
    parseTypeRamps,
    generate,
    minify,
    describe as themeDescribe,
    mirror,
    isRag,
    stepsOf,
    labelsFor,
    offsetIn,
    pole,
    WHITE,
    BLACK,
    type OKLCH,
} from './theme-gen.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const INPUT = readFileSync(join(HERE, 'input.css'), 'utf8');
const OUTPUT = readFileSync(join(HERE, 'output.css'), 'utf8');

afterEach(() => vi.restoreAllMocks());

// ── fmt ──────────────────────────────────────────────────────────────────────
test('fmt serialises a plain oklch', () => {
    expect(fmt({ l: 0.5, c: 0, h: 0 })).toBe('oklch(0.5 0 0)');
});
test('fmt appends alpha only when < 1', () => {
    expect(fmt({ l: 0.5, c: 0.1, h: 120, a: 1 })).toBe('oklch(0.5 0.1 120)');
    expect(fmt({ l: 0.5, c: 0.1, h: 120, a: 0.8 })).toBe('oklch(0.5 0.1 120 / 0.8)');
});
test('fmt clamps L, floors C, and normalises hue', () => {
    expect(fmt({ l: 1.5, c: -1, h: 400 })).toBe('oklch(1 0 40)');
    expect(fmt({ l: -0.2, c: 0.1, h: -30 })).toBe('oklch(0 0.1 330)');
});

// ── parseOklch ────────────────────────────────────────────────────────────────
test('parseOklch reads L C H', () => {
    expect(parseOklch('oklch(0.485 0.291 264.3)')).toEqual({ l: 0.485, c: 0.291, h: 264.3 });
});
test('parseOklch converts a percentage lightness', () => {
    expect(parseOklch('oklch(50% 0.1 120)')).toEqual({ l: 0.5, c: 0.1, h: 120 });
});
test('parseOklch throws on garbage', () => {
    expect(() => parseOklch('rgb(0 0 0)')).toThrow(/Cannot parse oklch/);
});

// ── mix (the hue branches are only reachable here) ───────────────────────────
test('mix keeps the chromatic hue when one input is an achromatic pole', () => {
    expect(mix(WHITE, { l: 0, c: 0.2, h: 120 }, 0.5).h).toBe(120);
    expect(mix({ l: 0.5, c: 0.2, h: 90 }, BLACK, 0.5).h).toBe(90);
});
test('mix interpolates L and C linearly', () => {
    const r = mix({ l: 0, c: 0, h: 0 }, { l: 1, c: 0.4, h: 0 }, 0.25);
    expect(r.l).toBeCloseTo(0.75);
    expect(r.c).toBeCloseTo(0.3);
});
test('mix takes the shortest hue arc across 0°', () => {
    // a=10°, b=350° → d=340 → wraps to -20 → midpoint 0°
    expect(mix({ l: 0.5, c: 0.2, h: 10 }, { l: 0.5, c: 0.2, h: 350 }, 0.5).h).toBeCloseTo(0);
    // a=350°, b=10° → d=-340 → wraps to +20 → 360°
    expect(mix({ l: 0.5, c: 0.2, h: 350 }, { l: 0.5, c: 0.2, h: 10 }, 0.5).h).toBeCloseTo(360);
});
test('mix without wrapping', () => {
    expect(mix({ l: 0.5, c: 0.2, h: 100 }, { l: 0.5, c: 0.2, h: 120 }, 0.5).h).toBeCloseTo(110);
});

// ── tone ──────────────────────────────────────────────────────────────────────
test('tone(500) returns a copy of the base hue', () => {
    const base: OKLCH = { l: 0.5, c: 0.1, h: 200 };
    const t = tone(base, 500);
    expect(t).toEqual(base);
    expect(t).not.toBe(base);
});
test('tone lightens below 500 and darkens above', () => {
    const base: OKLCH = { l: 0.5, c: 0, h: 0 };
    expect(tone(base, 100).l).toBeCloseTo(0.9); // 80% white
    expect(tone(base, 900).l).toBeCloseTo(0.1); // 80% black
});

// ── sizeToRem ────────────────────────────────────────────────────────────────
test('sizeToRem handles px, rem, and unitless', () => {
    expect(sizeToRem('24px')).toBe(1.5);
    expect(sizeToRem('16')).toBe(1);
    expect(sizeToRem('1.5rem')).toBe(1.5);
});
test('sizeToRem throws on a bad size', () => {
    expect(() => sizeToRem('huge')).toThrow(/Bad type midpoint size/);
});

// ── small helpers ────────────────────────────────────────────────────────────
test('misc helpers', () => {
    expect(weightFor(500)).toBe(0);
    expect(weightFor(50)).toBeCloseTo(0.9);
    expect(round(1.23456, 2)).toBe(1.23);
    expect(clamp(5, 0, 1)).toBe(1);
    expect(mirror(100)).toBe(900);
    expect(isRag('error')).toBe(true);
    expect(isRag('primary')).toBe(false);
    expect(stepsOf('error')).toHaveLength(9);
    expect(stepsOf('primary')).toHaveLength(19);
    expect(labelsFor(3)).toEqual(['sm', 'md', 'lg']);
    expect(offsetIn(['sm', 'md', 'lg'], 'sm')).toBe(-1);
    expect(pole({ l: 0.9, c: 0, h: 0 })).toBe(BLACK);
    expect(pole({ l: 0.1, c: 0, h: 0 })).toBe(WHITE);
});

// ── conf ──────────────────────────────────────────────────────────────────────
test('conf reads a value or falls back', () => {
    expect(conf(':root { --gap: 8px; }', 'gap', 'x')).toBe('8px');
    expect(conf('', 'gap', 'fallback')).toBe('fallback');
});

// ── parseTypeRamps ────────────────────────────────────────────────────────────
test('parseTypeRamps parses steps / midpoint / optional ratio', () => {
    const r = parseTypeRamps('--type-body: 5 16px; --type-title: 3 24px 1.25;', 1.2);
    expect(r).toEqual([
        { role: 'body', steps: 5, mdRem: 1, ratio: 1.2 },
        { role: 'title', steps: 3, mdRem: 1.5, ratio: 1.25 },
    ]);
});
test('parseTypeRamps warns and skips an invalid step count', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const r = parseTypeRamps('--type-body: 5 16px; --type-bad: 9 16px;', 1.2);
    expect(r.map((x) => x.role)).toEqual(['body']);
    expect(warn).toHaveBeenCalledOnce();
});
test('parseTypeRamps throws when no ramps are defined', () => {
    expect(() => parseTypeRamps(':root {}', 1.2)).toThrow(/no --type-<role> ramps/);
});

// ── describe ──────────────────────────────────────────────────────────────────
test('describe returns ramps + elevation steps', () => {
    const d = themeDescribe(INPUT);
    expect(d.elevSteps).toBe(7);
    expect(d.ramps.map((r) => r.role)).toContain('body');
});
test('describe falls back to 7 elevation steps when invalid', () => {
    const bad = INPUT.replace(/--variant-elevation:\s*\d+/, '--variant-elevation: 4');
    expect(themeDescribe(bad).elevSteps).toBe(7);
});

// ── generate ──────────────────────────────────────────────────────────────────
test('minify(generate) is a byte-for-byte match for the committed (minified) output.css', () => {
    expect(minify(generate(INPUT))).toBe(OUTPUT);
});
test('generate is deterministic / idempotent', () => {
    expect(generate(INPUT)).toBe(generate(INPUT));
});
test('minify collapses to one line but preserves significant value spaces', () => {
    const css = minify(generate(INPUT));
    expect(css).not.toContain('\n');
    expect(css).toContain('--color-primary-500:oklch(0.68 0.15 237)'); // intra-value spaces kept
    expect(css).not.toContain('; }'); // structural whitespace gone
});
test('generate emits the expected structure', () => {
    const css = generate(INPUT);
    expect(css).toContain('@theme static {');
    expect(css).toContain('--color-primary-500:');
    expect(css).toContain("[data-theme='dark'] {");
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect((css.match(/^@utility tint-/gm) ?? []).length).toBe(7);
    expect(css).toContain('--text-body-md:');
    expect(css).toContain('--shadow-2xl:');
});
test('generate output has no runtime colour functions in declarations', () => {
    const decls = generate(INPUT)
        .split('\n')
        .filter((l) => !l.trimStart().startsWith('*') && !l.trimStart().startsWith('/*'));
    expect(decls.join('\n')).not.toMatch(/color-mix\(|contrast-color\(|light-dark\(/);
});
test('generate throws when a base hue is missing', () => {
    const missing = INPUT.replace(/--color-success:[^;]*;/, '');
    expect(() => generate(missing)).toThrow(/missing --color-success/);
});
test('generate warns and falls back on an invalid elevation variant', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const bad = INPUT.replace(/--variant-elevation:\s*\d+/, '--variant-elevation: 6');
    const css = generate(bad);
    expect(warn).toHaveBeenCalledOnce();
    expect(css).toContain('--elevation-2xl:'); // still the 7-step set
});
