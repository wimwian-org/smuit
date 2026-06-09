<!--
  @smuit/progress-indicator
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  ProgressIndicator — a Material Design 3–style linear progress bar. Presentational
  (no headless primitive): a `role="progressbar"` root track with an accent
  indicator. Determinate when given a numeric `value` (fraction of `max`),
  indeterminate (animated) otherwise.

    <ProgressIndicator value={0.6} />          ← 60% determinate
    <ProgressIndicator indeterminate />        ← animated, unknown duration
    <ProgressIndicator value={0.3} tint="error" size="lg" aria-label="Upload" />
-->
<script lang="ts">
    import '@smuit/theme';
    import './progress-indicator.css';
    import { progressIndicator } from './progress-indicator.variants';
    import { twMerge } from 'tailwind-merge';
    import type { ProgressIndicatorProps } from './types';

    let {
        value = undefined,
        max = 1,
        indeterminate = undefined,
        tint = 'primary',
        size = 'md',
        class: className = '',
        ref = $bindable(null),
        ...restProps
    }: ProgressIndicatorProps = $props();

    // Indeterminate when explicitly set, or when no numeric value is supplied.
    const isIndeterminate = $derived(indeterminate ?? value == null);
    // Clamp the value into [0, max] so the fill and ARIA stay in range.
    const clamped = $derived(value == null ? 0 : Math.min(Math.max(value, 0), max));
    const fraction = $derived(max > 0 ? clamped / max : 0);

    const styles = $derived(progressIndicator({ tint, size, indeterminate: isIndeterminate }));
    const rootCls = $derived(twMerge(styles.root(), String(className ?? '')));
</script>

<!-- restProps spread first so a consumer can pass aria-label / id, but can never
     clobber the role + computed progressbar ARIA below it. -->
<div
    bind:this={ref}
    class={rootCls}
    {...restProps}
    role="progressbar"
    data-slot="track"
    data-tint={tint}
    data-size={size}
    data-indeterminate={isIndeterminate ? '' : undefined}
    aria-valuemin={0}
    aria-valuemax={max}
    aria-valuenow={isIndeterminate ? undefined : clamped}
    aria-valuetext={isIndeterminate ? undefined : `${Math.round(fraction * 100)}%`}
    style:--progress-value={isIndeterminate ? undefined : fraction}
>
    <div class={styles.indicator()} data-slot="indicator"></div>
</div>
