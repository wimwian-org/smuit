/*
 * @smuit/theme — flat theme generator (pure core)
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */

/*
 * The side-effect-free heart of the flat-theme generator. `generate(source)`
 * takes the contents of input.css and returns the contents of output.css — no
 * file IO, no process state — so it can be unit-tested directly. The thin CLI
 * shell that reads/writes files lives in build-theme.ts.
 *
 * See build-theme.ts for the full architecture/maintenance notes.
 */

// ── Colour model ─────────────────────────────────────────────────────────────
/** An oklch colour. `l` 0–1, `c` ≥ 0, `h` degrees, optional alpha `a` 0–1. */
export type OKLCH = { l: number; c: number; h: number; a?: number };

// ── Palette taxonomy ─────────────────────────────────────────────────────────
export const BRAND_STEPS = [
    50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
];
export const RAG_STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export const BRAND = ['mono', 'primary', 'secondary', 'tertiary'] as const;
export const RAG = ['error', 'warning', 'success'] as const;
export const ALL = [...BRAND, ...RAG] as const;
export type Name = (typeof ALL)[number];

export const isRag = (name: string): boolean => (RAG as readonly string[]).includes(name);
export const stepsOf = (name: string): number[] => (isRag(name) ? RAG_STEPS : BRAND_STEPS);

/** The dark-mode mirror of a colour step: 100 ↔ 900, 50 ↔ 950, 500 ↔ 500. */
export const mirror = (n: number): number => 1000 - n;

// ── Colour recipe knobs ──────────────────────────────────────────────────────
export const weightFor = (n: number): number => Math.abs(n - 500) / 500;

export const BG_STEP = { brand: 100, rag: 200 };
export const SOLID_FG = { brand: { light: 50, dark: 950 }, rag: { light: 100, dark: 900 } };

export const FG_POLE = 0.8;
export const BORDER_POLE = 0.55;
export const BORDER_BOLD_POLE = 0.4;
export const MUTED_ALPHA = 0.8;

// ── Ramp taxonomy ────────────────────────────────────────────────────────────
export const RAMP_LABELS: Record<number, string[]> = {
    3: ['sm', 'md', 'lg'],
    5: ['xs', 'sm', 'md', 'lg', 'xl'],
    7: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
};

const SHADOW_GEOMETRY = {
    umbra: { y: 0.4, blur: 0.9, spread: -0.2 },
    penumbra: { y: 0.15, blur: 0.4, spread: -0.1 },
};
const SHADOW_COLOR = {
    light: { umbra: 'oklch(0 0 0 / 0.14)', penumbra: 'oklch(0 0 0 / 0.08)' },
    dark: { umbra: 'oklch(0 0 0 / 0.44)', penumbra: 'oklch(0 0 0 / 0.32)' },
};

export const WHITE: OKLCH = { l: 1, c: 0, h: 0 };
export const BLACK: OKLCH = { l: 0, c: 0, h: 0 };

export const SURFACE_ROLES = [
    'bg',
    'bg-muted',
    'fg',
    'border',
    'border-bold',
    'accent',
    'solid',
    'solid-hover',
    'solid-fg',
];

// ── Maths helpers ────────────────────────────────────────────────────────────
export const round = (x: number, d: number): number => {
    const f = 10 ** d;
    return Math.round(x * f) / f;
};
export const clamp = (x: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, x));

/** Serialise an OKLCH to a minimal, deterministic `oklch(...)` string. */
export function fmt(o: OKLCH): string {
    const l = round(clamp(o.l, 0, 1), 4);
    const c = round(Math.max(0, o.c), 4);
    const h = round(((o.h % 360) + 360) % 360, 2);
    const a = o.a ?? 1;
    const body = `${l} ${c} ${h}`;
    return a >= 1 ? `oklch(${body})` : `oklch(${body} / ${round(a, 3)})`;
}

