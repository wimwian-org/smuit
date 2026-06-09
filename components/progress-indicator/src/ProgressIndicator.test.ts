/*
 * @smuit/progress-indicator
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { afterEach, expect, test } from 'vitest';
import { page } from '@vitest/browser/context';
import { render } from 'vitest-browser-svelte';
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
