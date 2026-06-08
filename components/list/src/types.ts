/*
 * @smuit/list
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import type { HTMLAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';
import type { ListVariants } from './list.variants';

/** Visual treatment — the M3 design style. */
export type ListVariant = NonNullable<ListVariants['variant']>;
/** Focus-accent palette (drives the focus-visible outline). */
export type ListTint = NonNullable<ListVariants['tint']>;
/** Row layout — one-line (headline) or two-line (headline + supporting). */
export type ListLines = NonNullable<ListVariants['lines']>;
/** Item interactivity. `text` → `<div>`, `button` → `<button>`, `link` → `<a>`. */
export type ListItemType = 'text' | 'button' | 'link';

/**
 * Props for `List.Root` — the `<ul role="list">` container. Extends the native
 * `<ul>` attributes; sets the shared `variant` / `tint` / `divider` published to
 * the items via context.
 */
export type ListRootProps = Omit<HTMLAttributes<HTMLUListElement>, 'children'> & {
    /** Visual treatment (M3 design style). @default "baseline" */
    variant?: ListVariant;
    /** Tint palette — fills, hover/pressed state layers, and focus outline. @default "neutral" */
    tint?: ListTint;
    /** Draw a divider between rows (baseline only). @default false */
    divider?: boolean;
    /** `bind:ref` to the underlying `<ul>` element. @default null */
    ref?: HTMLUListElement | null;
    /** Extra classes merged onto the root (via tailwind-merge). */
    class?: string;
    /** The `List.Item` rows. */
    children: Snippet;
};

/**
 * Props for `List.Item` — a list row. Extends the native element attributes
 * (so `onclick`, `id`, `aria-*`, … flow through to the underlying
 * `<div>`/`<button>`/`<a>`), plus the smuit layout and decoration props.
 */
export type ListItemProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
    /** Row layout. Auto-derived as `two` when `supporting` is set, else `one`. */
    lines?: ListLines;
    /** Interactivity. `link` is implied by `href`; `button` by `onclick`. @default "text" */
    type?: ListItemType;
    /** Navigation target — renders the row as an `<a>`. */
    href?: string;
    /** Anchor target (when `href` is set). */
    target?: string;
    /** Non-interactive; dimmed and removed from the tab order. @default false */
    disabled?: boolean;
    /** Secondary line below the headline; promotes the row to a two-line layout. */
    supporting?: string;
    /** Leading slot (icon / avatar / image). */
    leading?: Snippet;
    /** Trailing slot (icon / short text). An interactive control here needs its own `aria-label`. */
    trailing?: Snippet;
    /** `bind:ref` to the underlying row element. @default null */
    ref?: HTMLElement | null;
    /** Extra classes merged onto the row (via tailwind-merge). */
    class?: string;
    /** The headline content. */
    children: Snippet;
};

// Deferred (next): selection (`selected` + checkbox/radio/switch trailing controls,
// single/multi-select model); three-line layout; roving arrow-key navigation;
// drag-reorder / swipe actions; section subheaders; the Expressive press shape-morph.
