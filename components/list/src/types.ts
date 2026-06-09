/*
 * @smuit/list
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import type { HTMLAttributes, HTMLLiAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';
import type { ListVariants } from './list.variants';

/** Visual treatment — the M3 design style. */
export type ListVariant = NonNullable<ListVariants['variant']>;
/** Focus-accent palette (drives the focus-visible outline). */
export type ListTint = NonNullable<ListVariants['tint']>;
/** Row layout — one-line, two-line, or three-line. */
export type ListLines = NonNullable<ListVariants['lines']>;
/** Item interactivity. `text` → `<div>`, `button` → `<button>`, `link` → `<a>`. */
export type ListItemType = 'text' | 'button' | 'link';
/** Selection model — off, single-choice, or multi-choice. */
export type ListSelection = 'none' | 'single' | 'multiple';
/** The trailing selection-control affordance drawn on a selectable row. */
export type ListControl = 'checkbox' | 'radio' | 'switch';

/**
 * Props for `List.Root` — the list container. Extends the native `<ul>`
 * attributes; sets the shared `variant` / `tint` / `divider` published to the
 * items via context, plus the optional `selection` model and `roving` keyboard
 * navigation.
 *
 * When `selection` is on the container becomes a `role="listbox"` (vs.
 * `role="list"`), and roving arrow-key navigation is implied.
 */
export type ListRootProps = Omit<HTMLAttributes<HTMLUListElement>, 'children'> & {
    /** Visual treatment (M3 design style). @default "baseline" */
    variant?: ListVariant;
    /** Tint palette — fills, hover/pressed state layers, and focus outline. @default "neutral" */
    tint?: ListTint;
    /** Draw a divider between rows (baseline only). @default false */
    divider?: boolean;
    /** Selection model. `single` / `multiple` turn rows with a `value` into selectable options. @default "none" */
    selection?: ListSelection;
    /**
     * Selected value(s) — `bind:value`. A `string` (or `undefined`) under
     * `single`, a `string[]` under `multiple`. Ignored when `selection` is off.
     */
    value?: string | string[];
    /** Default trailing control drawn on selectable rows. @default radio (single) · checkbox (multiple) */
    control?: ListControl;
    /** Called with the next selection whenever it changes. */
    onValueChange?: (value: string | string[]) => void;
    /**
     * Roving arrow-key focus across interactive rows. Always on when `selection`
     * is set; opt in for plain link/button lists. @default false
     */
    roving?: boolean;
    /** `bind:ref` to the underlying `<ul>` element. @default null */
    ref?: HTMLUListElement | null;
    /** Extra classes merged onto the root (via tailwind-merge). */
    class?: string;
    /** The `List.Item` / `List.Subheader` children. */
    children: Snippet;
};

/**
 * Props for `List.Item` — a list row. Extends the native element attributes
 * (so `onclick`, `id`, `aria-*`, … flow through to the underlying
 * `<div>`/`<button>`/`<a>`), plus the smuit layout, selection, and decoration
 * props.
 */
export type ListItemProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
    /** Row layout. Auto-derived as `two` when `supporting` is set, else `one`; `three` is opt-in. */
    lines?: ListLines;
    /** Interactivity. `link` is implied by `href`; `button` by `onclick`. @default "text" */
    type?: ListItemType;
    /** Navigation target — renders the row as an `<a>`. */
    href?: string;
    /** Anchor target (when `href` is set). */
    target?: string;
    /** Non-interactive; dimmed and removed from the tab order. @default false */
    disabled?: boolean;
    /**
     * Selection key. In a selectable list, a row with a `value` becomes a
     * `role="option"` toggle; its selected state is read from `List.Root`'s
     * `value`.
     */
    value?: string;
    /** Override the trailing selection control for this row (defaults to the list's `control`). */
    control?: ListControl;
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

/**
 * Props for `List.Subheader` — a section label between groups of rows. Renders a
 * presentational `<li>` (not a list item / option); optionally sticks to the top
 * of the scroll container. In Expressive lists it starts a fresh rounded group.
 */
export type ListSubheaderProps = Omit<HTMLLiAttributes, 'children'> & {
    /** Stick to the top of the nearest scroll container while its group scrolls. @default false */
    sticky?: boolean;
    /** `bind:ref` to the underlying `<li>` element. @default null */
    ref?: HTMLLIElement | null;
    /** Extra classes merged onto the subheader (via tailwind-merge). */
    class?: string;
    /** The subheader label. */
    children: Snippet;
};

// Still deferred (next): drag-to-reorder and swipe actions.
