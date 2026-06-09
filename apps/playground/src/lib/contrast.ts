/*
 * @smuit/playground
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */

/*
 * Runtime WCAG contrast utilities + an `ensureContrast` Svelte action.
 *
 * The theme's surface colours come from color-mix() / contrast-color() / oklch
 * with the --L/--D toggle, so only the browser can resolve their final value.
 * These helpers read the resolved colours back off the DOM (via a 1×1 canvas,
 * which normalises any colour format to sRGB) so we can compute real ratios and
 * flip an element's foreground when it falls below a readability threshold.
 */

export type RGBA = [number, number, number, number];

let _ctx: CanvasRenderingContext2D | undefined;
function ctx2d(): CanvasRenderingContext2D {
    if (!_ctx) {
        const cv = document.createElement('canvas');
        cv.width = cv.height = 1;
        _ctx = cv.getContext('2d', { willReadFrequently: true })!;
    }
    return _ctx;
}

/** Paint any browser-parseable colour string and read it back as straight-alpha sRGB. */
export function toRGBA(color: string): RGBA {
    const ctx = ctx2d();
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = color; // invalid strings leave the previous fillStyle (#000)
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
}

/**
 * Resolve a value that may contain var() / color-mix() / contrast-color() within
 * an element's custom-property scope, independent of the element's own `color`.
 */
export function resolveColor(value: string, scope: HTMLElement): RGBA {
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;width:0;height:0;visibility:hidden;pointer-events:none';
    probe.style.color = value;
    scope.appendChild(probe);
    const resolved = getComputedStyle(probe).color;
    probe.remove();
    return toRGBA(resolved);
}

/**
 * Effective (visible) background: composite the element's background over any
 * translucent ancestors, down to the first opaque layer (or white).
 */
export function effectiveBg(el: HTMLElement): RGBA {
    const stack: RGBA[] = [];
    let n: HTMLElement | null = el;
    while (n) {
        const c = toRGBA(getComputedStyle(n).backgroundColor);
        if (c[3] > 0) {
            stack.push(c);
            if (c[3] >= 1) break;
        }
        n = n.parentElement;
    }
    let r = 255;
    let g = 255;
    let b = 255;
    for (let i = stack.length - 1; i >= 0; i--) {
        const [cr, cg, cb, ca] = stack[i];
        r = cr * ca + r * (1 - ca);
        g = cg * ca + g * (1 - ca);
        b = cb * ca + b * (1 - ca);
    }
    return [r, g, b, 1];
}

