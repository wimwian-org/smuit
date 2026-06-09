/*
 * @smuit/list
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import { getContext, setContext } from 'svelte';
import type { ListVariant, ListTint, ListSelection, ListControl } from '../types';

/**
 * Shared state for a list and its items. `List.Root` builds this (closing over
 * its own reactive props + roving state) and publishes it via context; every
 * `List.Item` reads it. The getters preserve reactivity across the context
 * boundary.
 */
export interface ListContext {
    readonly variant: ListVariant;
    readonly tint: ListTint;
    /** Draw a divider between rows (baseline only). */
    readonly divider: boolean;

    /** Selection model (`none` disables option semantics). */
    readonly selection: ListSelection;
    /** Default trailing control for selectable rows. */
    readonly control: ListControl;
    /** Whether the active value(s) include `value`. */
    isSelected(value: string): boolean;
    /** Toggle (multiple) or set (single) the selection for `value`. */
    toggleSelected(value: string): void;

    /** Roving arrow-key navigation is active (always on under selection). */
    readonly roving: boolean;
    /** The currently tab-reachable roving element (gets `tabindex="0"`). */
    readonly activeEl: HTMLElement | null;
    /** Register a roving target; returns an unregister cleanup. */
    registerRoving(el: HTMLElement): () => void;
    /** Mark `el` as the active roving target (e.g. on focus). */
    setActive(el: HTMLElement): void;
}

const KEY = Symbol('smuit-list');

export const setListContext = (ctx: ListContext): ListContext => setContext(KEY, ctx);
export const getListContext = (): ListContext => getContext<ListContext>(KEY);
