/*
 * @wimwian-org/text-field
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */

/**
 * Pure (DOM-free) numeric masking helpers backing <NumberField>. Kept apart from
 * the component so the formatting + caret logic is unit-testable in node mode.
 *
 * Three input bases are recognised from the leading characters:
 *   • `0x…` → hexadecimal (digits + a–f)
 *   • `0b…` → binary (0 and 1 only)
 *   • otherwise decimal — digits, an optional single decimal point, and optional
 *     thousands grouping.
 *
 * The decimal group + decimal characters are locale-derived (see
 * {@link localeSeparators}). Decimal values are canonicalised to a bare string —
 * digits with a single `.` decimal and no grouping; hex/binary keep their
 * `0x`/`0b` prefix. Every canonical form is parseable by {@link toNumber}
 * (`Number()` understands `0x`/`0b` literals). The field is unsigned. Decimal
 * grouping uses a fixed run of three digits; locale-specific group sizing (e.g.
 * the Indian 2-2-3 grouping) is not applied.
 */

export type NumberBase = 'decimal' | 'hex' | 'binary';

export interface NumberFormatOptions {
    /** Allow a single decimal point and fractional digits (decimal base only). @default false */
    decimalAllowed?: boolean;
    /** Maximum fractional digits kept (only when decimals are allowed). @default 4 */
    decimalAccuracy?: number;
    /** Insert thousands group separators (decimal base only). @default true */
    grouping?: boolean;
    /** Group separator character (locale-derived). @default ',' */
    groupSeparator?: string;
    /** Decimal separator character (locale-derived). @default '.' */
    decimalSeparator?: string;
}

/** The group + decimal characters a locale uses, read from Intl. Falls back to
 *  en-US (`,` / `.`) if the runtime can't resolve them. */
export function localeSeparators(locale?: string): { group: string; decimal: string } {
    const parts = new Intl.NumberFormat(locale).formatToParts(11111.1);
    return {
        /* v8 ignore next 2 -- the 11111.1 sample always yields group + decimal parts; the ?? are defensive */
        group: parts.find((p) => p.type === 'group')?.value ?? ',',
        decimal: parts.find((p) => p.type === 'decimal')?.value ?? '.',
    };
}

/** Identify the input base from the leading characters (case-insensitive). */
export function detectBase(raw: string): NumberBase {
    const s = raw.toLowerCase();
    if (s.startsWith('0x')) return 'hex';
    if (s.startsWith('0b')) return 'binary';
    return 'decimal';
}

const isHexDigit = (ch: string): boolean => (ch >= '0' && ch <= '9') || (ch >= 'a' && ch <= 'f');

/** Sanitize a hex/binary string: keep the `0x`/`0b` prefix (lower-cased) plus the
 *  digits valid for that base, dropping everything else. */
function sanitizeRadix(raw: string, base: 'hex' | 'binary'): string {
    const body = raw.toLowerCase().slice(2);
    const prefix = base === 'hex' ? '0x' : '0b';
    let digits = '';
    for (const ch of body) {
        if (base === 'hex' ? isHexDigit(ch) : ch === '0' || ch === '1') digits += ch;
    }
    return prefix + digits;
}

/**
 * Reduce arbitrary input to a bare, canonical numeric string. For decimal input:
 * digits, plus — when allowed — at most one `.` decimal (the locale decimal
 * character is recognised and normalised to `.`) with the fractional part
 * truncated to `decimalAccuracy`; grouping characters are dropped and a trailing
 * decimal is preserved for in-progress typing. For `0x`/`0b` input: the prefix
 * plus its valid digits.
 */
