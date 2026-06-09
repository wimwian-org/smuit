<!--
  @smuit/loading-indicator
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  <LoadingIndicator> — an indeterminate, shape-morphing loader (M3 Expressive).
  The active indicator continuously morphs through a curated set of Material
  shapes while rotating. `uncontained` renders the bare shape; `contained` frames
  it in a filled, rounded surface. Indeterminate-only in v1.

    <LoadingIndicator />
    <LoadingIndicator variant="contained" size="lg" tint="secondary" />
-->
<script lang="ts">
    // @smuit/theme is a peerDependency; importing it here lets the bit render
    // with design tokens even when the host app hasn't imported the theme.
    import '@smuit/theme';
    import './loading-indicator.css';
    import { loadingIndicator } from './loading-indicator.variants';
    import { twMerge } from 'tailwind-merge';
    import type { LoadingIndicatorProps } from './types';

    let {
        variant = 'uncontained',
        size = 'md',
        tint = 'primary',
        label = 'Loading',
        class: className = '',
        ref = $bindable(null),
        ...restProps
    }: LoadingIndicatorProps = $props();

    // Curated Material-shape morph set — circle → cushion → diamond → pill →
    // circle. Each path shares an identical `M + 4·C + Z` structure on a 24×24
    // viewBox so the browser interpolates `d` smoothly between them. An honest
    // approximation of the AndroidX spring-physics morph (the exact seven-shape
    // spring sequence is deferred).
    const CIRCLE =
        'M 12 2 C 17.52 2 22 6.48 22 12 C 22 17.52 17.52 22 12 22 C 6.48 22 2 17.52 2 12 C 2 6.48 6.48 2 12 2 Z';
    const CUSHION = 'M 12 2 C 21.2 2 22 2.8 22 12 C 22 21.2 21.2 22 12 22 C 2.8 22 2 21.2 2 12 C 2 2.8 2.8 2 12 2 Z';
    const DIAMOND = 'M 12 2 C 14 2 22 10 22 12 C 22 14 14 22 12 22 C 10 22 2 14 2 12 C 2 10 10 2 12 2 Z';
    const PILL =
        'M 12 5 C 18.08 5 23 8.13 23 12 C 23 15.87 18.08 19 12 19 C 5.92 19 1 15.87 1 12 C 1 8.13 5.92 5 12 5 Z';
    const morph = `${CIRCLE};${CUSHION};${DIAMOND};${PILL};${CIRCLE}`;

    // The CSS spin is disabled under prefers-reduced-motion via a media query;
    // the SMIL `<animate>` morph can't be, so gate it on the same preference.
    // Seed synchronously so the morph never renders even for a frame when the
    // user prefers reduced motion (the $effect keeps it in sync afterwards).
    let reduced = $state(
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
    $effect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        reduced = mq.matches;
        const onChange = () => (reduced = mq.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    });

    const styles = $derived(loadingIndicator({ variant, size, tint }));
</script>

<div
    bind:this={ref}
    role="progressbar"
    aria-label={label}
    aria-busy="true"
    class={twMerge(styles.root(), className)}
    data-slot="root"
    data-variant={variant}
    data-size={size}
    data-tint={tint}
    data-reduced={reduced || undefined}
    {...restProps}
>
    <svg
        class={styles.shape()}
        data-slot="indicator"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        aria-hidden="true"
        focusable="false"
    >
        <path d={CIRCLE} fill="currentColor">
            {#if !reduced}
                <animate attributeName="d" dur="3s" repeatCount="indefinite" values={morph} />
            {/if}
        </path>
    </svg>
</div>
