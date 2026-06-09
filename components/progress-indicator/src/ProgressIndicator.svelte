<!--
  @wimwian-org/progress-indicator
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  ProgressIndicator — a Material Design 3–style progress indicator. Presentational
  (no headless primitive): a `role="progressbar"` element with an accent
  indicator, in a linear bar or a circular ring. Determinate when given a numeric
  `value` (fraction of `max`), indeterminate (animated) otherwise.

    <ProgressIndicator value={0.6} />                         ← 60% linear
    <ProgressIndicator shape="circular" value={0.6} showValue />
    <ProgressIndicator indeterminate fourColor />             ← four-colour spinner
    <ProgressIndicator value={0.3} buffer={0.6} />            ← linear w/ buffer
-->
<script lang="ts">
    import '@wimwian-org/theme';
    import './progress-indicator.css';
    import { progressIndicator } from './progress-indicator.variants';
    import { twMerge } from 'tailwind-merge';
    import type { ProgressIndicatorProps } from './types';

    let {
        value = undefined,
        max = 1,
        indeterminate = undefined,
        shape = 'linear',
        buffer = undefined,
        fourColor = false,
        showValue = false,
        label,
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
    const percent = $derived(Math.round(fraction * 100));

    const isCircular = $derived(shape === 'circular');
    // Circle is normalised to pathLength=100; offset reveals `fraction` of it.
    const dashOffset = $derived(100 - fraction * 100);

    // Linear buffer (a second determinate channel) — linear + determinate only.
    const hasBuffer = $derived(!isCircular && !isIndeterminate && buffer != null);
    const bufferClamped = $derived(buffer == null ? 0 : Math.min(Math.max(buffer, 0), max));
    const bufferFraction = $derived(max > 0 ? bufferClamped / max : 0);

    // Four-colour cycle is only meaningful while animating.
    const isFourColor = $derived(fourColor && isIndeterminate);

    // A numeric readout / caption wraps the bar in a field (except the circular
    // readout, which sits inside the ring).
    const hasValueText = $derived(showValue && !isIndeterminate);
    const hasField = $derived(label ? true : !isCircular && hasValueText);

    const styles = $derived(
        progressIndicator({ shape, tint, size, indeterminate: isIndeterminate, fourColor: isFourColor }),
    );
</script>

<!-- The role="progressbar" element. restProps spread first so a consumer can pass
     aria-label / id, but can never clobber the role + computed ARIA below it. -->
{#snippet bar(extraClass: string)}
    <div
        bind:this={ref}
        class={twMerge(styles.root(), extraClass)}
        {...restProps}
        role="progressbar"
        data-slot="track"
        data-shape={shape}
        data-tint={tint}
        data-size={size}
        data-indeterminate={isIndeterminate ? '' : undefined}
        data-four-color={isFourColor ? '' : undefined}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={isIndeterminate ? undefined : clamped}
        aria-valuetext={isIndeterminate ? undefined : `${percent}%`}
        style:--progress-value={isIndeterminate ? undefined : fraction}
        style:--progress-buffer={hasBuffer ? bufferFraction : undefined}
    >
        {#if isCircular}
            <svg class="progress-svg" viewBox="0 0 48 48" aria-hidden="true">
                <circle class="progress-track-ring" cx="24" cy="24" r="20" pathLength="100" />
                <circle
                    class={twMerge('progress-bar', styles.indicator())}
                    data-slot="indicator"
                    cx="24"
                    cy="24"
                    r="20"
                    pathLength="100"
                    stroke-dasharray={isIndeterminate ? undefined : 100}
                    stroke-dashoffset={isIndeterminate ? undefined : dashOffset}
                />
            </svg>
            {#if hasValueText}<span class={styles.value()} data-slot="value">{percent}%</span>{/if}
        {:else}
            {#if hasBuffer}
                <div class="progress-buffer" data-slot="buffer"></div>
                <div class="progress-dots" data-slot="dots"></div>
            {/if}
            <div class={styles.indicator()} data-slot="indicator"></div>
        {/if}
    </div>
{/snippet}

{#if hasField}
    <div
        class={twMerge(styles.field(), isCircular ? 'items-center' : 'w-full', String(className ?? ''))}
        data-slot="field"
    >
        {#if isCircular}
            {@render bar('')}
            {#if label}
                <span class="progress-caption text-label-sm font-medium text-c-700" data-slot="label">
                    {@render label()}
                </span>
            {/if}
        {:else}
            <div class={styles.label()} data-slot="label">
                <span
                    >{#if label}{@render label()}{/if}</span
                >
                {#if hasValueText}<span class={styles.value()} data-slot="value">{percent}%</span>{/if}
            </div>
            {@render bar('')}
        {/if}
    </div>
{:else}
    {@render bar(String(className ?? ''))}
{/if}
