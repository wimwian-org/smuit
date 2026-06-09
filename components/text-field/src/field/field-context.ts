/*
 * @smuit/text-field
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import { getContext, setContext } from 'svelte';
import type { TextFieldVariant, TextFieldSize, TextFieldTint } from '../types';

/**
 * Shared state for a field and its parts. `Field.Root` builds this (closing over
 * its own reactive props/state) and publishes it via context; every part reads
 * it. The getters preserve reactivity across the context boundary.
 */
export interface FieldContext {
    /** `id` of the control; the label's `for` and the supporting text's owner. */
    readonly inputId: string;
    /** `id` of the supporting/error text (for `aria-describedby`). */
    readonly supportId: string;
    readonly variant: TextFieldVariant;
    readonly size: TextFieldSize;
    readonly tint: TextFieldTint;
    readonly disabled: boolean;
    readonly readonly: boolean;
    readonly elevation: boolean;
    /** Multi-line (textarea) mode — switches the field to top-aligned geometry. */
    readonly multiline: boolean;
    readonly hideLabel: boolean;
    readonly maxlength: number | undefined;
    /** In the error state — a manual `error` flag, or a reported constraint failure. */
    readonly error: boolean;
    /** Error message that replaces the supporting text while in error (if non-empty). */
    readonly errorText: string | undefined;
    readonly required: boolean;
    /** Suppress the required asterisk while keeping the semantics. */
    readonly noAsterisk: boolean;
    /** Whether a leading adornment is present (shifts the label start). */
    readonly hasLeading: boolean;
    /** Two-way bound value (the control writes, parts read). */
    value: string;
    /** Label is lifted: focused, populated, or hidden-label mode. */
    readonly floated: boolean;
    /** A counter is shown (a `maxlength` is set). */
    readonly hasCounter: boolean;
    /** `id` to put on the control's `aria-describedby`, or undefined when there
     *  is no supporting text to describe it. */
    readonly describedBy: string | undefined;
    setFocused(value: boolean): void;
    setLeading(value: boolean): void;
    setSupporting(value: boolean): void;
    /** The control reports/clears a constraint-validation failure. */
    setInvalid(value: boolean): void;

    // ── Autosuggest (combobox) ────────────────────────────────────────────────
    /** Suggestion values shown on focus (the full list; the consumer pre-filters). */
    readonly suggestions: string[];
    readonly hasSuggestions: boolean;
    /** The suggestion list is open. */
    readonly open: boolean;
    /** Index of the active (highlighted) option, or -1. */
    readonly activeIndex: number;
    /** `id` of the listbox (for `aria-controls`). */
    readonly listId: string;
    /** `id` of option `index` (for `aria-activedescendant`). */
    optionId(index: number): string;
    openList(): void;
    closeList(): void;
    /** Move the active option by `delta`, opening + wrapping as needed. */
    move(delta: number): void;
    /** Commit suggestion `index` as the value and close. */
    select(index: number): void;
    /** Commit the active option (if any). */
    selectActive(): void;
    setActive(index: number): void;
}

const KEY = Symbol('smuit-field');

export const setFieldContext = (ctx: FieldContext): FieldContext => setContext(KEY, ctx);
export const getFieldContext = (): FieldContext => getContext<FieldContext>(KEY);
