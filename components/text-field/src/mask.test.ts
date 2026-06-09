/*
 * @wimwian-org/text-field
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import { describe, expect, test } from 'vitest';
import { tokenize, accepts, applyMask, unmaskedCountBefore, caretAfterMask, isDigitOnlyMask } from './mask';

describe('tokenize', () => {
    test('maps token characters to classes, the rest to literals', () => {
        const tokens = tokenize('(#) A-*');
        expect(tokens).toEqual([
            { literal: true, char: '(' },
            { literal: false, kind: 'digit' },
            { literal: true, char: ')' },
            { literal: true, char: ' ' },
            { literal: false, kind: 'letter' },
            { literal: true, char: '-' },
            { literal: false, kind: 'alnum' },
        ]);
    });

    test('a backslash escapes the next character as a literal', () => {
        expect(tokenize('\\#')).toEqual([{ literal: true, char: '#' }]);
        expect(tokenize('\\A\\*')).toEqual([
            { literal: true, char: 'A' },
            { literal: true, char: '*' },
        ]);
    });

    test('a trailing backslash is a literal backslash', () => {
        expect(tokenize('#\\')).toEqual([
            { literal: false, kind: 'digit' },
            { literal: true, char: '\\' },
        ]);
    });
});

describe('accepts', () => {
    test('digit accepts 0–9 only', () => {
        expect(accepts('5', 'digit')).toBe(true);
        expect(accepts('a', 'digit')).toBe(false);
    });
    test('letter accepts A–Z / a–z only', () => {
        expect(accepts('Q', 'letter')).toBe(true);
        expect(accepts('q', 'letter')).toBe(true);
        expect(accepts('1', 'letter')).toBe(false);
    });
    test('alnum accepts digits and letters', () => {
        expect(accepts('7', 'alnum')).toBe(true);
        expect(accepts('z', 'alnum')).toBe(true);
        expect(accepts('-', 'alnum')).toBe(false);
    });
});

describe('applyMask', () => {
    test('formats a phone number, exposing the bare value', () => {
        expect(applyMask('4155550142', '(###) ###-####')).toEqual({
            masked: '(415) 555-0142',
            unmasked: '4155550142',
        });
    });

    test('drops characters that do not fit the current slot', () => {
        expect(applyMask('41a5b5', '###-###')).toEqual({ masked: '415-5', unmasked: '4155' });
    });

    test('holds back trailing literals until the next slot is filled', () => {
        expect(applyMask('415', '(###) ###').masked).toBe('(415');
        expect(applyMask('4155', '(###) ###').masked).toBe('(415) 5');
    });

    test('absorbs a literal the user types where one is expected', () => {
        // typing the "(" then digits should not double the paren
        expect(applyMask('(415', '(###)').masked).toBe('(415');
    });

    test('re-masking an already-formatted value is stable', () => {
        const once = applyMask('4155550142', '(###) ###-####');
        expect(applyMask(once.masked, '(###) ###-####')).toEqual(once);
    });

    test('caps the value at the mask length', () => {
        expect(applyMask('123456', '##-##')).toEqual({ masked: '12-34', unmasked: '1234' });
    });

    test('letter + alnum tokens with a fixed literal', () => {
        expect(applyMask('ca1234', 'AA-####')).toEqual({ masked: 'ca-1234', unmasked: 'ca1234' });
    });

    test('empty input yields an empty string (no orphan leading literal)', () => {
        expect(applyMask('', '(###)')).toEqual({ masked: '', unmasked: '' });
    });

    test('an escaped token character is a literal', () => {
        expect(applyMask('5', '\\#=#')).toEqual({ masked: '#=5', unmasked: '5' });
    });
});

describe('caret anchoring', () => {
    test('unmaskedCountBefore counts value characters before the caret', () => {
        // "(415) 5|55" — 4 value chars before the caret
        expect(unmaskedCountBefore('(415) 555', 7)).toBe(4);
        expect(unmaskedCountBefore('(415) 555', 0)).toBe(0);
    });

    test('caretAfterMask lands just after the nth value character', () => {
        // 4th value char in "(415) 555" is the first 5 of the group at index 6
        expect(caretAfterMask('(415) 555', 4)).toBe(7);
        expect(caretAfterMask('(415) 555', 0)).toBe(0);
    });

    test('round-trips a caret across reformatting', () => {
        const before = '415) 555'; // mid-edit, caret after the second 5 (index 6)
        const n = unmaskedCountBefore(before, 6);
        const { masked } = applyMask(before, '(###) ###-####');
        expect(caretAfterMask(masked, n)).toBe(7); // "(415) 5|55..."
    });
});

describe('isDigitOnlyMask', () => {
    test('true when every class token is a digit', () => {
        expect(isDigitOnlyMask('(###) ###-####')).toBe(true);
        expect(isDigitOnlyMask('##/##/####')).toBe(true);
    });
    test('false when any class token is a letter or alnum', () => {
        expect(isDigitOnlyMask('AA-####')).toBe(false);
        expect(isDigitOnlyMask('****')).toBe(false);
    });
    test('false for a mask with no class tokens', () => {
        expect(isDigitOnlyMask('---')).toBe(false);
    });
});

describe('tokenize — escapes', () => {
    test('a backslash escapes the next char into a literal', () => {
        expect(tokenize('\\#')).toEqual([{ literal: true, char: '#' }]);
    });
    test('a trailing backslash is itself a literal', () => {
        expect(tokenize('\\')).toEqual([{ literal: true, char: '\\' }]);
    });
});

describe('accepts — alnum', () => {
    test('accepts digits and letters, rejects symbols', () => {
        expect(accepts('5', 'alnum')).toBe(true);
        expect(accepts('q', 'alnum')).toBe(true);
        expect(accepts('-', 'alnum')).toBe(false);
    });
});

describe('caretAfterMask — past the last token', () => {
    test('clamps to the full length when the count exceeds the token chars', () => {
        const { masked } = applyMask('415', '(###) ###');
        expect(caretAfterMask(masked, 99)).toBe(masked.length);
    });
});