/** Parse `oklch(L C H)` (L may be a percentage). */
export function parseOklch(s: string): OKLCH {
    const m = /oklch\(\s*([0-9.]+)(%?)\s+([0-9.]+)\s+([-0-9.]+)/i.exec(s);
    if (!m) throw new Error(`Cannot parse oklch from: ${s}`);
    const l = m[2] === '%' ? Number(m[1]) / 100 : Number(m[1]);
    return { l, c: Number(m[3]), h: Number(m[4]) };
}

/**
 * Mix two colours in cylindrical oklch; `wa` is the weight of `a` (0..1). L and
 * C interpolate linearly; hue takes the shortest arc, except an achromatic
 * input (a black/white pole) keeps the other's hue.
 */
export function mix(a: OKLCH, b: OKLCH, wa: number): OKLCH {
    const wb = 1 - wa;
    const l = a.l * wa + b.l * wb;
    const c = a.c * wa + b.c * wb;
    let h: number;
    if (a.c < 1e-4) h = b.h;
    else if (b.c < 1e-4) h = a.h;
    else {
        let d = b.h - a.h;
        if (d > 180) d -= 360;
        else if (d < -180) d += 360;
        h = a.h + d * wb;
    }
    return { l, c, h };
}

/** Tonal step N of a base hue: lighten toward white below 500, darken above. */
export function tone(baseHue: OKLCH, n: number): OKLCH {
    if (n === 500) return { ...baseHue };
    return n < 500 ? mix(WHITE, baseHue, weightFor(n)) : mix(BLACK, baseHue, weightFor(n));
}

export const pole = (bg: OKLCH): OKLCH => (bg.l > 0.5 ? BLACK : WHITE);
export const fgFor = (bg: OKLCH, accent: OKLCH): OKLCH => mix(pole(bg), accent, FG_POLE);
export const borderFor = (bg: OKLCH, accent: OKLCH): OKLCH => mix(pole(bg), accent, BORDER_POLE);
export const borderBoldFor = (bg: OKLCH, accent: OKLCH): OKLCH => mix(pole(bg), accent, BORDER_BOLD_POLE);

export const labelsFor = (steps: number): string[] => RAMP_LABELS[steps];
export const offsetIn = (labels: string[], label: string): number => labels.indexOf(label) - labels.indexOf('md');

/** Parse a type midpoint size (px | rem | unitless=px) into rem (16px root). */
export function sizeToRem(token: string): number {
    const m = /^([0-9.]+)(px|rem)?$/.exec(token.trim());
    if (!m) throw new Error(`Bad type midpoint size: "${token}"`);
    const n = Number(m[1]);
    return m[2] === 'rem' ? n : n / 16;
}

/** Grab the value of a custom property from CSS source by name (first match). */
export function conf(source: string, name: string, fallback: string): string {
    const m = new RegExp(`--${name}\\s*:\\s*([^;]+);`, 'i').exec(source);
    return m ? m[1].trim() : fallback;
}

export type TypeRamp = { role: string; steps: number; mdRem: number; ratio: number };

/** Parse every `--type-<role>: <steps> <midpoint> [ratio]` declaration. */
export function parseTypeRamps(source: string, defaultRatio: number): TypeRamp[] {
    const ramps: TypeRamp[] = [];
    const re = /--type-([a-z0-9-]+)\s*:\s*([^;]+);/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(source))) {
        const parts = m[2].trim().split(/\s+/);
        const steps = Number(parts[0]);
        if (!RAMP_LABELS[steps]) {
            console.warn(`--type-${m[1]}: steps must be 3, 5, or 7 (got "${parts[0]}"); skipping.`);
            continue;
        }
        ramps.push({
            role: m[1],
            steps,
            mdRem: sizeToRem(parts[1]),
            ratio: parts[2] ? Number(parts[2]) : defaultRatio,
        });
    }
    if (!ramps.length) throw new Error('input.css defines no --type-<role> ramps');
    return ramps;
}

// ── Emit helpers (pure formatting) ───────────────────────────────────────────
const pad = (s: string, n: number): string => (s.length >= n ? s : s + ' '.repeat(n - s.length));
const decl = (prop: string, value: string, width = 0): string => `    ${pad(`${prop}:`, width)} ${value};`;
/** Indent every non-blank line of a block by `n` spaces (for nesting in @media). */
const indent = (block: string, n: number): string =>
    block
        .split('\n')
        .map((l) => (l.trim() ? ' '.repeat(n) + l : l))
        .join('\n');

