<!--
  @smuit/list
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  List.Subheader — a section label between groups of rows. Renders a
  presentational `<li>` (role="presentation" so it isn't announced as a list item
  / option) carrying the muted overline label style. With `sticky` it pins to the
  top of the nearest scroll container while its group scrolls; in Expressive lists
  it starts a fresh rounded group (see list.css).
-->
<script lang="ts">
    import { list } from '../list.variants';
    import { twMerge } from 'tailwind-merge';
    import type { ListSubheaderProps } from '../types';

    let {
        sticky = false,
        class: className = '',
        ref = $bindable(null),
        children,
        ...restProps
    }: ListSubheaderProps = $props();

    const styles = list();
</script>

<li
    bind:this={ref}
    role="presentation"
    class={twMerge(styles.subheader(), className)}
    data-slot="subheader"
    data-sticky={sticky || undefined}
    {...restProps}
>
    {@render children()}
</li>
