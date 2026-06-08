/*
 * @smuit/text-field
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { expect, test } from 'vitest';
import { textField } from './text-field.variants';

test('defaults to the outlined, md, primary, fixed-width configuration', () => {
    const s = textField();
    expect(s.container()).toContain('rounded-md');
    expect(s.container()).toContain('border-g-300');
    expect(s.root()).toContain('inline-flex');
    expect(s.root()).not.toContain('w-full');
    expect(s.input()).toContain('text-base');
});

test('filled variant swaps in the tonal-fill container surface', () => {
    const s = textField({ variant: 'filled' });
    expect(s.container()).toContain('bg-g-100');
    expect(s.container()).toContain('rounded-t-md');
    expect(s.container()).not.toContain('rounded-md');
});

test('small size shrinks the text utilities', () => {
    const s = textField({ size: 'sm' });
    expect(s.input()).toContain('text-sm');
    expect(s.prefix()).toContain('text-sm');
    expect(s.suffix()).toContain('text-sm');
});

test('tint maps to the retinting utility on the root', () => {
    expect(textField({ tint: 'secondary' }).root()).toContain('secondary');
    expect(textField({ tint: 'tertiary' }).root()).toContain('tertiary');
    // primary and neutral carry no palette class: primary is the default
    // `--color-c-*`, and neutral is repointed to the ground scale in CSS.
    for (const tint of ['primary', 'neutral'] as const) {
        const root = textField({ tint }).root();
        expect(root).not.toContain('secondary');
        expect(root).not.toContain('tertiary');
        expect(root).not.toContain('mono');
    }
});

test('fullWidth stretches the root', () => {
    expect(textField({ fullWidth: true }).root()).toContain('w-full');
    expect(textField({ fullWidth: false }).root()).toContain('w-auto');
});

test('disabled dims the surface and content with tokens, not raw opacity', () => {
    const s = textField({ disabled: true });
    expect(s.container()).toContain('pointer-events-none');
    expect(s.container()).toContain('bg-g-50');
    expect(s.input()).toContain('text-g-400');
    expect(s.container()).not.toContain('opacity-');
});