const DANGER = `/* ============================================================================
 *   ⚠  GENERATED FILE — DO NOT EDIT  ⚠
 *
 *   @smuit/theme — flat distributable theme. Every value is baked to a literal:
 *   colours as oklch(), type as rem, shadows as full box-shadow strings. No
 *   color-mix(), no contrast-color(), no light-dark().
 *
 *   This file is produced by build-theme.ts from input.css. ANY hand edit here
 *   will be obliterated — silently and completely — the next time the theme is
 *   regenerated. Editing this file to change a value is editing the wrong file,
 *   and the wrong file edits you back. Abandon hope, ye who hardcode here.
 *
 *   To change the theme, edit input.css (hues, fonts, ramp knobs) and rebuild:
 *
 *       pnpm --filter @smuit/theme build:theme
 *
 *   Light is the default. Dark applies via [data-theme='dark'] OR the OS
 *   preference (prefers-color-scheme: dark), unless [data-theme='light'] is
 *   explicitly set. Copyright (c) 2026 Anand Panchapakesan · MIT.
 * ============================================================================ */`;

/** Metadata about a parsed input — handy for CLI logging. */
export function describe(source: string): { ramps: TypeRamp[]; elevSteps: number } {
    const fontRatio = Number(conf(source, 'font-ratio', '1.2'));
    const ramps = parseTypeRamps(source, fontRatio);
    let elevSteps = Number(conf(source, 'variant-elevation', '7'));
    if (!RAMP_LABELS[elevSteps]) elevSteps = 7;
    return { ramps, elevSteps };
}

/**
 * Transform input.css contents into output.css contents. Pure and deterministic:
 * the same `source` always yields byte-identical output.
 */
