<!--
  @smuit/list
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  List.Item — a list row. Reads the ListContext for variant/tint, derives its
  layout (`lines`) and interactivity (a `<div>`/`<button>`/`<a>` chosen from
  `type` / `href` / `onclick`), and renders leading / headline + supporting /
  trailing. The outer `<li>` is the listitem; the inner element is the styled,
  interactive row.
-->
<script lang="ts">
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
        supporting,
        leading,
        trailing,
        class: className = '',
        ref = $bindable(null),
        children,
        ...restProps
    }: ListItemProps = $props();

    const ctx = getListContext();

    // Two-line when there's supporting text, unless the consumer pins it.
    const lines = $derived(linesProp ?? (supporting != null ? 'two' : 'one'));
    // Element: href → link, explicit button / a click handler → button, else a
    // static div. `interactive` gates the hover/focus affordances.
    const tag = $derived(href != null ? 'a' : type === 'button' || restProps.onclick != null ? 'button' : 'div');
    const interactive = $derived(tag !== 'div');

    const styles = $derived(list({ variant: ctx.variant, tint: ctx.tint, lines, interactive, disabled }));

    // Element-specific attributes. A disabled link drops its href + leaves the
    // tab order; a disabled button uses the native attribute; both announce it.
    const rowAttrs = $derived({
        ...(tag === 'a' ? { href: disabled ? undefined : href, target, tabindex: disabled ? -1 : undefined } : {}),
        ...(tag === 'button' ? { type: 'button' as const, disabled } : {}),
        ...(disabled ? { 'aria-disabled': true } : {}),
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
        {...rowAttrs}
        {...restProps}
    >
        {#if leading}<span class={styles.leading()} data-slot="leading">{@render leading()}</span>{/if}
        <span class={styles.text()} data-slot="text">
            <span class={styles.headline()} data-slot="headline">{@render children()}</span>
            {#if supporting != null}<span class={styles.supporting()} data-slot="supporting">{supporting}</span>{/if}
        </span>
        {#if trailing}<span class={styles.trailing()} data-slot="trailing">{@render trailing()}</span>{/if}
    </svelte:element>
</li>
