/*
 * @smuit/text-field
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */

/**
 * Pure (DOM-free) input-masking helpers backing <MaskedField>. Kept apart from
 * the component so the formatting + caret logic is unit-testable in node mode.
 *
 * A mask is a template string of token + literal characters:
 *   • `#` — a digit (0–9)
 *   • `A` — a letter (A–Z / a–z)
 *   • `*` — alphanumeric (digit or letter)
 *   • `\` — escapes the next character so a literal `#`, `A`, or `*` can appear
 *   • every other character is a literal, inserted automatically as the user types
 *
 * {@link applyMask} fits the raw input into the token slots left-to-right,
 * skipping characters that don't fit the current slot's class and auto-inserting
 * the literals between filled slots. It returns both the formatted `masked`
 * string and the `unmasked` value (the token characters only, no literals).
 *
 * Caret preservation ({@link unmaskedCountBefore} / {@link caretAfterMask}) anchors
 * on the count of value (alphanumeric) characters, so the caret survives literal
 * insertion/removal. For that anchoring to stay accurate the mask's literal
 * characters should be non-alphanumeric (punctuation, spaces) — an alphanumeric
 * literal would be counted as a value character.
 */

export type MaskTokenKind = 'digit' | 'letter' | 'alnum';

export interface MaskToken {
    /** A fixed character inserted verbatim (separators, punctuation). */
    literal: boolean;
    /** The literal character (when `literal`). */
    char?: string;
    /** The accepted class (when not `literal`). */
    kind?: MaskTokenKind;
}

const KIND: Record<string, MaskTokenKind> = { '#': 'digit', A: 'letter', '*': 'alnum' };

/** Parse a mask template into its token sequence, honouring `\` escapes. */
export function tokenize(mask: string): MaskToken[] {
    const tokens: MaskToken[] = [];
    for (let i = 0; i < mask.length; i++) {
        const ch = mask[i];
        if (ch === '\\') {
            const next = mask[i + 1];
            tokens.push({ literal: true, char: next ?? '\\' });
            if (next !== undefined) i++;
            continue;
        }
        const kind = KIND[ch];
        if (kind) tokens.push({ literal: false, kind });
        else tokens.push({ literal: true, char: ch });
    }
    return tokens;
}

const isDigit = (ch: string): boolean => ch >= '0' && ch <= '9';
const isLetter = (ch: string): boolean => (ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z');

/** Whether `ch` is accepted by a token of `kind`. */
export function accepts(ch: string, kind: MaskTokenKind): boolean {
    if (kind === 'digit') return isDigit(ch);
    if (kind === 'letter') return isLetter(ch);
    return isDigit(ch) || isLetter(ch);
}

export interface MaskResult {
    /** The formatted display string (token characters + literals). */
    masked: string;
    /** The raw value — token characters only, with literals stripped. */
    unmasked: string;
}

/**
 * Fit `raw` into `mask`, returning the formatted string and the bare value.
 * Characters that don't fit the current token's class are dropped; literals are
 * buffered and flushed only once a following token slot is filled, so a partial
 * value never carries a trailing separator (e.g. `415` → `(415`, not `(415) `).
 * Input beyond the mask's last token is discarded (the mask is the length cap).
 */
export function applyMask(raw: string, mask: string): MaskResult {
    const tokens = tokenize(mask);
    let masked = '';
    let unmasked = '';
    let pending = ''; // literals held back until the next class slot is filled
    let ri = 0;
    for (const token of tokens) {
        if (token.literal) {
            pending += token.char;
            if (ri < raw.length && raw[ri] === token.char) ri++; // absorb a typed literal
            continue;
        }
        while (ri < raw.length && !accepts(raw[ri], token.kind!)) ri++; // skip what doesn't fit
        if (ri >= raw.length) break; // input exhausted — drop the buffered literals
        masked += pending + raw[ri];
        unmasked += raw[ri];
        pending = '';
        ri++;
    }
    return { masked, unmasked };
}

const isValue = (ch: string): boolean => isDigit(ch) || isLetter(ch);

/** Count the value (alphanumeric) characters in `s` before index `caret` — the
 *  anchor used to restore the caret across literal insertion/removal. */
export function unmaskedCountBefore(s: string, caret: number): number {
    let n = 0;
    const end = Math.min(caret, s.length);
    for (let i = 0; i < end; i++) if (isValue(s[i])) n++;
    return n;
}

/** Find the caret index in `masked` just after its `count`-th value character —
 *  the inverse of {@link unmaskedCountBefore}, so the caret stays put. */
export function caretAfterMask(masked: string, count: number): number {
    if (count <= 0) return 0;
    let seen = 0;
    for (let i = 0; i < masked.length; i++) {
        if (isValue(masked[i])) {
            seen++;
            if (seen === count) return i + 1;
        }
    }
    return masked.length;
}

/** Whether every non-literal token in `mask` accepts only digits — lets a
 *  consumer pick the `numeric` on-screen keyboard. */
export function isDigitOnlyMask(mask: string): boolean {
    const classes = tokenize(mask).filter((t) => !t.literal);
    return classes.length > 0 && classes.every((t) => t.kind === 'digit');
}
