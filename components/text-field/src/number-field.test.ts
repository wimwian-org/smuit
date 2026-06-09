/*
 * @wimwian-org/text-field
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import { describe, expect, test } from 'vitest';
import {
    sanitize,
    group,
    format,
    toNumber,
    fromNumber,
    detectBase,
    localeSeparators,
    significantCountBefore,
    caretAfterFormat,
} from './number-field';

describe('sanitize', () => {
    test('keeps digits, strips everything else (integer mode)', () => {
        expect(sanitize('1a2b3c')).toBe('123');
        expect(sanitize('1,234')).toBe('1234');
        expect(sanitize('$1 234.56')).toBe('123456'); // decimals not allowed → dot dropped
        expect(sanitize('')).toBe('');
    });

    test('integer mode drops all decimal points', () => {
        expect(sanitize('12.34', { decimalAllowed: false })).toBe('1234');
    });

    test('decimal mode keeps a single point and truncates to accuracy', () => {
        const o = { decimalAllowed: true, decimalAccuracy: 4 };
        expect(sanitize('1234.5', o)).toBe('1234.5');
        expect(sanitize('1.2.3.4', o)).toBe('1.234'); // only the first dot survives
        expect(sanitize('1.23456789', o)).toBe('1.2345'); // truncated, not rounded
    });

    test('decimal mode preserves a trailing/leading point for in-progress typing', () => {
        const o = { decimalAllowed: true };
        expect(sanitize('12.', o)).toBe('12.');
        expect(sanitize('.5', o)).toBe('.5');
    });

    test('respects a custom accuracy', () => {
        expect(sanitize('1.239', { decimalAllowed: true, decimalAccuracy: 2 })).toBe('1.23');
        expect(sanitize('1.239', { decimalAllowed: true, decimalAccuracy: 0 })).toBe('1.');
    });
});

describe('group', () => {
    test('inserts thousands separators from the right', () => {
        expect(group('')).toBe('');
        expect(group('1')).toBe('1');
        expect(group('1234')).toBe('1,234');
        expect(group('1234567')).toBe('1,234,567');
    });

    test('uses the given separator character', () => {
        expect(group('1234567', '.')).toBe('1.234.567'); // de-DE style
        expect(group('1234567', ' ')).toBe('1 234 567'); // fr-FR style
    });
});

describe('localeSeparators', () => {
    test('reads the group + decimal characters from the locale', () => {
        expect(localeSeparators('en-US')).toEqual({ group: ',', decimal: '.' });
        expect(localeSeparators('de-DE')).toEqual({ group: '.', decimal: ',' });
    });
});

describe('detectBase', () => {
    test('recognises hex/binary prefixes (case-insensitive), else decimal', () => {
        expect(detectBase('0xFF')).toBe('hex');
        expect(detectBase('0X1a')).toBe('hex');
        expect(detectBase('0b101')).toBe('binary');
        expect(detectBase('0B11')).toBe('binary');
        expect(detectBase('1234')).toBe('decimal');
        expect(detectBase('0')).toBe('decimal');
    });
});

describe('hex / binary', () => {
    test('sanitize keeps the prefix and valid digits, lower-cased', () => {
        expect(sanitize('0xFF')).toBe('0xff');
        expect(sanitize('0x1g2z3')).toBe('0x123'); // non-hex dropped
        expect(sanitize('0b1021')).toBe('0b101'); // non-binary dropped
        expect(sanitize('0x')).toBe('0x'); // bare prefix preserved while typing
    });

    test('format leaves hex/binary verbatim (no grouping)', () => {
        expect(format('0xffff')).toBe('0xffff');
        expect(format('0b1010', { grouping: true })).toBe('0b1010');
    });

    test('toNumber parses the radix; bare prefix is null', () => {
        expect(toNumber('0xff')).toBe(255);
        expect(toNumber('0b101')).toBe(5);
        expect(toNumber('0x')).toBeNull();
        expect(toNumber('0b')).toBeNull();
    });
});

describe('grouping flag + locale separators', () => {
    test('grouping off leaves the integer ungrouped', () => {
        expect(format('1234567', { grouping: false })).toBe('1234567');
    });

    test('grouping on uses the supplied locale characters', () => {
        const de = { grouping: true, groupSeparator: '.', decimalSeparator: ',' };
        expect(format('1234567', de)).toBe('1.234.567');
        expect(format('1234.5', de)).toBe('1.234,5');
        expect(sanitize('1.234,56', { decimalAllowed: true, decimalSeparator: ',' })).toBe('1234.56');
    });
});

describe('format', () => {
    test('groups the integer part and keeps the fractional part intact', () => {
        expect(format('')).toBe('');
        expect(format('1234')).toBe('1,234');
        expect(format('1234.5')).toBe('1,234.5');
        expect(format('1234.')).toBe('1,234.');
        expect(format('.5')).toBe('.5');
    });
});

describe('toNumber', () => {
    test('parses sanitized strings, null for empty / bare point', () => {
        expect(toNumber('')).toBeNull();
        expect(toNumber('.')).toBeNull();
        expect(toNumber('1234')).toBe(1234);
        expect(toNumber('12.')).toBe(12);
        expect(toNumber('12.5')).toBe(12.5);
    });
});

describe('fromNumber', () => {
    test('renders integers grouped and unsigned', () => {
        expect(fromNumber(null)).toBe('');
        expect(fromNumber(1234)).toBe('1,234');
        expect(fromNumber(-1234)).toBe('1,234'); // unsigned
        expect(fromNumber(12.9, { decimalAllowed: false })).toBe('12'); // truncated to int
    });

    test('renders decimals rounded to accuracy with trailing zeros dropped', () => {
        const o = { decimalAllowed: true, decimalAccuracy: 4 };
        expect(fromNumber(1234.5, o)).toBe('1,234.5');
        expect(fromNumber(1.23456, o)).toBe('1.2346'); // rounded
        expect(fromNumber(2, o)).toBe('2'); // no trailing .0000
    });
});

describe('caret anchoring', () => {
    test('significantCountBefore counts digits and the point before the caret', () => {
        // "1,234.5" — caret after the "4" (index 5) → digits 1,2,3,4 = 4
        expect(significantCountBefore('1,234.5', 5)).toBe(4);
        expect(significantCountBefore('1,234.5', 0)).toBe(0);
        expect(significantCountBefore('1,234.5', 7)).toBe(6); // 1234 . 5 = 6 significant
    });

    test('caretAfterFormat lands just past the Nth significant char', () => {
        expect(caretAfterFormat('1,234', 0)).toBe(0);
        expect(caretAfterFormat('1,234', 4)).toBe(5); // after the final "4"
        // round-trip: typing a digit that pushes a new group keeps the caret on it
        expect(caretAfterFormat('1,234', significantCountBefore('1234', 4))).toBe(5);
    });
});