export function generate(source: string): string {
    // ── Resolve input ─────────────────────────────────────────────────────────
    const baseHue = {} as Record<Name, OKLCH>;
    for (const name of ALL) {
        const m = new RegExp(`--color-${name}\\s*:\\s*(oklch\\([^)]*\\))`, 'i').exec(source);
        if (!m) throw new Error(`input.css is missing --color-${name}`);
        baseHue[name] = parseOklch(m[1]);
    }

    const FONT_SANS = conf(source, 'font-sans', 'ui-sans-serif, system-ui, sans-serif');
    const FONT_MONO = conf(source, 'font-mono', 'ui-monospace, monospace');
    const FONT_RATIO = Number(conf(source, 'font-ratio', '1.2'));
    const LINE_HEIGHT_MD = Number(conf(source, 'line-height-md', '1.5'));

    const TYPE_RAMPS = parseTypeRamps(source, FONT_RATIO);

    let ELEV_STEPS = Number(conf(source, 'variant-elevation', '7'));
    if (!RAMP_LABELS[ELEV_STEPS]) {
        console.warn(`--variant-elevation must be 3, 5, or 7 (got ${ELEV_STEPS}); falling back to 7.`);
        ELEV_STEPS = 7;
    }
    const ELEV_LABELS = labelsFor(ELEV_STEPS);
    const ELEVATION_MD = Number(conf(source, 'elevation-md', '6'));
    const ELEVATION_RATIO = Number(conf(source, 'elevation-ratio', '1.8'));
    const elevationAt = (label: string): number =>
        round(ELEVATION_MD * ELEVATION_RATIO ** offsetIn(ELEV_LABELS, label), 2);

    const toneCache = {} as Record<Name, Record<number, OKLCH>>;
    for (const name of ALL) {
        toneCache[name] = {};
        for (const n of stepsOf(name)) toneCache[name][n] = tone(baseHue[name], n);
    }
    const toneOf = (name: Name, n: number): OKLCH => toneCache[name][n];

    // ── Emit functions (close over the parsed state) ──────────────────────────
    function surfaceValues(name: Name, dark: boolean): Record<string, string> {
        const rag = isRag(name);
        const bgStep = rag ? BG_STEP.rag : BG_STEP.brand;
        const bg = toneOf(name, dark ? mirror(bgStep) : bgStep);
        const accent = toneOf(name, 500);
        const sfg = rag ? SOLID_FG.rag : SOLID_FG.brand;
        return {
            bg: fmt(bg),
            'bg-muted': fmt({ ...bg, a: MUTED_ALPHA }),
            fg: fmt(fgFor(bg, accent)),
            border: fmt(borderFor(bg, accent)),
            'border-bold': fmt(borderBoldFor(bg, accent)),
            accent: fmt(accent),
            solid: fmt(toneOf(name, dark ? 400 : 600)),
            'solid-hover': fmt(toneOf(name, dark ? 300 : 700)),
            'solid-fg': fmt(toneOf(name, dark ? sfg.dark : sfg.light)),
        };
    }

    function scaleBlock(label: string, varName: string, src: Name, steps: number[], dark: boolean): string {
        const lines = [`    /* ${label} */`];
        for (const n of steps) lines.push(decl(`--color-${varName}-${n}`, fmt(toneOf(src, dark ? mirror(n) : n))));
        return lines.join('\n');
    }

    function primitivesBlock(): string {
        const lines: string[] = [];
        for (const name of ALL) {
            lines.push(`    /* ${name} */`);
            lines.push(decl(`--color-${name}`, fmt(baseHue[name])));
            for (const n of stepsOf(name)) lines.push(decl(`--color-${name}-${n}`, fmt(toneOf(name, n))));
        }
        return lines.join('\n');
    }

    function fontRampBlock(): string {
        const blocks: string[] = [];
        for (const ramp of TYPE_RAMPS) {
            const labels = labelsFor(ramp.steps);
            const lines = [
                `    /* ${ramp.role} — ${ramp.steps}-step · md ${round(ramp.mdRem, 4)}rem · ×${ramp.ratio} */`,
            ];
            for (const label of labels) {
                const o = offsetIn(labels, label);
                const size = round(ramp.mdRem * ramp.ratio ** o, 4);
                const lh = round(clamp(LINE_HEIGHT_MD - o * 0.06, 1.1, 1.8), 3);
                lines.push(decl(`--text-${ramp.role}-${label}`, `${size}rem`));
                lines.push(decl(`--text-${ramp.role}-${label}--line-height`, `${lh}`));
            }
            blocks.push(lines.join('\n'));
        }
        return blocks.join('\n\n');
    }

    function shadowRampBlock(): string {
        const lines: string[] = [];
        for (const label of ELEV_LABELS) {
            const e = elevationAt(label);
            const u = SHADOW_GEOMETRY.umbra;
            const p = SHADOW_GEOMETRY.penumbra;
            const layer = (g: typeof u, color: string): string =>
                `0 ${round(e * g.y, 2)}px ${round(e * g.blur, 2)}px ${round(e * g.spread, 2)}px var(${color})`;
            lines.push(decl(`--shadow-${label}`, `${layer(u, '--shadow-umbra')}, ${layer(p, '--shadow-penumbra')}`));
        }
        return lines.join('\n');
    }

    function elevationRampBlock(): string {
        return ELEV_LABELS.map((label) => decl(`--elevation-${label}`, `${elevationAt(label)}`, 20)).join('\n');
    }

    function shadowColorBlock(dark: boolean): string {
        const c = dark ? SHADOW_COLOR.dark : SHADOW_COLOR.light;
        return [decl('--shadow-umbra', c.umbra, 20), decl('--shadow-penumbra', c.penumbra, 20)].join('\n');
    }

    function perPaletteSurfaceBlock(dark: boolean): string {
        const blocks: string[] = [];
        for (const name of ALL) {
            const v = surfaceValues(name, dark);
            const lines = [`    /* ${name} */`];
            for (const role of SURFACE_ROLES) lines.push(decl(`--surface-${name}-${role}`, v[role], 30));
            blocks.push(lines.join('\n'));
        }
        return blocks.join('\n\n');
    }

    function genericSurfaceBlock(dark: boolean): string {
        const v = surfaceValues('mono', dark);
        const lines = [`    /* generic surface — mono by default; retinted by the tint classes below */`];
        for (const role of SURFACE_ROLES) lines.push(decl(`--surface-${role}`, v[role], 22));
        return lines.join('\n');
    }

    function elevationSurfaceBlock(dark: boolean): string {
        const parts: string[] = [];
        for (const [label, step] of [
            ['page', 50],
            ['canvas', 100],
        ] as const) {
            const bg = toneOf('mono', dark ? mirror(step) : step);
            parts.push(
                [
                    `    /* ${label} */`,
                    decl(`--${label}-bg`, fmt(bg), 18),
                    decl(`--${label}-fg`, fmt(fgFor(bg, baseHue.mono)), 18),
                    decl(`--${label}-border`, fmt(borderFor(bg, baseHue.mono)), 18),
                ].join('\n'),
            );
        }
        return parts.join('\n\n');
    }

    function contentScaleLines(name: Name, dark: boolean): string {
        const rag = isRag(name);
        const steps = rag ? RAG_STEPS : BRAND_STEPS;
        const v = rag ? 'rag' : 'c';
        return steps.map((n) => decl(`--color-${v}-${n}`, fmt(toneOf(name, dark ? mirror(n) : n)))).join('\n');
    }

    function tintUtility(name: Name): string {
        const aliases = SURFACE_ROLES.map((role) => decl(`--surface-${role}`, `var(--surface-${name}-${role})`)).join(
            '\n',
        );
        const dark = contentScaleLines(name, true);
        return [
            `@utility tint-${name} {`,
            `    /* generic surface → per-palette tokens (already theme-aware) */`,
            aliases,
            `    /* content scale — light */`,
            contentScaleLines(name, false),
            `    /* content scale — dark (explicit toggle) */`,
            `    [data-theme='dark'] & {`,
            indent(dark, 4),
            `    }`,
            `    /* content scale — dark (OS fallback) */`,
            `    @media (prefers-color-scheme: dark) {`,
            `        :root:not([data-theme='light']) & {`,
            indent(dark, 8),
            `        }`,
            `    }`,
            `}`,
        ].join('\n');
    }

    function lightRootInner(): string {
        return [
            `    /* ── Elevation ramp (dp) — theme-independent ──────────────────── */`,
            elevationRampBlock(),
            ``,
            `    /* ── Shadow colours (light) ───────────────────────────────────── */`,
            shadowColorBlock(false),
            ``,
            `    /* ── Elevation surfaces ───────────────────────────────────────── */`,
            elevationSurfaceBlock(false),
            ``,
            `    /* ── Per-palette surface tokens ───────────────────────────────── */`,
            perPaletteSurfaceBlock(false),
            ``,
            genericSurfaceBlock(false),
        ].join('\n');
    }

    function darkLayerInner(): string {
        return [
            `    /* ── Scales (mirrored steps) ──────────────────────────────────── */`,
            scaleBlock('ground', 'g', 'mono', BRAND_STEPS, true),
            ``,
            scaleBlock('content', 'c', 'primary', BRAND_STEPS, true),
            ``,
            scaleBlock('rag', 'rag', 'error', RAG_STEPS, true),
            ``,
            `    /* ── Shadow colours (dark — stronger) ─────────────────────────── */`,
            shadowColorBlock(true),
            ``,
            `    /* ── Elevation surfaces ───────────────────────────────────────── */`,
            elevationSurfaceBlock(true),
            ``,
            `    /* ── Per-palette surface tokens ───────────────────────────────── */`,
            perPaletteSurfaceBlock(true),
            ``,
            genericSurfaceBlock(true),
        ].join('\n');
    }

    // ── Assemble ──────────────────────────────────────────────────────────────
    const darkInner = darkLayerInner();

    return [
        DANGER,
        ``,
        `/* color-scheme keeps native form controls / scrollbars in step with the theme */`,
        `:root { color-scheme: light; }`,
        `[data-theme='light'] { color-scheme: light; }`,
        `[data-theme='dark'] { color-scheme: dark; }`,
        `@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) { color-scheme: dark; } }`,
        ``,
        `/* ─────────────────────────────────────────────────────────────────────────`,
        `   LIGHT THEME (default) — primitives, scales, fonts, and ramps; these`,
        `   declarations register the Tailwind utilities (bg-*, text-*, shadow-*, …).`,
        `   ───────────────────────────────────────────────────────────────────────── */`,
        `@theme static {`,
        `    /* 'static' pins these tokens into :root so runtime var(--color-…) access`,
        `       keeps working — the tree-shaker can't see vars read from JS/inline styles.`,
        `       Tailwind still emits the bg-* / text-* / shadow-* UTILITIES on demand. */`,
        `    /* ── Primitive palettes — concrete oklch, theme-independent ────── */`,
        primitivesBlock(),
        ``,
        `    /* ── Ground scale (neutral) ───────────────────────────────────── */`,
        scaleBlock('ground', 'g', 'mono', BRAND_STEPS, false),
        ``,
        `    /* ── Content scale (default = primary) ────────────────────────── */`,
        scaleBlock('content', 'c', 'primary', BRAND_STEPS, false),
        ``,
        `    /* ── RAG scale (default = error) ──────────────────────────────── */`,
        scaleBlock('rag', 'rag', 'error', RAG_STEPS, false),
        ``,
        `    /* ── Fonts ────────────────────────────────────────────────────── */`,
        decl('--font-sans', FONT_SANS),
        decl('--font-mono', FONT_MONO),
        ``,
        `    /* ── Type ramps (per role; each anchored at its own md) ───────── */`,
        fontRampBlock(),
        ``,
        `    /* ── Shadow ramp (geometry from elevation; colour flips per theme) */`,
        shadowRampBlock(),
        `}`,
        ``,
        `:root {`,
        lightRootInner(),
        `}`,
        ``,
        `/* ─────────────────────────────────────────────────────────────────────────`,
        `   DARK THEME — explicit toggle. Set <html data-theme="dark">.`,
        `   ───────────────────────────────────────────────────────────────────────── */`,
        `[data-theme='dark'] {`,
        darkInner,
        `}`,
        ``,
        `/* ─────────────────────────────────────────────────────────────────────────`,
        `   DARK THEME — OS fallback. Applies when the system prefers dark and the`,
        `   author has NOT forced [data-theme='light']. Mirrors the block above.`,
        `   ───────────────────────────────────────────────────────────────────────── */`,
        `@media (prefers-color-scheme: dark) {`,
        `  :root:not([data-theme='light']) {`,
        indent(darkInner, 2),
        `  }`,
        `}`,
        ``,
        `/* ─────────────────────────────────────────────────────────────────────────`,
        `   TINT CLASSES — tree-shakable @utility, emitted as .tint-<name>. Each ships`,
        `   ONLY when class="tint-<name>" appears in the consumer's markup (the tint-`,
        `   prefix avoids matching the bare word, e.g. a color="primary" prop). Applying`,
        `   one retints --color-c-* / --color-rag-* and points the generic --surface-*`,
        `   at that palette's tokens. Dark is folded in (explicit toggle + OS fallback),`,
        `   so an unused tint costs nothing at all.`,
        `   ───────────────────────────────────────────────────────────────────────── */`,
        ALL.map(tintUtility).join('\n\n'),
        ``,
    ].join('\n');
}

/**
 * Minify generated CSS so output.css ships as a single line — signalling it is a
 * build artifact (don't hand-edit) and shrinking it. Value-safe: runs of
 * whitespace collapse to ONE space (so significant single spaces inside values —
 * `oklch(0.65 0.23 34)`, `var(--L, x) var(--D, y)`, shadows — survive); only the
 * insignificant whitespace around `{ } ; ,` and after `:` is removed. Space
 * BEFORE `:` is kept, so descendant + pseudo selectors don't merge.
 */
export function minify(css: string): string {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // strip comments
        .replace(/\s+/g, ' ') // collapse whitespace runs to a single space
        .replace(/\s*([{};,])\s*/g, '$1') // drop space around { } ; ,
        .replace(/:\s+/g, ':') // drop space after a colon (declarations / @media / @supports)
        .replace(/;}/g, '}') // drop the redundant last semicolon in a block
        .trim();
}
