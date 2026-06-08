<!--
  @smuit/ripple
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  <Ripple> — a ready-made ripple surface. Wraps its children in an inline-flex
  container that clips ripples and applies the `ripple` action. Use this when you
  don't control the host element's positioning; otherwise reach for `use:ripple`
  directly on your own element.

    <Ripple variant="lg"><button>Click me</button></Ripple>
-->
<script lang="ts">
    import type { Snippet } from 'svelte';
    import { ripple, type RippleVariant } from './ripple';

    let {
        variant = 'md',
        color = 'currentColor',
        opacity = 0.3,
        center = false,
        disabled = false,
        class: className = '',
        children,
        ...rest
    }: {
        /** Expansion-duration variant. */
        variant?: RippleVariant;
        /** Ripple colour (any CSS colour). */
        color?: string;
        /** Peak opacity at the start of the animation. */
        opacity?: number;
        /** Emit ripples from the centre instead of the contact point. */
        center?: boolean;
        /** Suppress ripples. */
        disabled?: boolean;
        class?: string;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<span
    class={className}
    use:ripple={{ variant, color, opacity, center, disabled }}
    style="position: relative; display: inline-flex; overflow: hidden; isolation: isolate;"
    {...rest}
>
    {@render children?.()}
</span>
