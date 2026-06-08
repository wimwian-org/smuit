/*
 * @smuit/text-field
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { afterEach, expect, test, vi } from 'vitest';
import { page } from '@vitest/browser/context';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import TextField from './TextField.svelte';
import CompoundHarness from './field-compound.test.svelte';

afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
});

const container = () => document.querySelector('[data-slot="container"]') as HTMLElement;
const icon = (text: string) => createRawSnippet(() => ({ render: () => `<span>${text}</span>` }));

// ── render contract ─────────────────────────────────────────────────────────
test('renders a labelled textbox with the outlined defaults', async () => {
    render(TextField, { label: 'Email' });
    await expect.element(page.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
    const c = container();
    expect(c.dataset.variant).toBe('outlined');
    expect(c.dataset.size).toBe('md');
    expect(c.className).toContain('tf-container');
});

test('associates the label with the input via for/id', async () => {
    render(TextField, { label: 'Username' });
    const label = document.querySelector('label[data-slot="label"]') as HTMLLabelElement;
    const input = document.querySelector('input') as HTMLInputElement;
    expect(label.htmlFor).toBe(input.id);
    expect(input.id).toBeTruthy();
});

// ── variant / size / tint axes ────────────────────────────────────────────────
test('filled variant applies the tonal-fill container classes', () => {
    render(TextField, { label: 'Amount', variant: 'filled' });
    const c = container();
    expect(c.dataset.variant).toBe('filled');
    expect(c.className).toContain('bg-g-100');
});

test('small size sets the size hook and the small text utility', () => {
    render(TextField, { label: 'Name', size: 'sm' });
    expect(container().dataset.size).toBe('sm');
    expect((document.querySelector('input') as HTMLElement).className).toContain('text-sm');
});

test('tint sets the data-tint hook on the root', () => {
    render(TextField, { label: 'City', tint: 'secondary' });
    const root = document.querySelector('.tf') as HTMLElement;
    expect(root.dataset.tint).toBe('secondary');
});

// ── value, counter, decorations ───────────────────────────────────────────────
test('reflects a bound value and floats the label when populated', () => {
    render(TextField, { label: 'Name', value: 'Ada' });
    expect((document.querySelector('input') as HTMLInputElement).value).toBe('Ada');
    expect(container().dataset.floated).toBe('true');
});

test('shows a live counter and applies maxlength as a soft cap', async () => {
    render(TextField, { label: 'Bio', maxlength: 5 });
    const input = document.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('maxlength')).toBe('5');
    const counter = document.querySelector('[data-slot="counter"]') as HTMLElement;
    expect(counter.textContent?.replace(/\s+/g, ' ').trim()).toBe('0 / 5');

    await page.getByRole('textbox', { name: 'Bio' }).fill('abc');
    await vi.waitFor(() => expect(counter.textContent?.replace(/\s+/g, ' ').trim()).toBe('3 / 5'));
});

test('renders supporting text and wires aria-describedby', () => {
    render(TextField, { label: 'Email', supportingText: 'We never share it.' });
    const support = document.querySelector('[data-slot="supporting"]') as HTMLElement;
    const input = document.querySelector('input') as HTMLInputElement;
    expect(support.textContent).toContain('We never share it.');
    expect(input.getAttribute('aria-describedby')).toBe(support.id);
});

test('reveals prefix and suffix only once the label has floated', async () => {
    render(TextField, { label: 'Price', prefix: '$', suffix: '.00' });
    // Empty + unfocused → not floated → decorations hidden.
    expect(document.querySelector('[data-slot="prefix"]')).toBeNull();
    expect(document.querySelector('[data-slot="suffix"]')).toBeNull();

    await page.getByRole('textbox', { name: 'Price' }).click();
    await vi.waitFor(() => {
        expect(document.querySelector('[data-slot="prefix"]')?.textContent).toBe('$');
        expect(document.querySelector('[data-slot="suffix"]')?.textContent).toBe('.00');
    });
});

test('renders leading and trailing icon slots', () => {
    render(TextField, { label: 'Search', leadingIcon: icon('L'), trailingIcon: icon('T') });
    expect(document.querySelector('[data-slot="leading"]')?.textContent).toContain('L');
    expect(document.querySelector('[data-slot="trailing"]')?.textContent).toContain('T');
    expect(container().dataset.hasLeading).toBe('true');
});

// ── states ──────────────────────────────────────────────────────────────────
test('disabled disables the input and sets the data hook', async () => {
    render(TextField, { label: 'Locked', disabled: true });
    await expect.element(page.getByRole('textbox', { name: 'Locked' })).toBeDisabled();
    expect(container().dataset.disabled).toBe('true');
});

test('readonly keeps the input focusable but not editable', () => {
    render(TextField, { label: 'Token', value: 'abc', readonly: true });
    const input = document.querySelector('input') as HTMLInputElement;
    expect(input.readOnly).toBe(true);
    expect(input.disabled).toBe(false);
    expect(container().dataset.readonly).toBe('true');
});

test('hidden-label mode keeps the label for screen readers but visually hides it', async () => {
    render(TextField, { label: 'Hidden', hideLabel: true });
    await expect.element(page.getByRole('textbox', { name: 'Hidden' })).toBeInTheDocument();
    const label = document.querySelector('label[data-slot="label"]') as HTMLElement;
    expect(label.className).toContain('sr-only');
    expect(container().dataset.hideLabel).toBe('true');
});

// ── events, ref, forwarding ───────────────────────────────────────────────────
test('forwards focus / blur and toggles the floated hook', async () => {
    const onfocus = vi.fn();
    const onblur = vi.fn();
    render(TextField, { label: 'Email', onfocus, onblur });
    const input = document.querySelector('input') as HTMLInputElement;

    input.focus();
    await vi.waitFor(() => expect(container().dataset.floated).toBe('true'));
    expect(onfocus).toHaveBeenCalledOnce();

    input.blur();
    await vi.waitFor(() => expect(container().dataset.floated).toBe('false'));
    expect(onblur).toHaveBeenCalledOnce();
});

test('forwards the native change event on commit', async () => {
    const onchange = vi.fn();
    render(TextField, { label: 'Name', onchange });
    await page.getByRole('textbox', { name: 'Name' }).fill('Grace');
    const input = document.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(onchange).toHaveBeenCalled();
});

test('forwards native input events / keydown / attributes through restProps', async () => {
    const oninput = vi.fn();
    const onkeydown = vi.fn();
    render(TextField, { label: 'Name', oninput, onkeydown, name: 'fullname', autocomplete: 'name' });
    const input = document.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('name')).toBe('fullname');
    expect(input.getAttribute('autocomplete')).toBe('name');
    expect(input.getAttribute('role')).toBeNull(); // no combobox role without suggestions
    await page.getByRole('textbox', { name: 'Name' }).fill('Grace');
    expect(oninput).toHaveBeenCalled();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    expect(onkeydown).toHaveBeenCalled();
});

test('binds ref to the underlying input element', () => {
    let ref: HTMLInputElement | null = null;
    render(TextField, {
        label: 'Ref',
        get ref() {
            return ref;
        },
        set ref(v: HTMLInputElement | null) {
            ref = v;
        },
    });
    expect(ref).toBeInstanceOf(HTMLInputElement);
});

test('merges a consumer class onto the root', () => {
    render(TextField, { label: 'Styled', class: 'my-custom-field' });
    expect((document.querySelector('.tf') as HTMLElement).className).toContain('my-custom-field');
});

// ── validation & error ────────────────────────────────────────────────────────
test('error prop paints the error state and sets aria-invalid', () => {
    render(TextField, { label: 'Email', error: true, value: 'x' });
    expect((document.querySelector('.tf') as HTMLElement).dataset.error).toBe('true');
    expect((document.querySelector('input') as HTMLInputElement).getAttribute('aria-invalid')).toBe('true');
    expect(container().className).toContain('border-[var(--surface-error-accent)]');
});

test('errorText replaces the supporting text in error; an empty errorText keeps it', () => {
    render(TextField, { label: 'Email', supportingText: 'Help', error: true, errorText: 'Required field' });
    expect(document.querySelector('[data-slot="supporting"]')?.textContent?.trim()).toBe('Required field');

    document.body.innerHTML = '';
    render(TextField, { label: 'Email', supportingText: 'Help', error: true });
    expect(document.querySelector('[data-slot="supporting"]')?.textContent?.trim()).toBe('Help');
});

test('required renders an asterisk + native attribute; noAsterisk suppresses the glyph only', () => {
    render(TextField, { label: 'Name', required: true });
    expect(document.querySelector('[data-slot="asterisk"]')).toBeTruthy();
    expect((document.querySelector('input') as HTMLInputElement).required).toBe(true);

    document.body.innerHTML = '';
    render(TextField, { label: 'Name', required: true, noAsterisk: true });
    expect(document.querySelector('[data-slot="asterisk"]')).toBeNull();
    expect((document.querySelector('input') as HTMLInputElement).required).toBe(true);
});

test('a reported constraint failure sets the error state and forwards oninvalid; editing clears it', async () => {
    const oninvalid = vi.fn();
    render(TextField, { label: 'Email', required: true, oninvalid });
    const root = document.querySelector('.tf') as HTMLElement;
    (document.querySelector('input') as HTMLInputElement).dispatchEvent(new Event('invalid'));
    await vi.waitFor(() => expect(root.dataset.error).toBe('true'));
    expect(oninvalid).toHaveBeenCalled();

    await page.getByRole('textbox', { name: 'Email' }).fill('ada@x.io');
    await vi.waitFor(() => expect(root.dataset.error).toBeUndefined());
});

// ── autosuggest (combobox) ─────────────────────────────────────────────────────
const FRUITS = ['Apple', 'Banana', 'Cherry'];
const optionEls = () => [...document.querySelectorAll('[role="option"]')] as HTMLElement[];
const keydown = (input: HTMLElement, key: string) =>
    input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

test('throws when suggestions exceed the build-time MAX_SUGGESTIONS cap', () => {
    const tooMany = Array.from({ length: 11 }, (_, i) => `opt-${i}`);
    expect(() => render(TextField, { label: 'F', suggestions: tooMany })).toThrow(/MAX_SUGGESTIONS/);
});

test('opens the suggestion listbox on focus with combobox ARIA', async () => {
    render(TextField, { label: 'Fruit', suggestions: FRUITS });
    const input = document.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    input.focus();
    await vi.waitFor(() => expect(input.getAttribute('aria-expanded')).toBe('true'));
    const list = document.querySelector('[role="listbox"]') as HTMLElement;
    expect(list.id).toBe(input.getAttribute('aria-controls'));
    expect(optionEls().length).toBe(3);
});

test('selects a suggestion by pointer without losing focus', async () => {
    render(TextField, { label: 'Fruit', suggestions: FRUITS });
    const input = document.querySelector('input') as HTMLInputElement;
    input.focus();
    await vi.waitFor(() => expect(optionEls().length).toBe(3));
    optionEls()[1].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    optionEls()[1].dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    await vi.waitFor(() => {
        expect(input.value).toBe('Banana');
        expect(document.querySelector('[role="listbox"]')).toBeNull();
    });
});

test('keyboard: Down/Up navigate (wrapping), Enter selects, Escape closes', async () => {
    render(TextField, { label: 'Fruit', suggestions: FRUITS });
    const input = document.querySelector('input') as HTMLInputElement;
    input.focus();
    await vi.waitFor(() => expect(optionEls().length).toBe(3));

    keydown(input, 'ArrowDown'); // -1 -> 0
    keydown(input, 'ArrowDown'); // 0 -> 1
    await vi.waitFor(() => expect(input.getAttribute('aria-activedescendant')).toBe(optionEls()[1].id));
    keydown(input, 'Enter');
    await vi.waitFor(() => expect(input.value).toBe('Banana'));

    // list closed after select; ArrowUp reopens and lands on the last option
    keydown(input, 'ArrowUp'); // -1 -> last (2)
    await vi.waitFor(() => {
        expect(document.querySelector('[role="listbox"]')).toBeTruthy();
        expect(input.getAttribute('aria-activedescendant')).toBe(optionEls()[2].id);
    });
    keydown(input, 'ArrowUp'); // 2 -> 1
    await vi.waitFor(() => expect(input.getAttribute('aria-activedescendant')).toBe(optionEls()[1].id));
    keydown(input, 'Escape');
    await vi.waitFor(() => expect(document.querySelector('[role="listbox"]')).toBeNull());
});

test('Enter with no active option does not select, and other keys pass through', async () => {
    render(TextField, { label: 'Fruit', suggestions: FRUITS });
    const input = document.querySelector('input') as HTMLInputElement;
    input.focus();
    await vi.waitFor(() => expect(optionEls().length).toBe(3));
    keydown(input, 'Enter'); // open but activeIndex < 0 → no selection
    keydown(input, 'a'); // unhandled key → falls through
    expect(input.value).toBe('');
    expect(document.querySelector('[role="listbox"]')).toBeTruthy();
});

// ── composable parts (compound API) ───────────────────────────────────────────
test('composes via the Field.* parts directly', async () => {
    render(CompoundHarness, {});
    await expect.element(page.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
    const input = document.querySelector('input') as HTMLInputElement;
    const support = document.querySelector('[data-slot="supporting"]') as HTMLElement;
    // label↔input wiring, supporting describedby, leading + counter parts present
    expect(input.getAttribute('aria-describedby')).toBe(support.id);
    expect(document.querySelector('[data-slot="leading"]')?.textContent).toContain('@');
    expect(container().dataset.hasLeading).toBe('true');
    expect(document.querySelector('[data-slot="counter"]')?.textContent?.replace(/\s+/g, ' ')).toContain('0 / 10');

    await page.getByRole('textbox', { name: 'Email' }).fill('ada@x.io');
    await vi.waitFor(() =>
        expect(document.querySelector('[data-slot="counter"]')?.textContent?.replace(/\s+/g, ' ')).toContain('8 / 10'),
    );
});