export function sanitize(raw: string, options: NumberFormatOptions = {}): string {
    const base = detectBase(raw);
    if (base !== 'decimal') return sanitizeRadix(raw, base);

    const { decimalAllowed = false, decimalAccuracy = 4, decimalSeparator = '.' } = options;
    let canonical = '';
    for (const ch of raw) {
        if (ch >= '0' && ch <= '9') canonical += ch;
        else if (decimalAllowed && ch === decimalSeparator) canonical += '.';
    }
    if (!decimalAllowed) return canonical;

    const firstDot = canonical.indexOf('.');
    if (firstDot === -1) return canonical;

    const intPart = canonical.slice(0, firstDot).replace(/\./g, '');
    let fracPart = canonical.slice(firstDot + 1).replace(/\./g, '');
    if (decimalAccuracy >= 0) fracPart = fracPart.slice(0, decimalAccuracy);
    return `${intPart}.${fracPart}`;
}

/** Insert a group separator every three digits, from the right. */
export function group(intDigits: string, separator = ','): string {
    return intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/** Format a canonical numeric string for display. Hex/binary are shown verbatim;
 *  decimal optionally groups the integer part and re-attaches the fractional part
 *  using the locale separator characters. */
export function format(canonical: string, options: NumberFormatOptions = {}): string {
    if (canonical.startsWith('0x') || canonical.startsWith('0b')) return canonical;

    const { grouping = true, groupSeparator = ',', decimalSeparator = '.' } = options;
    if (canonical === '') return '';
    const dot = canonical.indexOf('.');
    const intPart = dot === -1 ? canonical : canonical.slice(0, dot);
    const grouped = grouping ? group(intPart, groupSeparator) : intPart;
    if (dot === -1) return grouped;
    return `${grouped}${decimalSeparator}${canonical.slice(dot + 1)}`;
}

/** Parse a canonical numeric string to a number, or null when it carries no
 *  numeric value (empty, a bare decimal point, or a bare `0x`/`0b` prefix).
 *  `Number()` natively parses `0x`/`0b` literals. */
export function toNumber(canonical: string): number | null {
    if (canonical === '' || canonical === '.') return null;
    const n = Number(canonical);
    return Number.isFinite(n) ? n : null;
}

/** Render a numeric model value to a decimal display string. Negative values are
 *  shown unsigned (the field cannot represent a sign); fractional digits are
 *  rounded to `decimalAccuracy` with trailing zeros dropped. */
export function fromNumber(value: number | null | undefined, options: NumberFormatOptions = {}): string {
    if (value == null || !Number.isFinite(value)) return '';
    const { decimalAllowed = false, decimalAccuracy = 4 } = options;
    const magnitude = Math.abs(value);
    const canonical = decimalAllowed
        ? String(Number(magnitude.toFixed(Math.max(0, decimalAccuracy))))
        : String(Math.trunc(magnitude));
    return format(canonical, options);
}

/** Whether `ch` carries value (vs. a group separator) for caret anchoring. */
function isSignificant(ch: string, base: NumberBase, decimalSeparator: string): boolean {
    if (ch >= '0' && ch <= '9') return true;
    if (base === 'hex') return (ch >= 'a' && ch <= 'f') || (ch >= 'A' && ch <= 'F') || ch === 'x' || ch === 'X';
    if (base === 'binary') return ch === 'b' || ch === 'B';
    return ch === decimalSeparator;
}

/** Count the "significant" characters (everything but group separators) in `s`
 *  before index `caret` — the anchor used to restore the caret after regrouping. */
export function significantCountBefore(
    s: string,
    caret: number,
    base: NumberBase = 'decimal',
    decimalSeparator = '.',
): number {
    let n = 0;
    const end = Math.min(caret, s.length);
    for (let i = 0; i < end; i++) {
        if (isSignificant(s[i], base, decimalSeparator)) n++;
    }
    return n;
}

/** Find the caret index in `formatted` sitting just after its `target`-th
 *  significant character — the inverse of {@link significantCountBefore}, so the
 *  caret stays put across separator insertion/removal. */
export function caretAfterFormat(
    formatted: string,
    target: number,
    base: NumberBase = 'decimal',
    decimalSeparator = '.',
): number {
    if (target <= 0) return 0;
    let seen = 0;
    for (let i = 0; i < formatted.length; i++) {
        if (isSignificant(formatted[i], base, decimalSeparator)) {
            seen++;
            if (seen === target) return i + 1;
        }
    }
    return formatted.length;
}
