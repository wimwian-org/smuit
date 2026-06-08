/*
 * @smuit/list
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { afterEach, expect, test, vi } from 'vitest';
import { page } from '@vitest/browser/context';
import { render } from 'vitest-browser-svelte';
import Harness from './list-harness.test.svelte';
import RefHarness from './list-ref.test.svelte';

afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
});

const ul = () => document.querySelector('.list') as HTMLElement;
const rows = () => Array.from(document.querySelectorAll('[data-slot="row"]')) as HTMLElement[];
const rowByText = (text: string) => rows().find((r) => r.textContent?.includes(text)) as HTMLElement;

// ── render contract ───────────────────────────────────────────────────────────
test('renders a ul with role=list and the baseline defaults', async () => {
    render(Harness, {});
    await expect.element(page.getByRole('list')).toBeInTheDocument();
    const el = ul();
    expect(el.dataset.variant).toBe('baseline');
    expect(el.dataset.tint).toBe('neutral');
    expect(el.className).toContain('list');
});

test('renders one listitem per List.Item', () => {
    render(Harness, {});
    expect(document.querySelectorAll('[data-slot="item"]').length).toBe(4);
    expect(rows().length).toBe(4);
});

// ── variant axis ──────────────────────────────────────────────────────────────
// The resting fill is CSS-driven (--list-rest, set per variant×tint in list.css);
// the row class is the same in both variants — the variant is carried as a data hook.
test('expressive variant sets the data hook and the rows take their fill from --list-rest', () => {
    render(Harness, { variant: 'expressive' });
    expect(ul().dataset.variant).toBe('expressive');
    expect(rowByText('Headline one').className).toContain('bg-[var(--list-rest)]');
});

test('baseline variant sets the data hook and the rows take their fill from --list-rest', () => {
    render(Harness, {});
    expect(ul().dataset.variant).toBe('baseline');
    expect(rowByText('Headline one').className).toContain('bg-[var(--list-rest)]');
});

test('divider sets the data hook on the container', () => {
    render(Harness, { divider: true });
    expect(ul().dataset.divider).toBe('true');
});

// ── tint axis ───────────────────────────────────────────────────────────────
test('tint sets the data-tint hook on the container', () => {
    render(Harness, { tint: 'secondary' });
    expect(ul().dataset.tint).toBe('secondary');
});

// ── layout (lines) ────────────────────────────────────────────────────────────
test('an item with supporting text becomes two-line and renders the supporting slot', () => {
    render(Harness, {});
    const row = rowByText('Headline one');
    expect(row.dataset.lines).toBe('two');
    expect(row.querySelector('[data-slot="supporting"]')?.textContent).toContain('Supporting one');
    expect(row.querySelector('[data-slot="headline"]')?.textContent).toContain('Headline one');
});

test('an item without supporting text stays one-line', () => {
    render(Harness, {});
    expect(rowByText('Link item').dataset.lines).toBe('one');
});

// ── slots ─────────────────────────────────────────────────────────────────────
test('renders the leading and trailing slots', () => {
    render(Harness, {});
    const row = rowByText('Headline one');
    expect(row.querySelector('[data-slot="leading"]')?.textContent).toContain('L');
    expect(row.querySelector('[data-slot="trailing"]')?.textContent).toContain('T');
});

// ── interactivity ──────────────────────────────────────────────────────────────
test('href renders a link row marked interactive', async () => {
    render(Harness, {});
    const link = page.getByRole('link', { name: 'Link item' });
    await expect.element(link).toBeInTheDocument();
    const el = rowByText('Link item');
    expect(el.tagName).toBe('A');
    expect(el.getAttribute('href')).toBe('/somewhere');
    expect(el.dataset.interactive).toBe('true');
    expect(el.className).toContain('hover:bg-[var(--list-hover)]');
});

test('type=button renders a button row and forwards onclick', async () => {
    const onclick = vi.fn();
    render(Harness, { onclick });
    const el = rowByText('Button item');
    expect(el.tagName).toBe('BUTTON');
    expect(el.getAttribute('type')).toBe('button');
    expect(el.dataset.interactive).toBe('true');

    await page.getByRole('button', { name: 'Button item' }).click();
    expect(onclick).toHaveBeenCalledOnce();
});

test('a static (text) item renders a div and is not interactive', () => {
    render(Harness, {});
    const el = rowByText('Headline one');
    expect(el.tagName).toBe('DIV');
    expect(el.dataset.interactive).toBeUndefined();
});

// ── states ──────────────────────────────────────────────────────────────────
test('disabled dims the row, sets the hooks, and stays out of the tab order', () => {
    render(Harness, {});
    const el = rowByText('Disabled item');
    expect(el.dataset.disabled).toBe('true');
    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(el.className).toContain('pointer-events-none');
    // A static disabled row is a non-focusable <div>.
    expect(el.tagName).toBe('DIV');
});

// ── ref + class ───────────────────────────────────────────────────────────────
test('binds ref to the underlying row element', () => {
    let ref: HTMLElement | null = null;
    render(RefHarness, { onRef: (el) => (ref = el) });
    expect(ref).toBeInstanceOf(HTMLAnchorElement);
});

test('merges a consumer class onto the row', () => {
    render(Harness, {});
    expect(rowByText('Headline one').className).toContain('my-row');
});
