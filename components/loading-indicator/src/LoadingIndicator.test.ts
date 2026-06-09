/*
 * @smuit/loading-indicator
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import { afterEach, expect, test, vi } from 'vitest';
import { page } from '@vitest/browser/context';
import { render } from 'vitest-browser-svelte';
import LoadingIndicator from './LoadingIndicator.svelte';
import RefHarness from './loading-indicator-ref.test.svelte';

afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
});

const root = () => document.querySelector('.li') as HTMLElement;
const shape = () => document.querySelector('.li-shape') as SVGElement;

// ── render contract ───────────────────────────────────────────────────────────
test('renders a progressbar with the indeterminate defaults', async () => {
    render(LoadingIndicator, {});
    await expect.element(page.getByRole('progressbar')).toBeInTheDocument();
    const el = root();
    expect(el.getAttribute('aria-label')).toBe('Loading');
    expect(el.getAttribute('aria-busy')).toBe('true');
    // Indeterminate → no aria-valuenow.
    expect(el.hasAttribute('aria-valuenow')).toBe(false);
    expect(el.dataset.variant).toBe('uncontained');
    expect(el.dataset.size).toBe('md');
    expect(el.dataset.tint).toBe('primary');
    expect(el.className).toContain('li');
});

test('renders a decorative svg path for the active indicator', () => {
    render(LoadingIndicator, {});
    const svg = shape();
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
    const path = svg.querySelector('path')!;
    expect(path.getAttribute('fill')).toBe('currentColor');
    expect(path.getAttribute('d')).toContain('M 12');
});

// ── variant axis ──────────────────────────────────────────────────────────────
test('contained variant sets the data hook', () => {
    render(LoadingIndicator, { variant: 'contained' });
    expect(root().dataset.variant).toBe('contained');
});

test('uncontained is the default variant', () => {
    render(LoadingIndicator, {});
    expect(root().dataset.variant).toBe('uncontained');
});

// ── size axis ─────────────────────────────────────────────────────────────────
test.each(['sm', 'md', 'lg'] as const)('size=%s sets the data hook', (size) => {
    render(LoadingIndicator, { size });
    expect(root().dataset.size).toBe(size);
});

// ── tint axis ─────────────────────────────────────────────────────────────────
test.each(['neutral', 'primary', 'secondary', 'tertiary'] as const)('tint=%s sets the data hook', (tint) => {
    render(LoadingIndicator, { tint });
    expect(root().dataset.tint).toBe(tint);
});

// ── label + class + restProps ───────────────────────────────────────────────────
test('label overrides the accessible name', () => {
    render(LoadingIndicator, { label: 'Fetching results' });
    expect(root().getAttribute('aria-label')).toBe('Fetching results');
});

test('class merges onto the root via tailwind-merge', () => {
    render(LoadingIndicator, { class: 'my-loader' });
    const el = root();
    expect(el.className).toContain('my-loader');
    expect(el.className).toContain('li');
});

test('restProps spread onto the root', () => {
    render(LoadingIndicator, { id: 'spin-1', 'data-testid': 'loader' } as Record<string, unknown>);
    const el = root();
    expect(el.id).toBe('spin-1');
    expect(el.getAttribute('data-testid')).toBe('loader');
});

// ── ref binding ─────────────────────────────────────────────────────────────────
test('ref binds to the root element', async () => {
    let bound: HTMLDivElement | null = null;
    render(RefHarness, { onref: (el: HTMLDivElement | null) => (bound = el) });
    await vi.waitFor(() => expect(bound).not.toBeNull());
    expect(bound!).toBe(root());
    expect(bound!.getAttribute('role')).toBe('progressbar');
});

// ── motion ──────────────────────────────────────────────────────────────────────
test('animates the morph (SMIL <animate>) when motion is allowed', () => {
    render(LoadingIndicator, {});
    const animate = shape().querySelector('animate');
    expect(animate).toBeTruthy();
    expect(animate!.getAttribute('attributeName')).toBe('d');
    // values cycles back to the first shape for a seamless loop.
    expect((animate!.getAttribute('values') ?? '').split(';').length).toBe(5);
});

test('honours prefers-reduced-motion — drops the morph and marks data-reduced', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: true,
        addEventListener: () => {},
        removeEventListener: () => {},
    } as unknown as MediaQueryList);
    render(LoadingIndicator, {});
    // `reduced` is seeded synchronously from matchMedia → the morph never
    // renders, not even for a frame.
    expect(shape().querySelector('animate')).toBeNull();
    expect(root().dataset.reduced).toBe('true');
    // The resting shape is still drawn.
    expect(shape().querySelector('path')!.getAttribute('d')).toContain('M 12');
});
