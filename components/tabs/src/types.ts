/*
 * @smuit/tabs
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import type { Tabs } from 'bits-ui';
import type { Snippet } from 'svelte';
import type { TabsVariants } from './tabs.variants';

/** Visual treatment — `bold` (M3 Primary) or `subtle` (M3 Secondary). */
export type TabsVariant = NonNullable<TabsVariants['variant']>;
/** Density — `sm` (~40px) or `md` (~48px). */
export type TabsSize = NonNullable<TabsVariants['size']>;
/** Tint palette — drives the indicator, active label/icon, state layers, and focus outline. */
export type TabsTint = NonNullable<TabsVariants['tint']>;

/**
 * Props for `Tabs.Root` — the state owner (wraps `bits-ui` `Tabs.Root`). All the
 * bits-ui root props (`value` / `onValueChange` / `activationMode` / `loop` /
 * `disabled` / `ref` / `children` …) pass through, plus the smuit axes.
 *
 * `orientation` is intentionally omitted — v1 is horizontal-only (vertical is
 * deferred). See tabs-design.md § MVP Scope.
 */
export type TabsRootProps = Omit<Tabs.RootProps, 'orientation'> & {
    /** Visual treatment (M3 tab type). @default "bold" */
    variant?: TabsVariant;
    /** Density. @default "md" */
    size?: TabsSize;
    /** Tint palette — indicator, active label, state layers, focus outline. @default "neutral" */
    tint?: TabsTint;
};

/** Props for `Tabs.List` — the `<div role="tablist">` (wraps `bits-ui` `Tabs.List`). */
export type TabsListProps = Tabs.ListProps;

/**
 * Props for `Tabs.Trigger` — a `<button role="tab">` (wraps `bits-ui`
 * `Tabs.Trigger`). Requires a `value`; supports per-trigger `disabled` and an
 * optional inline leading `icon` snippet.
 */
export type TabsTriggerProps = Tabs.TriggerProps & {
    /** Optional inline leading icon, rendered before the label. */
    icon?: Snippet;
};

/** Props for `Tabs.Content` — a `<div role="tabpanel">` (wraps `bits-ui` `Tabs.Content`). */
export type TabsContentProps = Tabs.ContentProps;

// Deferred (next): overflow / scrollable tab bars (`scrollToTab`); vertical
// `orientation`; stacked icon layout (icon above the label); a numeric/dot badge
// on a trigger; dynamic (closeable / addable) tabs.
