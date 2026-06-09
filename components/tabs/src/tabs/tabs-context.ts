/*
 * @smuit/tabs
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { getContext, setContext } from 'svelte';
import type { TabsVariant, TabsSize, TabsTint } from '../types';

/**
 * Shared state for a tab set and its parts. `Tabs.Root` builds this (closing over
 * its own reactive props + the bound active `value`) and publishes it via context;
 * `Tabs.List`, `Tabs.Trigger`, and `Tabs.Content` read it. The getters preserve
 * reactivity across the context boundary — in particular `value`, which
 * `Tabs.List` watches to reposition the sliding indicator.
 */
export interface TabsContext {
    readonly variant: TabsVariant;
    readonly size: TabsSize;
    readonly tint: TabsTint;
    /** The active tab's value — `Tabs.List` re-measures the indicator when it changes. */
    readonly value: string | undefined;
}

const KEY = Symbol('smuit-tabs');

export const setTabsContext = (ctx: TabsContext): TabsContext => setContext(KEY, ctx);
export const getTabsContext = (): TabsContext => getContext<TabsContext>(KEY);
