/*
 * @smuit/text-field
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { afterEach, expect, test, vi } from 'vitest';
import { page } from '@vitest/browser/context';
import { render } from 'vitest-browser-svelte';
import TextArea from './TextArea.svelte';

afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
});

const container = () => document.querySelector('[data-slot="container"]') as HTMLElement;
const textarea = () => document.querySelector('textarea') as HTMLTextAreaElement;

test('renders a labelled multi-line textbox in multiline mode', async () => {
    render(TextArea, { label: 'Bio', rows: 4 });
    await expect.element(page.getByRole('textbox', { name: 'Bio' })).toBeInTheDocument();
    expect(textarea().tagName).toBe('TEXTAREA');
    expect(textarea().rows).toBe(4);
    expect(container().dataset.multiline).toBe('true');
});

test('defaults to 3 rows and a vertical-resize control', () => {
    render(TextArea, { label: 'Notes' });
    expect(textarea().rows).toBe(3);
    expect(textarea().className).toContain('resize-y');
});

test('autosize swaps to content sizing and disables manual resize', () => {
    render(TextArea, { label: 'Auto', autosize: true });
    const cls = textarea().className;
    expect(cls).toContain('resize-none');
    expect(cls).toContain('field-sizing:content');
    expect(cls).not.toContain('resize-y');
});

test('reflects a bound value and floats the label when populated', () => {
    render(TextArea, { label: 'Bio', value: 'Hello world' });
    expect(textarea().value).toBe('Hello world');
    expect(container().dataset.floated).toBe('true');
});

test('shows a live counter and wires supporting text via aria-describedby', async () => {
    render(TextArea, { label: 'Bio', maxlength: 20, supportingText: 'Keep it short.' });
    const support = document.querySelector('[data-slot="supporting"]') as HTMLElement;
    expect(textarea().getAttribute('aria-describedby')).toBe(support.id);
    expect(document.querySelector('[data-slot="counter"]')?.textContent?.replace(/\s+/g, ' ')).toContain('0 / 20');
    await page.getByRole('textbox', { name: 'Bio' }).fill('typed');
    await vi.waitFor(() =>
        expect(document.querySelector('[data-slot="counter"]')?.textContent?.replace(/\s+/g, ' ')).toContain('5 / 20'),
    );
});

test('forwards focus / blur and toggles the floated hook', async () => {
    const onfocus = vi.fn();
    const onblur = vi.fn();
    render(TextArea, { label: 'Bio', onfocus, onblur });
    textarea().focus();
    await vi.waitFor(() => expect(container().dataset.floated).toBe('true'));
    expect(onfocus).toHaveBeenCalledOnce();
    textarea().blur();
    await vi.waitFor(() => expect(container().dataset.floated).toBe('false'));
    expect(onblur).toHaveBeenCalledOnce();
});

test('honours disabled and readonly', async () => {
    render(TextArea, { label: 'Locked', value: 'x', disabled: true });
    await expect.element(page.getByRole('textbox', { name: 'Locked' })).toBeDisabled();

    document.body.innerHTML = '';
    render(TextArea, { label: 'RO', value: 'x', readonly: true });
    expect(textarea().readOnly).toBe(true);
    expect(textarea().disabled).toBe(false);
});

test('supports the error / required validation surface', async () => {
    const oninvalid = vi.fn();
    render(TextArea, { label: 'Bio', required: true, error: true, errorText: 'Required', supportingText: 'Help', oninvalid });
    const root = document.querySelector('.tf') as HTMLElement;
    expect(root.dataset.error).toBe('true');
    expect(textarea().required).toBe(true);
    expect(textarea().getAttribute('aria-invalid')).toBe('true');
    expect(document.querySelector('[data-slot="asterisk"]')).toBeTruthy();
    expect(document.querySelector('[data-slot="supporting"]')?.textContent?.trim()).toBe('Required');

    textarea().dispatchEvent(new Event('invalid'));
    expect(oninvalid).toHaveBeenCalled();
    await page.getByRole('textbox', { name: 'Bio' }).fill('a bio');
    await vi.waitFor(() => expect(root.dataset.error).toBe('true')); // manual error stays until cleared by consumer
});

test('shows the caption from errorText alone (no supporting text / counter)', () => {
    render(TextArea, { label: 'Bio', error: true, errorText: 'Required' });
    expect(document.querySelector('[data-slot="supporting"]')?.textContent?.trim()).toBe('Required');
});

test('binds ref to the underlying textarea', () => {
    let ref: HTMLTextAreaElement | null = null;
    render(TextArea, {
        label: 'Ref',
        get ref() {
            return ref;
        },
        set ref(v: HTMLTextAreaElement | null) {
            ref = v;
        },
    });
    expect(ref).toBeInstanceOf(HTMLTextAreaElement);
});