export function relativeLuminance([r, g, b]: RGBA): number {
    const f = (v: number) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** WCAG 2.x contrast ratio between two opaque colours (1–21). */
export function contrastRatio(a: RGBA, b: RGBA): number {
    const l1 = relativeLuminance(a) + 0.05;
    const l2 = relativeLuminance(b) + 0.05;
    return l1 > l2 ? l1 / l2 : l2 / l1;
}

const BLACK: RGBA = [0, 0, 0, 1];
const WHITE: RGBA = [255, 255, 255, 1];

export interface EnsureContrastParams {
    /** Intended foreground token/colour, e.g. 'var(--surface-error-fg)'. */
    fg: string;
    /** Brand accent to blend toward when flipping, e.g. 'var(--surface-error-accent)'. */
    accent?: string;
    /** Minimum acceptable ratio before flipping. Default 5. */
    min?: number;
    /** Called after each evaluation with the resulting ratio and whether a flip occurred. */
    onResult?: (ratio: number, flipped: boolean) => void;
}

/**
 * Svelte action: keep an element's text readable.
 *
 * Measures the contrast between the intended foreground (`fg`) and the element's
 * effective background. If it is below `min` (default 5), the foreground is
 * flipped along an escalating ladder, choosing the FIRST step that meets `min`
 * so the most brand colour is retained:
 *
 *   1. 50/50 — color-mix(<pole> 50%, accent)
 *   2. 75/25 — color-mix(<pole> 75%, accent)
 *   3. full  — pure <pole> (black or white, whichever reads better)
 *
 * where <pole> is the black/white pole that contrasts best with the background.
 * If `accent` is omitted, it flips straight to the pole. Re-evaluates on
 * parameter changes and on light/dark theme flips.
 *
 *   <div use:ensureContrast={{ fg: 'var(--surface-error-fg)', accent: 'var(--surface-error-accent)', min: 5 }}>…</div>
 */
export function ensureContrast(node: HTMLElement, params: EnsureContrastParams) {
    let current = params;
    let raf = 0;

    function apply() {
        const min = current.min ?? 5;
        const bg = effectiveBg(node);

        // 1. Intended foreground already passes — leave it alone.
        const intendedRatio = contrastRatio(resolveColor(current.fg, node), bg);
        if (intendedRatio >= min) {
            node.style.setProperty('color', current.fg);
            current.onResult?.(intendedRatio, false);
            return;
        }

        // 2. Flip. Pick the pole that reads best, then climb the ladder.
        const onBlack = contrastRatio(BLACK, bg);
        const onWhite = contrastRatio(WHITE, bg);
        const pole = onBlack >= onWhite ? '#000' : '#fff';

        const ladder: string[] = [];
        if (current.accent) {
            ladder.push(`color-mix(in srgb, ${pole} 50%, ${current.accent})`); // 50/50
            ladder.push(`color-mix(in srgb, ${pole} 75%, ${current.accent})`); // 75/25
        }
        ladder.push(pole); // full pole — guaranteed maximum

        // Default to the pole (last rung) in case no rung clears `min`.
        let chosen = pole;
        let chosenRatio = onBlack >= onWhite ? onBlack : onWhite;
        for (const candidate of ladder) {
            const r = contrastRatio(resolveColor(candidate, node), bg);
            if (r >= min) {
                chosen = candidate;
                chosenRatio = r;
                break;
            }
        }

        node.style.setProperty('color', chosen);
        current.onResult?.(chosenRatio, true);
    }

    function schedule() {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(apply);
    }

    schedule();

    // Re-evaluate when the theme flips (data-theme on <html>).
    const mo = new MutationObserver(schedule);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return {
        update(next: EnsureContrastParams) {
            current = next;
            schedule();
        },
        destroy() {
            cancelAnimationFrame(raf);
            mo.disconnect();
        },
    };
}

export interface FlagContrastParams {
    /** Minimum acceptable ratio. Below this the element is flagged. Default 5. */
    min?: number;
    /** Called after each evaluation with the measured ratio and whether it failed. */
    onResult?: (ratio: number, low: boolean) => void;
}

/**
 * Svelte action: IDENTIFY (don't fix) low-contrast elements.
 *
 * Measures the element's own rendered foreground (`color`) against its effective
 * background. If the WCAG ratio is below `min` (default 5), the element is
 * flagged: a `data-low-contrast` attribute is set and a dashed error-coloured
 * outline is drawn so it's visually obvious which element fails. Nothing about
 * the element's own colours is changed — this is a QA overlay, not a fixer.
 *
 * Re-evaluates on parameter changes and on light/dark theme flips.
 *
 *   <div use:flagContrast={{ min: 5, onResult: (r, low) => … }}>…</div>
 */
export function flagContrast(node: HTMLElement, params: FlagContrastParams = {}) {
    let current = params;
    let raf = 0;

    function apply() {
        const min = current.min ?? 5;
        const bg = effectiveBg(node);
        const fg = toRGBA(getComputedStyle(node).color);
        const ratio = contrastRatio(fg, bg);
        const low = ratio < min;

        node.toggleAttribute('data-low-contrast', low);
        if (low) {
            node.style.setProperty('outline', '2px dashed var(--color-error-500)');
            node.style.setProperty('outline-offset', '3px');
        } else {
            node.style.removeProperty('outline');
            node.style.removeProperty('outline-offset');
        }

        current.onResult?.(ratio, low);
    }

    function schedule() {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(apply);
    }

    schedule();

    const mo = new MutationObserver(schedule);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return {
        update(next: FlagContrastParams) {
            current = next;
            schedule();
        },
        destroy() {
            cancelAnimationFrame(raf);
            mo.disconnect();
        },
    };
}
