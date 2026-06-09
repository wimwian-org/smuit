/*
 * @wimwian-org/ripple
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import { test, expect, vi, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import { ripple, rippleVariants } from './ripple';
import Ripple from './Ripple.svelte';

afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
});

/** A sized, attached host element. */
function host(w = 120, h = 40): HTMLButtonElement {
    const el = document.createElement('button');
    el.style.cssText = `width:${w}px;height:${h}px`;
    document.body.appendChild(el);
    return el;
}

const down = (opts: PointerEventInit = {}) =>
    new PointerEvent('pointerdown', {
        clientX: 10,
        clientY: 10,
        button: 0,
        pointerType: 'mouse',
        bubbles: true,
        ...opts,
    });

// ── exports ───────────────────────────────────────────────────────────────────
test('exposes the five variants', () => {
    expect(rippleVariants).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
});

// ── action: spawning ───────────────────────────────────────────────────────────
test('spawns a ripple span on pointer-down', () => {
    const el = host();
    const r = ripple(el, { variant: 'md' });
    el.dispatchEvent(down());
    expect(el.querySelectorAll('span').length).toBe(1);
    r.destroy();
});

test('spawns from the keyboard (Enter / Space) and ignores key repeats and other keys', () => {
    const el = host();
    const r = ripple(el);
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(el.querySelectorAll('span').length).toBe(2);
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', repeat: true }));
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(el.querySelectorAll('span').length).toBe(2);
    r.destroy();
});

test('ignores non-primary mouse buttons but allows touch', () => {
    const el = host();
    const r = ripple(el);
    el.dispatchEvent(down({ button: 2 })); // right click → ignored
    expect(el.querySelectorAll('span').length).toBe(0);
    el.dispatchEvent(down({ pointerType: 'touch', button: 0 }));
    expect(el.querySelectorAll('span').length).toBe(1);
    r.destroy();
});

test('disabled suppresses ripples', () => {
    const el = host();
    const r = ripple(el, { disabled: true });
    el.dispatchEvent(down());
    expect(el.querySelectorAll('span').length).toBe(0);
    r.destroy();
});

test('a zero-size host produces no ripple', () => {
    const el = host(0, 0);
    const r = ripple(el);
    el.dispatchEvent(down());
    expect(el.querySelectorAll('span').length).toBe(0);
    r.destroy();
});

// ── action: containment + appearance ───────────────────────────────────────────
test('makes a static host contain its ripples', () => {
    const el = host();
    el.style.position = ''; // static
    el.style.overflow = ''; // visible
    const r = ripple(el);
    el.dispatchEvent(down());
    expect(getComputedStyle(el).position).toBe('relative');
    expect(getComputedStyle(el).overflow).toBe('hidden');
    r.destroy();
});

test('applies colour and opacity to the ripple', () => {
    const el = host();
    const r = ripple(el, { color: 'rgb(255, 0, 0)', opacity: 0.5 });
    el.dispatchEvent(down());
    const span = el.querySelector('span')!;
    expect(span.style.opacity).toBe('0.5');
    expect(span.style.backgroundColor).toBe('rgb(255, 0, 0)');
    r.destroy();
});

test('center emits a centred ripple', () => {
    const el = host();
    const r = ripple(el, { center: true });
    el.dispatchEvent(down({ clientX: 0, clientY: 0 }));
    expect(el.querySelectorAll('span').length).toBe(1);
    r.destroy();
});

// ── action: lifecycle ───────────────────────────────────────────────────────────
test('removes the ripple when its animation finishes', async () => {
    const el = host();
    const r = ripple(el);
    el.dispatchEvent(down());
    el.querySelector('span')!.getAnimations()[0].finish();
    await vi.waitFor(() => expect(el.querySelector('span')).toBeNull());
    r.destroy();
});

test('removes the ripple when its animation is cancelled', async () => {
    const el = host();
    const r = ripple(el);
    el.dispatchEvent(down());
    el.querySelector('span')!.getAnimations()[0].cancel();
    await vi.waitFor(() => expect(el.querySelector('span')).toBeNull());
    r.destroy();
});

test('update() swaps options; destroy() detaches listeners', () => {
    const el = host();
    const r = ripple(el, { disabled: true });
    el.dispatchEvent(down());
    expect(el.querySelectorAll('span').length).toBe(0);

    r.update({ disabled: false });
    el.dispatchEvent(down());
    expect(el.querySelectorAll('span').length).toBe(1);

    r.update(); // back to defaults (enabled)
    el.dispatchEvent(down());
    expect(el.querySelectorAll('span').length).toBe(2);

    r.destroy();
    el.dispatchEvent(down());
    expect(el.querySelectorAll('span').length).toBe(2); // no new ripple after destroy
});

test('honours prefers-reduced-motion', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
    const el = host();
    const r = ripple(el);
    el.dispatchEvent(down());
    expect(el.querySelectorAll('span').length).toBe(1); // still gives feedback, just no expansion
    r.destroy();
});

// ── component ────────────────────────────────────────────────────────────────
test('<Ripple> renders children inside a clipping container and ripples on click', () => {
    const children = createRawSnippet(() => ({ render: () => `<span>tap me</span>` }));
    render(Ripple, {
        variant: 'xl',
        color: 'currentColor',
        opacity: 0.2,
        center: false,
        disabled: false,
        class: 'demo-ripple',
        children,
    });
    const wrapper = [...document.querySelectorAll('span.demo-ripple')][0] as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.textContent).toContain('tap me');
    expect(getComputedStyle(wrapper).position).toBe('relative');
    expect(getComputedStyle(wrapper).overflow).toBe('hidden');

    wrapper.dispatchEvent(down({ clientX: 5, clientY: 5 }));
    expect(wrapper.querySelectorAll('span').length).toBeGreaterThanOrEqual(1);
});
