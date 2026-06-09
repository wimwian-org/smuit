/*
 * @smuit/text-field
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { afterEach, expect, test, vi } from 'vitest';
import { page } from '@vitest/browser/context';
import { render } from 'vitest-browser-svelte';
import NumberField from './NumberField.svelte';
import Harness from './number-field-harness.test.svelte';

afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
});

const input = () => document.querySelector('input') as HTMLInputElement;
const valueOut = () => document.querySelector('[data-testid="value"]')?.textContent;
const root = () => document.querySelector('.tf') as HTMLElement;

function keydown(key: string): KeyboardEvent {
    const el = input();
    el.focus();
    const ev = new KeyboardEvent('keydown', { key, cancelable: true, bubbles: true });
    el.dispatchEvent(ev);
    return ev;
}

// ── render contract ─────────────────────────────────────────────────────────
test('renders a labelled textbox with a numeric inputmode', async () => {
    render(NumberField, { label: 'Amount' });
    const el = input();
    await expect.element(page.getByRole('textbox', { name: 'Amount' })).toBeInTheDocument();
    expect(el.getAttribute('inputmode')).toBe('numeric');
});

test('decimalAllowed switches the inputmode to decimal', () => {
    render(NumberField, { label: 'Amount', decimalAllowed: true });
    expect(input().getAttribute('inputmode')).toBe('decimal');
});

test('renders an initial value ungrouped by default, right-aligned', () => {
    render(NumberField, { label: 'Amount', value: 1234567 });
    const el = input();
    expect(el.value).toBe('1234567'); // grouping is opt-in
    expect(el.getAttribute('style')).toContain('text-align: right');
});

// ── masking + grouping ────────────────────────────────────────────────────────
test('no grouping by default; binds the parsed number', async () => {
    render(Harness, { label: 'Amount', value: null });
    await page.getByRole('textbox', { name: 'Amount' }).fill('1234567');
    await vi.waitFor(() => {
        expect(input().value).toBe('1234567');
        expect(valueOut()).toBe('1234567');
    });
});

test('grouping opt-in inserts thousands separators live', async () => {
    render(Harness, { label: 'Amount', value: null, grouping: true });
    await page.getByRole('textbox', { name: 'Amount' }).fill('1234567');
    await vi.waitFor(() => {
        expect(input().value).toBe('1,234,567');
        expect(valueOut()).toBe('1234567');
    });
});

test('locale supplies the group + decimal characters (de-DE)', async () => {
    render(Harness, { label: 'Betrag', value: null, grouping: true, decimalAllowed: true, locale: 'de-DE' });
    await page.getByRole('textbox', { name: 'Betrag' }).fill('1234567,5');
    await vi.waitFor(() => {
        expect(input().value).toBe('1.234.567,5'); // '.' groups, ',' decimal
        expect(valueOut()).toBe('1234567.5');
    });
});

test('integer mode strips a typed decimal point', async () => {
    render(Harness, { label: 'Qty', value: null });
    await page.getByRole('textbox', { name: 'Qty' }).fill('12.34');
    await vi.waitFor(() => {
        expect(input().value).toBe('1234'); // dot dropped (no grouping)
        expect(valueOut()).toBe('1234');
    });
});

test('decimal mode keeps one point and truncates to accuracy', async () => {
    render(Harness, { label: 'Rate', value: null, decimalAllowed: true, decimalAccuracy: 4 });
    await page.getByRole('textbox', { name: 'Rate' }).fill('1234.56789');
    await vi.waitFor(() => {
        expect(input().value).toBe('1234.5678'); // truncated to 4 dp
        expect(valueOut()).toBe('1234.5678');
    });
});

test('align left overrides the default right alignment', () => {
    render(NumberField, { label: 'Amount', align: 'left' });
    expect(input().getAttribute('style')).toContain('text-align: left');
});

test('clearing the field binds null', async () => {
    render(Harness, { label: 'Amount', value: 42 });
    await page.getByRole('textbox', { name: 'Amount' }).fill('');
    await vi.waitFor(() => expect(valueOut()).toBe('null'));
});

// ── hex / binary ──────────────────────────────────────────────────────────────
test('hex: 0x prefix accepts a–f and binds the parsed integer', async () => {
    render(Harness, { label: 'Addr', value: null });
    await page.getByRole('textbox', { name: 'Addr' }).fill('0xFF');
    await vi.waitFor(() => {
        expect(input().value).toBe('0xff'); // lower-cased, no grouping
        expect(valueOut()).toBe('255');
        expect(input().getAttribute('inputmode')).toBe('text'); // letters need a text keyboard
    });
});

test('hex: non-hex letters are dropped', async () => {
    render(Harness, { label: 'Addr', value: null });
    await page.getByRole('textbox', { name: 'Addr' }).fill('0x1g2z3');
    await vi.waitFor(() => {
        expect(input().value).toBe('0x123');
        expect(valueOut()).toBe('291'); // 0x123
    });
});

test('binary: 0b prefix accepts only 0 and 1', async () => {
    render(Harness, { label: 'Mask', value: null });
    await page.getByRole('textbox', { name: 'Mask' }).fill('0b1021');
    await vi.waitFor(() => {
        expect(input().value).toBe('0b101'); // the stray 2 dropped
        expect(valueOut()).toBe('5');
    });
});

test('keydown: a–f allowed in hex, blocked in decimal', () => {
    render(NumberField, { label: 'N' });
    const el = input();
    el.value = '0x1';
    expect(keydown('a').defaultPrevented).toBe(false); // hex digit ok
    el.value = '12';
    expect(keydown('a').defaultPrevented).toBe(true); // decimal blocks letters
    el.value = '0';
    expect(keydown('x').defaultPrevented).toBe(false); // can begin 0x after a lone 0
});

// ── keystroke filtering ───────────────────────────────────────────────────────
test('blocks non-numeric printable keys, allows digits', () => {
    render(NumberField, { label: 'Amount' });
    expect(keydown('a').defaultPrevented).toBe(true);
    expect(keydown('-').defaultPrevented).toBe(true);
    expect(keydown('5').defaultPrevented).toBe(false);
    // control keys pass through untouched
    expect(keydown('Backspace').defaultPrevented).toBe(false);
    expect(keydown('ArrowLeft').defaultPrevented).toBe(false);
});

test('decimal point: blocked in integer mode, allowed once in decimal mode', () => {
    render(NumberField, { label: 'Amount' });
    expect(keydown('.').defaultPrevented).toBe(true); // integer mode

    document.body.innerHTML = '';
    render(NumberField, { label: 'Rate', decimalAllowed: true });
    expect(keydown('.').defaultPrevented).toBe(false); // first point allowed
    input().value = '1.5';
    expect(keydown('.').defaultPrevented).toBe(true); // second point blocked
});

// ── validation on blur ────────────────────────────────────────────────────────
test('min/max produce an error message on blur', async () => {
    render(NumberField, { label: 'Age', min: 18, max: 99 });
    const el = input();
    el.focus();
    await page.getByRole('textbox', { name: 'Age' }).fill('5');
    el.blur();
    await vi.waitFor(() => {
        expect(root().dataset.error).toBe('true');
        expect(document.querySelector('[data-slot="supporting"]')?.textContent).toContain('at least 18');
    });
});

test('runs the async validate callback on blur and shows its message', async () => {
    const validate = vi.fn(async (v: number | null) => (v === 13 ? 'Unlucky number.' : null));
    render(NumberField, { label: 'Pick', validate });
    const el = input();
    el.focus();
    await page.getByRole('textbox', { name: 'Pick' }).fill('13');
    el.blur();
    await vi.waitFor(() => {
        expect(validate).toHaveBeenCalledWith(13);
        expect(document.querySelector('[data-slot="supporting"]')?.textContent).toContain('Unlucky number.');
        expect(input().getAttribute('aria-invalid')).toBe('true');
    });
});

test('editing clears a previously reported error', async () => {
    render(NumberField, { label: 'Age', min: 18 });
    const el = input();
    el.focus();
    await page.getByRole('textbox', { name: 'Age' }).fill('5');
    el.blur();
    await vi.waitFor(() => expect(root().dataset.error).toBe('true'));
    await page.getByRole('textbox', { name: 'Age' }).fill('25');
    await vi.waitFor(() => expect(root().dataset.error).toBeUndefined());
});
