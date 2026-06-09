/*
 * @smuit/progress-indicator
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { afterEach, expect, test } from 'vitest';
import { page } from '@vitest/browser/context';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import ProgressIndicator from './ProgressIndicator.svelte';
import RefHarness from './progress-ref.test.svelte';

afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme');
});

const bar = () => document.querySelector('.progress') as HTMLElement;
const indicator = () => document.querySelector('.progress-bar') as HTMLElement;

// ── render contract ───────────────────────────────────────────────────────────
test('renders role=progressbar and the defaults (indeterminate when no value)', async () => {
    render(ProgressIndicator, {});
    await expect.element(page.getByRole('progressbar')).toBeInTheDocument();
    const el = bar();
    expect(el.dataset.tint).toBe('primary');
    expect(el.dataset.size).toBe('md');
    expect(el.hasAttribute('data-indeterminate')).toBe(true);
    expect(el.hasAttribute('aria-valuenow')).toBe(false);
    expect(el.className).toContain('progress');
    expect(indicator()).toBeInTheDocument();
});

// ── determinate behaviour ─────────────────────────────────────────────────────
test('determinate: value/max set the ARIA value, valuetext, and width custom property', () => {
    render(ProgressIndicator, { value: 0.6, max: 1 });
    const el = bar();
    expect(el.hasAttribute('data-indeterminate')).toBe(false);
    expect(el.getAttribute('aria-valuenow')).toBe('0.6');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('1');
    expect(el.getAttribute('aria-valuetext')).toBe('60%');
    expect(el.style.getPropertyValue('--progress-value')).toBe('0.6');
});

test('value is a fraction of a non-1 max', () => {
    render(ProgressIndicator, { value: 50, max: 200 });
    const el = bar();
    expect(el.style.getPropertyValue('--progress-value')).toBe('0.25');
    expect(el.getAttribute('aria-valuetext')).toBe('25%');
    expect(el.getAttribute('aria-valuemax')).toBe('200');
});

test('value is clamped into [0, max] for the fill and ARIA', () => {
    render(ProgressIndicator, { value: 5, max: 1 });
    const el = bar();
    expect(el.style.getPropertyValue('--progress-value')).toBe('1');
    expect(el.getAttribute('aria-valuenow')).toBe('1');
    expect(el.getAttribute('aria-valuetext')).toBe('100%');
});

test('a value of 0 is determinate (not mistaken for indeterminate)', () => {
    render(ProgressIndicator, { value: 0 });
    const el = bar();
    expect(el.hasAttribute('data-indeterminate')).toBe(false);
    expect(el.getAttribute('aria-valuenow')).toBe('0');
    expect(el.style.getPropertyValue('--progress-value')).toBe('0');
});

// ── mode inference ────────────────────────────────────────────────────────────
test('indeterminate prop forces the animated mode even with a value', () => {
    render(ProgressIndicator, { value: 0.5, indeterminate: true });
    const el = bar();
    expect(el.hasAttribute('data-indeterminate')).toBe(true);
    expect(el.hasAttribute('aria-valuenow')).toBe(false);
    expect(el.style.getPropertyValue('--progress-value')).toBe('');
});

test('indeterminate=false with a value is determinate', () => {
    render(ProgressIndicator, { value: 0.5, indeterminate: false });
    expect(bar().hasAttribute('data-indeterminate')).toBe(false);
    expect(bar().getAttribute('aria-valuenow')).toBe('0.5');
});

// ── tint axis ─────────────────────────────────────────────────────────────────
test.each(['neutral', 'primary', 'secondary', 'error', 'warning', 'success'] as const)(
    'tint=%s sets the data-tint hook',
    (tint) => {
        render(ProgressIndicator, { tint });
        expect(bar().dataset.tint).toBe(tint);
    },
);

// ── size axis ─────────────────────────────────────────────────────────────────
test.each([
    ['sm', 'h-1'],
    ['md', 'h-2'],
    ['lg', 'h-3'],
] as const)('size=%s sets the data hook and the height class', (size, height) => {
    render(ProgressIndicator, { size });
    expect(bar().dataset.size).toBe(size);
    expect(bar().className).toContain(height);
});

// ── prop forwarding + ref ─────────────────────────────────────────────────────
test('forwards rest props (aria-label, id) to the root', () => {
    render(ProgressIndicator, { 'aria-label': 'Uploading', id: 'upload' });
    const el = bar();
    expect(el.getAttribute('aria-label')).toBe('Uploading');
    expect(el.id).toBe('upload');
});

test('merges extra classes onto the root', () => {
    render(ProgressIndicator, { class: 'my-4' });
    expect(bar().className).toContain('my-4');
    expect(bar().className).toContain('progress');
});

test('binds ref to the underlying root <div>', () => {
    let captured: HTMLDivElement | null = null;
    render(RefHarness, { onRef: (el) => (captured = el) });
    expect(captured).toBeInstanceOf(HTMLDivElement);
    expect((captured as unknown as HTMLDivElement).classList.contains('progress')).toBe(true);
});

// ── circular shape ─────────────────────────────────────────────────────────────
const field = () => document.querySelector('[data-slot="field"]') as HTMLElement | null;
const valueText = () => document.querySelector('[data-slot="value"]') as HTMLElement | null;

test('shape=circular renders an SVG ring progressbar with the determinate arc', () => {
    render(ProgressIndicator, { shape: 'circular', value: 0.5 });
    const el = bar();
    expect(el.dataset.shape).toBe('circular');
    expect(el.getAttribute('role')).toBe('progressbar');
    expect(el.querySelector('svg')).toBeTruthy();
    // pathLength=100, so the offset reveals fraction of the ring: 100·(1−0.5)=50.
    const arc = el.querySelector('.progress-bar') as SVGCircleElement;
    expect(arc.getAttribute('stroke-dasharray')).toBe('100');
    expect(arc.getAttribute('stroke-dashoffset')).toBe('50');
    expect(el.getAttribute('aria-valuenow')).toBe('0.5');
});

test('circular indeterminate omits the dash offset (CSS drives the spin)', () => {
    render(ProgressIndicator, { shape: 'circular', indeterminate: true });
    const arc = bar().querySelector('.progress-bar') as SVGCircleElement;
    expect(arc.hasAttribute('stroke-dashoffset')).toBe(false);
    expect(bar().hasAttribute('data-indeterminate')).toBe(true);
});

// ── linear buffer ──────────────────────────────────────────────────────────────
test('buffer renders the buffer fill + dotted track and sets --progress-buffer', () => {
    render(ProgressIndicator, { value: 0.3, buffer: 0.6 });
    const el = bar();
    expect(el.style.getPropertyValue('--progress-buffer')).toBe('0.6');
    expect(el.querySelector('[data-slot="buffer"]')).toBeTruthy();
    expect(el.querySelector('[data-slot="dots"]')).toBeTruthy();
});

test('buffer is ignored while indeterminate', () => {
    render(ProgressIndicator, { indeterminate: true, buffer: 0.6 });
    expect(bar().querySelector('[data-slot="buffer"]')).toBeNull();
    expect(bar().style.getPropertyValue('--progress-buffer')).toBe('');
});

// ── four-colour ────────────────────────────────────────────────────────────────
test('fourColor sets data-four-color only while indeterminate', () => {
    render(ProgressIndicator, { indeterminate: true, fourColor: true });
    expect(bar().hasAttribute('data-four-color')).toBe(true);
    document.body.innerHTML = '';
    render(ProgressIndicator, { value: 0.5, fourColor: true });
    expect(bar().hasAttribute('data-four-color')).toBe(false);
});

// ── label / value readout ──────────────────────────────────────────────────────
test('showValue renders a % readout in a linear caption', () => {
    render(ProgressIndicator, { value: 0.42, showValue: true });
    expect(field()).toBeTruthy();
    expect(valueText()?.textContent).toBe('42%');
    // the progressbar still lives inside the field
    expect(field()?.querySelector('[role="progressbar"]')).toBeTruthy();
});

test('showValue is suppressed while indeterminate', () => {
    render(ProgressIndicator, { indeterminate: true, showValue: true });
    expect(valueText()).toBeNull();
});

test('circular showValue centres the readout inside the ring (no field wrapper)', () => {
    render(ProgressIndicator, { shape: 'circular', value: 0.7, showValue: true });
    expect(field()).toBeNull();
    expect(valueText()?.textContent).toBe('70%');
});

test('label snippet renders a caption and wraps the bar in a field', () => {
    render(ProgressIndicator, {
        value: 0.5,
        label: createRawSnippet(() => ({ render: () => '<span>Uploading</span>' })),
    });
    expect(field()).toBeTruthy();
    expect(document.querySelector('[data-slot="label"]')?.textContent).toContain('Uploading');
});
