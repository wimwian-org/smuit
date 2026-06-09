<!--
  @smuit/list
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  List.Root — the list container. Owns the shared variant / tint / divider, the
  optional selection model, and roving keyboard navigation, and publishes a
  ListContext for the items. Renders a `<ul>` whose role is `list` normally and
  `listbox` once a selection model is set (the explicit role keeps semantics
  under `display:flex`). Compose `List.Item` rows / `List.Subheader` sections as
  children.
-->
<script lang="ts">
    // @smuit/theme is a peerDependency; importing it here lets the bit render
    // with design tokens even when the host app hasn't imported the theme.
    import '@smuit/theme';
    import '../list.css';
    import { list } from '../list.variants';
    import { twMerge } from 'tailwind-merge';
    import { setListContext, type ListContext } from './list-context';
    import type { ListRootProps } from '../types';

    let {
        variant = 'baseline',
        tint = 'neutral',
        divider = false,
        selection = 'none',
        value = $bindable(),
        control,
        onValueChange,
        roving = false,
        class: className = '',
        ref = $bindable(null),
        onkeydown: onkeydownProp,
        children,
        ...restProps
    }: ListRootProps = $props();

    // Roving is implied whenever options are selectable.
    const rovingEnabled = $derived(selection !== 'none' || roving);
    // Default trailing control: radio for single-choice, checkbox for multi.
    const controlDefault = $derived(control ?? (selection === 'single' ? 'radio' : 'checkbox'));

    // ── Selection ──────────────────────────────────────────────────────────────
    function isSelected(v: string): boolean {
        if (selection === 'multiple') return Array.isArray(value) && value.includes(v);
        return value === v;
    }
    function toggleSelected(v: string): void {
        let next: string | string[];
        if (selection === 'multiple') {
            const arr = Array.isArray(value) ? value : [];
            next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
        } else {
            // Single-choice: select (radio semantics — no deselect on re-pick).
            next = v;
        }
        value = next;
        onValueChange?.(next);
    }

    // ── Roving focus ─────────────────────────────────────────────────────────────
    // Items register their focusable element; the active one carries tabindex=0,
    // the rest tabindex=-1, and Arrow / Home / End move focus between them.
    let rovingEls = $state<HTMLElement[]>([]);
    let activeEl = $state<HTMLElement | null>(null);

    function registerRoving(el: HTMLElement): () => void {
        rovingEls.push(el);
        if (activeEl === null) activeEl = el;
        return () => {
            rovingEls = rovingEls.filter((e) => e !== el);
            if (activeEl === el) activeEl = rovingEls[0] ?? null;
        };
    }
    function setActive(el: HTMLElement): void {
        activeEl = el;
    }

    function orderedRoving(): HTMLElement[] {
        return [...rovingEls]
            .filter((el) => el.isConnected)
            .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    }

    function handleKeydown(e: KeyboardEvent): void {
        onkeydownProp?.(e);
        if (e.defaultPrevented || !rovingEnabled) return;
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
        const els = orderedRoving();
        if (els.length === 0) return;
        const cur = els.indexOf(document.activeElement as HTMLElement);
        let idx = cur;
        if (e.key === 'ArrowDown') idx = cur < 0 ? 0 : Math.min(cur + 1, els.length - 1);
        else if (e.key === 'ArrowUp') idx = cur < 0 ? els.length - 1 : Math.max(cur - 1, 0);
        else if (e.key === 'Home') idx = 0;
        else if (e.key === 'End') idx = els.length - 1;
        const target = els[idx];
        if (!target) return;
        e.preventDefault();
        setActive(target);
        target.focus();
    }

    const ctx: ListContext = {
        get variant() {
            return variant;
        },
        get tint() {
            return tint;
        },
        get divider() {
            return divider;
        },
        get selection() {
            return selection;
        },
        get control() {
            return controlDefault;
        },
        isSelected,
        toggleSelected,
        get roving() {
            return rovingEnabled;
        },
        get activeEl() {
            return activeEl;
        },
        registerRoving,
        setActive,
    };
    setListContext(ctx);

    const styles = $derived(list({ variant, tint }));
</script>

<ul
    bind:this={ref}
    role={selection === 'none' ? 'list' : 'listbox'}
    aria-multiselectable={selection === 'multiple' ? true : undefined}
    class={twMerge(styles.root(), className)}
    data-variant={variant}
    data-tint={tint}
    data-divider={divider || undefined}
    data-selection={selection === 'none' ? undefined : selection}
    onkeydown={handleKeydown}
    {...restProps}
>
    {@render children()}
</ul>
