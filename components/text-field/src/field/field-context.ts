/*
 * @smuit/text-field
 * Copyright (c) 2026 Anand Panchapakesan
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
}

const KEY = Symbol('smuit-field');

export const setFieldContext = (ctx: FieldContext): FieldContext => setContext(KEY, ctx);
export const getFieldContext = (): FieldContext => getContext<FieldContext>(KEY);
