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

test('forwards native input events and attributes through restProps', async () => {
    const oninput = vi.fn();
    render(TextField, { label: 'Name', oninput, name: 'fullname', autocomplete: 'name' });
    const input = document.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('name')).toBe('fullname');
    expect(input.getAttribute('autocomplete')).toBe('name');
    await page.getByRole('textbox', { name: 'Name' }).fill('Grace');
    expect(oninput).toHaveBeenCalled();
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
