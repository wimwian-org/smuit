<!--
  @smuit/loading-indicator
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  <LoadingIndicator> — a shape-morphing loader (M3 Expressive). Three modes:

  • indeterminate (default) — the active indicator morphs through a curated (or
    custom `shapes`) set while rotating.
  • determinate — pass `progress` (0→1) and a sweep arc tracks the value.
  • complete — `complete` (or `progress >= 1`) settles into a checkmark.

  `uncontained` renders the bare shape; `contained` frames it in a filled surface
  whose outline follows `containerShape` (rounded · squircle · cookie).

    <LoadingIndicator />
    <LoadingIndicator variant="contained" size="lg" tint="secondary" />
    <LoadingIndicator progress={0.6} />
    <LoadingIndicator complete />
-->
<script lang="ts">
    // @smuit/theme is a peerDependency; importing it here lets the bit render
    // with design tokens even when the host app hasn't imported the theme.
    import '@smuit/theme';
    import './loading-indicator.css';
    import { loadingIndicator } from './loading-indicator.variants';
    import { DEFAULT_SHAPE_SEQUENCE, CHECK_PATH } from './loading-indicator.shapes';
    import { twMerge } from 'tailwind-merge';
    import type { LoadingIndicatorProps } from './types';

    let {
        variant = 'uncontained',
        size = 'md',
        tint = 'primary',
        containerShape = 'rounded',
        progress = null,
        shapes,
        complete = false,
        label = 'Loading',
        class: className = '',
        ref = $bindable(null),
        ...restProps
    }: LoadingIndicatorProps = $props();

    // ── Mode resolution (complete › determinate › indeterminate) ──────────────
    // `progress` clamps to [0,1]; reaching 1 — or an explicit `complete` — hands
    // off to the checkmark success state.
    const clamped = $derived(progress == null ? null : Math.min(1, Math.max(0, progress)));
    const isComplete = $derived(complete || (clamped != null && clamped >= 1));
    const mode = $derived<'complete' | 'determinate' | 'indeterminate'>(
        isComplete ? 'complete' : clamped != null ? 'determinate' : 'indeterminate',
    );
    // Percentage drives both the sweep arc and `aria-valuenow`. A bare `complete`
    // (no progress) reads as 100%.
    const pct = $derived(isComplete ? 100 : clamped == null ? null : Math.round(clamped * 100));

    // Indeterminate morph set — custom `shapes` override the curated sequence; a
    // single shape rests static. The values list loops back to the first shape
    // for a seamless cycle.
    const seq = $derived(shapes && shapes.length ? shapes : DEFAULT_SHAPE_SEQUENCE);
    const restShape = $derived(seq[0]);
    const morph = $derived(seq.length < 2 ? null : (seq[seq.length - 1] === seq[0] ? seq : [...seq, seq[0]]).join(';'));

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

    const styles = $derived(loadingIndicator({ variant, size, tint, containerShape }));
</script>

<div
    bind:this={ref}
    role="progressbar"
    aria-label={label}
    aria-busy={isComplete ? 'false' : 'true'}
    aria-valuemin={mode === 'indeterminate' ? undefined : 0}
    aria-valuemax={mode === 'indeterminate' ? undefined : 100}
    aria-valuenow={mode === 'indeterminate' ? undefined : pct}
    class={twMerge(styles.root(), className)}
    data-slot="root"
    data-variant={variant}
    data-size={size}
    data-tint={tint}
    data-container-shape={containerShape}
    data-mode={mode}
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
        {#if mode === 'complete'}
            <!-- Drawn checkmark — stroke, not fill; `pathLength` normalises the draw. -->
            <path
                class="li-check"
                d={CHECK_PATH}
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                pathLength="1"
            />
        {:else if mode === 'determinate'}
            <!-- Track + sweep arc; `pathLength=100` makes the dash math read in %. -->
            <circle class="li-track" cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.5" />
            <circle
                class="li-arc"
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                pathLength="100"
                stroke-dasharray="100"
                stroke-dashoffset={100 - (pct ?? 0)}
                transform="rotate(-90 12 12)"
            />
        {:else}
            <path d={restShape} fill="currentColor">
                {#if !reduced && morph}
                    <animate attributeName="d" dur="3s" repeatCount="indefinite" values={morph} />
                {/if}
            </path>
        {/if}
    </svg>
</div>
