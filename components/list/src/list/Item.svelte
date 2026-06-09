<!--
  @smuit/list
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  List.Item — a list row. Reads the ListContext for variant/tint/selection,
  derives its layout (`lines`) and interactivity (a `<div>`/`<button>`/`<a>`
  chosen from `type` / `href` / `onclick`, or a selectable `role="option"` div
  when the list has a selection model and the row carries a `value`), and renders
  leading / headline + supporting / trailing (+ selection control). The outer
  `<li>` is the listitem; the inner element is the styled, interactive row.
-->
<script lang="ts">
    import { untrack } from 'svelte';
    import { list } from '../list.variants';
    import { twMerge } from 'tailwind-merge';
    import { getListContext } from './list-context';
    import type { ListItemProps } from '../types';

    let {
        lines: linesProp,
        type,
        href,
        target,
        disabled = false,
        value,
        control,
        supporting,
        leading,
        trailing,
        class: className = '',
        ref = $bindable(null),
        onclick: onclickProp,
        onkeydown: onkeydownProp,
        onfocus: onfocusProp,
        children,
        ...restProps
    }: ListItemProps = $props();

    const ctx = getListContext();

    // A selectable option: the list has a selection model and this row keys into
    // it. Selectable rows win the element choice (a `role="option"` div), so they
    // don't double up as a link/button.
    const selectable = $derived(ctx.selection !== 'none' && value != null);
    const selected = $derived(selectable && ctx.isSelected(value as string));
    const controlType = $derived(control ?? ctx.control);

    // Two-line when there's supporting text, unless the consumer pins it.
    const lines = $derived(linesProp ?? (supporting != null ? 'two' : 'one'));
    // Element: selectable → option div, href → link, explicit button / a click
    // handler → button, else a static div. `interactive` gates the affordances.
    const tag = $derived(
        selectable ? 'div' : href != null ? 'a' : type === 'button' || onclickProp != null ? 'button' : 'div',
    );
    const interactive = $derived(selectable || tag !== 'div');
    // A roving target gets managed tabindex + Arrow/Home/End navigation.
    const rovingTarget = $derived(ctx.roving && interactive && !disabled);

    const styles = $derived(list({ variant: ctx.variant, tint: ctx.tint, lines, interactive, disabled }));

    // Register / unregister with the roving manager so Root can move focus and
    // assign the single tabindex=0. `registerRoving` reads the roving state it
    // also mutates, so untrack the call — the effect tracks only `ref` /
    // `rovingTarget`, never the registry it feeds.
    $effect(() => {
        const el = ref;
        if (!rovingTarget || !el) return;
        return untrack(() => ctx.registerRoving(el));
    });

    function handleClick(e: MouseEvent): void {
        if (selectable && !disabled) ctx.toggleSelected(value as string);
        onclickProp?.(e);
    }
    function handleKeydown(e: KeyboardEvent): void {
        onkeydownProp?.(e);
        if (e.defaultPrevented) return;
        // Space / Enter toggle a focused option (Arrow keys bubble to Root).
        if (selectable && !disabled && (e.key === ' ' || e.key === 'Enter')) {
            e.preventDefault();
            ctx.toggleSelected(value as string);
        }
    }
    function handleFocus(e: FocusEvent): void {
        if (rovingTarget && ref) ctx.setActive(ref);
        onfocusProp?.(e);
    }

    // Element-specific attributes. A disabled link drops its href; selectable rows
    // carry option semantics; roving rows carry the managed tabindex.
    const rowAttrs = $derived({
        ...(tag === 'a' ? { href: disabled ? undefined : href, target } : {}),
        ...(tag === 'button' ? { type: 'button' as const, disabled } : {}),
        ...(selectable ? { role: 'option' as const, 'aria-selected': selected } : {}),
        ...(disabled ? { 'aria-disabled': true } : {}),
        tabindex: rovingTarget ? (ctx.activeEl === ref ? 0 : -1) : tag === 'a' && disabled ? -1 : undefined,
        'data-roving': rovingTarget || undefined,
        'data-selected': selected || undefined,
    });
</script>

<li class={styles.row()} data-slot="item">
    <svelte:element
        this={tag}
        bind:this={ref}
        class={twMerge(styles.item(), className)}
        data-slot="row"
        data-lines={lines}
        data-interactive={interactive || undefined}
        data-disabled={disabled || undefined}
        {...restProps}
        {...rowAttrs}
        onclick={handleClick}
        onkeydown={handleKeydown}
        onfocus={handleFocus}
    >
        {#if leading}<span class={styles.leading()} data-slot="leading">{@render leading()}</span>{/if}
        <span class={styles.text()} data-slot="text">
            <span class={styles.headline()} data-slot="headline">{@render children()}</span>
            {#if supporting != null}<span class={styles.supporting()} data-slot="supporting">{supporting}</span>{/if}
        </span>
        {#if trailing || selectable}
            <span class={styles.trailing()} data-slot="trailing">
                {#if trailing}{@render trailing()}{/if}
                {#if selectable}
                    <span
                        class={styles.control()}
                        data-slot="control"
                        data-control={controlType}
                        data-checked={selected || undefined}
                        aria-hidden="true"
                    ></span>
                {/if}
            </span>
        {/if}
    </svelte:element>
</li>
