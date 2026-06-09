/*
 * @wimwian-org/tabs
 * Copyright (c) 2026 wimwian
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
/** Axis — `horizontal` (default) or `vertical` (list beside the panel). */
export type TabsOrientation = NonNullable<TabsVariants['orientation']>;
/** Leading-icon layout — `inline` (before the label) or `stacked` (above it, M3 stacked tab). */
export type TabsIconLayout = NonNullable<TabsVariants['iconLayout']>;

/**
 * Props for `Tabs.Root` — the state owner (wraps `bits-ui` `Tabs.Root`). All the
 * bits-ui root props (`value` / `onValueChange` / `activationMode` / `loop` /
 * `disabled` / `orientation` / `ref` / `children` …) pass through, plus the smuit
 * axes. `orientation` is bits-ui's own prop (it drives the roving-key axis); the
 * bit styles both axes off the `data-orientation` hook bits-ui sets.
 */
export type TabsRootProps = Tabs.RootProps & {
    /** Visual treatment (M3 tab type). @default "bold" */
    variant?: TabsVariant;
    /** Density. @default "md" */
    size?: TabsSize;
    /** Tint palette — indicator, active label, state layers, focus outline. @default "neutral" */
    tint?: TabsTint;
    /** Leading-icon layout — `inline` before the label, or `stacked` above it. @default "inline" */
    iconLayout?: TabsIconLayout;
};

/**
 * Props for `Tabs.List` — the `<div role="tablist">` (wraps `bits-ui` `Tabs.List`).
 * `scrollable` opts the tab row into an overflow-scroll viewport with prev/next
 * affordance buttons (shown only while the row overflows) and keeps the active
 * tab scrolled into view.
 */
export type TabsListProps = Tabs.ListProps & {
    /** Make the tab row scroll when it overflows, with prev/next affordances. @default false */
    scrollable?: boolean;
};

/**
 * Props for `Tabs.Trigger` — a `<button role="tab">` (wraps `bits-ui`
 * `Tabs.Trigger`). Requires a `value`; supports per-trigger `disabled`, an
 * optional leading `icon` snippet (inline or stacked per the root `iconLayout`),
 * and an optional trailing `badge` snippet (a count or dot).
 */
export type TabsTriggerProps = Tabs.TriggerProps & {
    /** Optional leading icon — inline before the label, or stacked above it (per root `iconLayout`). */
    icon?: Snippet;
    /** Optional trailing badge (numeric count or dot), rendered after the label. */
    badge?: Snippet;
};

/** Props for `Tabs.Content` — a `<div role="tabpanel">` (wraps `bits-ui` `Tabs.Content`). */
export type TabsContentProps = Tabs.ContentProps;

// Deferred (next): dynamic (closeable / addable) tabs and their keyboard/focus
// reconciliation. Overflow scrolling, vertical orientation, stacked icons, and
// badges shipped in v0.3.
