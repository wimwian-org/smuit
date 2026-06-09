/*
 * @wimwian-org/list
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import { afterEach, expect, test, vi } from 'vitest';
import { page, userEvent } from '@vitest/browser/context';
import { render } from 'vitest-browser-svelte';
import Harness from './list-harness.test.svelte';
import RefHarness from './list-ref.test.svelte';
import SelectHarness from './list-select-harness.test.svelte';

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

// ── three-line layout ──────────────────────────────────────────────────────────
test('lines=three opts the row into the clamped three-line layout', () => {
    render(Harness, { lines: 'three' });
    const row = rowByText('Headline one');
    expect(row.dataset.lines).toBe('three');
});

// ── selection — container semantics ─────────────────────────────────────────────
const control = (text: string) => rowByText(text).querySelector('[data-slot="control"]') as HTMLElement;

test('a selection model switches the container role from list to listbox', () => {
    render(SelectHarness, { selection: 'single' });
    expect(ul().getAttribute('role')).toBe('listbox');
    expect(ul().dataset.selection).toBe('single');
    expect(ul().getAttribute('aria-multiselectable')).toBeNull();
});

test('multiple selection announces aria-multiselectable', () => {
    render(SelectHarness, { selection: 'multiple', value: [] });
    expect(ul().getAttribute('aria-multiselectable')).toBe('true');
});

test('selectable rows are role=option with aria-selected and a trailing control', () => {
    render(SelectHarness, { selection: 'single' });
    const ada = rowByText('Ada Lovelace');
    expect(ada.getAttribute('role')).toBe('option');
    expect(ada.getAttribute('aria-selected')).toBe('false');
    expect(control('Ada Lovelace').dataset.control).toBe('radio');
    expect(control('Ada Lovelace').getAttribute('aria-hidden')).toBe('true');
});

// ── selection — single ──────────────────────────────────────────────────────────
test('single selection: clicking selects the option and exposes the choice', async () => {
    const onValueChange = vi.fn();
    render(SelectHarness, { selection: 'single', onValueChange });

    await page.getByRole('option', { name: /Ada Lovelace/ }).click();
    expect(onValueChange).toHaveBeenLastCalledWith('ada');
    expect(rowByText('Ada Lovelace').getAttribute('aria-selected')).toBe('true');
    expect(control('Ada Lovelace').dataset.checked).toBe('true');

    await page.getByRole('option', { name: /Grace Hopper/ }).click();
    expect(onValueChange).toHaveBeenLastCalledWith('grace');
    expect(rowByText('Ada Lovelace').getAttribute('aria-selected')).toBe('false');
    expect(rowByText('Grace Hopper').getAttribute('aria-selected')).toBe('true');
});

// ── selection — multiple ────────────────────────────────────────────────────────
test('multiple selection: clicking toggles membership; control defaults to checkbox', async () => {
    const onValueChange = vi.fn();
    render(SelectHarness, { selection: 'multiple', value: [], onValueChange });
    expect(control('Ada Lovelace').dataset.control).toBe('checkbox');

    await page.getByRole('option', { name: /Ada Lovelace/ }).click();
    expect(onValueChange).toHaveBeenLastCalledWith(['ada']);
    await page.getByRole('option', { name: /Alan Turing/ }).click();
    expect(onValueChange).toHaveBeenLastCalledWith(['ada', 'alan']);
    await page.getByRole('option', { name: /Ada Lovelace/ }).click();
    expect(onValueChange).toHaveBeenLastCalledWith(['alan']);
});

test('control can be overridden on the list (switch)', () => {
    render(SelectHarness, { selection: 'multiple', value: [], control: 'switch' });
    expect(control('Ada Lovelace').dataset.control).toBe('switch');
});

test('a disabled option is announced, not clickable, and out of the roving order', () => {
    render(SelectHarness, { selection: 'single' });
    const edsger = rowByText('Edsger Dijkstra');
    expect(edsger.getAttribute('role')).toBe('option');
    expect(edsger.getAttribute('aria-disabled')).toBe('true');
    expect(edsger.hasAttribute('data-roving')).toBe(false);
});

// ── roving keyboard navigation ──────────────────────────────────────────────────
test('roving: exactly the first enabled option is tab-reachable', () => {
    render(SelectHarness, { selection: 'single' });
    expect(rowByText('Ada Lovelace').getAttribute('tabindex')).toBe('0');
    expect(rowByText('Grace Hopper').getAttribute('tabindex')).toBe('-1');
    expect(rowByText('Alan Turing').getAttribute('tabindex')).toBe('-1');
    expect(rowByText('Edsger Dijkstra').hasAttribute('tabindex')).toBe(false);
});

test('roving: Arrow / Home / End move focus, skip disabled, and do not wrap', async () => {
    render(SelectHarness, { selection: 'single' });
    const ada = rowByText('Ada Lovelace');
    ada.focus();
    expect(document.activeElement).toBe(ada);

    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(rowByText('Grace Hopper'));
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(rowByText('Alan Turing'));
    // Past the last roving option (Edsger is disabled) → clamp, no wrap.
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(rowByText('Alan Turing'));

    await userEvent.keyboard('{Home}');
    expect(document.activeElement).toBe(ada);
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(rowByText('Alan Turing'));

    // tabindex follows focus.
    expect(rowByText('Alan Turing').getAttribute('tabindex')).toBe('0');
    expect(ada.getAttribute('tabindex')).toBe('-1');
});

test('roving: Space toggles the focused option', async () => {
    const onValueChange = vi.fn();
    render(SelectHarness, { selection: 'multiple', value: [], onValueChange });
    rowByText('Ada Lovelace').focus();
    await userEvent.keyboard(' ');
    expect(onValueChange).toHaveBeenLastCalledWith(['ada']);
});

test('opt-in roving works for a plain link/button list without a selection model', () => {
    render(Harness, {});
    // Default (no selection, roving off): links/buttons keep native tab order.
    expect(rowByText('Link item').hasAttribute('data-roving')).toBe(false);
});

// ── subheaders ──────────────────────────────────────────────────────────────────
test('subheaders render as presentational, non-item labels; sticky sets the hook', () => {
    render(SelectHarness, { selection: 'single' });
    const subs = Array.from(document.querySelectorAll('[data-slot="subheader"]')) as HTMLElement[];
    expect(subs.length).toBe(2);
    expect(subs[0].getAttribute('role')).toBe('presentation');
    expect(subs[0].dataset.sticky).toBeUndefined();
    expect(subs[1].dataset.sticky).toBe('true');
    // A subheader is not a listitem / option.
    expect(subs[0].matches('[data-slot="item"], [role="option"]')).toBe(false);
});
