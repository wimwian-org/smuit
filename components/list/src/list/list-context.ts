/*
 * @smuit/list
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import { getContext, setContext } from 'svelte';
import type { ListVariant, ListTint } from '../types';

/**
 * Shared state for a list and its items. `List.Root` builds this (closing over
 * its own reactive props) and publishes it via context; every `List.Item` reads
 * it. The getters preserve reactivity across the context boundary.
 */
export interface ListContext {
    readonly variant: ListVariant;
    readonly tint: ListTint;
    /** Draw a divider between rows (baseline only). */
    readonly divider: boolean;
}

const KEY = Symbol('smuit-list');

export const setListContext = (ctx: ListContext): ListContext => setContext(KEY, ctx);
export const getListContext = (): ListContext => getContext<ListContext>(KEY);
