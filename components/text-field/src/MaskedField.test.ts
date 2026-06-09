/*
 * @smuit/text-field
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import { afterEach, expect, test, vi } from 'vitest';
import { page } from '@vitest/browser/context';
import { render } from 'vitest-browser-svelte';
import MaskedField from './MaskedField.svelte';
import Harness from './mask-harness.test.svelte';

afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
});

const input = () => document.querySelector('input') as HTMLInputElement;
const valueOut = () => document.querySelector('[data-testid="value"]')?.textContent;
const unmaskedOut = () => document.querySelector('[data-testid="unmasked"]')?.textContent;

// ── render contract ─────────────────────────────────────────────────────────
test('renders a labelled textbox', async () => {
    render(MaskedField, { label: 'Phone', mask: '(###) ###-####' });
    await expect.element(page.getByRole('textbox', { name: 'Phone' })).toBeInTheDocument();
});

test('a digit-only mask picks the numeric inputmode', () => {
    render(MaskedField, { label: 'Phone', mask: '(###) ###-####' });
    expect(input().getAttribute('inputmode')).toBe('numeric');
});

test('a mask with letters does not force a numeric keyboard', () => {
    render(MaskedField, { label: 'Plate', mask: 'AA-####' });
    expect(input().getAttribute('inputmode')).toBeNull();
});

test('masks an initial value and seeds the unmasked binding', async () => {
    render(Harness, { label: 'Phone', mask: '(###) ###-####', value: '4155550142' });
    await vi.waitFor(() => {
        expect(input().value).toBe('(415) 555-0142');
        expect(unmaskedOut()).toBe('4155550142');
    });
});

// ── live masking ────────────────────────────────────────────────────────────
test('formats as the user types and binds both value and unmasked', async () => {
    render(Harness, { label: 'Phone', mask: '(###) ###-####' });
    await page.getByRole('textbox', { name: 'Phone' }).fill('4155550142');
    await vi.waitFor(() => {
        expect(input().value).toBe('(415) 555-0142');
        expect(valueOut()).toBe('(415) 555-0142');
        expect(unmaskedOut()).toBe('4155550142');
    });
});

test('drops characters that do not fit the mask', async () => {
    render(Harness, { label: 'Phone', mask: '(###) ###-####' });
    await page.getByRole('textbox', { name: 'Phone' }).fill('41a5b5c5012');
    await vi.waitFor(() => {
        expect(unmaskedOut()).toBe('41555012'); // letters dropped, digits kept in order
        expect(input().value).toBe('(415) 550-12');
    });
});

test('letter + alnum tokens uppercase nothing but keep letters', async () => {
    render(Harness, { label: 'Plate', mask: 'AA-####' });
    await page.getByRole('textbox', { name: 'Plate' }).fill('ca1234');
    await vi.waitFor(() => {
        expect(input().value).toBe('ca-1234');
        expect(unmaskedOut()).toBe('ca1234');
    });
});

test('caps input at the mask length', async () => {
    render(Harness, { label: 'Code', mask: '##-##' });
    await page.getByRole('textbox', { name: 'Code' }).fill('123456');
    await vi.waitFor(() => {
        expect(input().value).toBe('12-34');
        expect(unmaskedOut()).toBe('1234');
    });
});

test('clearing the field empties both bindings', async () => {
    render(Harness, { label: 'Phone', mask: '(###) ###-####', value: '4155550142' });
    await page.getByRole('textbox', { name: 'Phone' }).fill('');
    await vi.waitFor(() => {
        expect(valueOut()).toBe('');
        expect(unmaskedOut()).toBe('');
    });
});

test('a programmatic value change is re-masked', async () => {
    const { rerender } = render(Harness, { label: 'Phone', mask: '(###) ###-####', value: '' });
    await rerender({ label: 'Phone', mask: '(###) ###-####', value: '4155550142' });
    await vi.waitFor(() => {
        expect(input().value).toBe('(415) 555-0142');
        expect(unmaskedOut()).toBe('4155550142');
    });
});
