<!--
  @smuit/list
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  List.Root — the list container. Owns the shared variant / tint / divider and
  publishes a ListContext for the items, and renders the `<ul role="list">`
  element (the explicit role keeps list semantics under `display:flex`). Compose
  `List.Item` rows as children.
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
        class: className = '',
        ref = $bindable(null),
        children,
        ...restProps
    }: ListRootProps = $props();

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
    };
    setListContext(ctx);

    const styles = $derived(list({ variant, tint }));
</script>

<ul
    bind:this={ref}
    role="list"
    class={twMerge(styles.root(), className)}
    data-variant={variant}
    data-tint={tint}
    data-divider={divider || undefined}
    {...restProps}
>
    {@render children()}
</ul>
