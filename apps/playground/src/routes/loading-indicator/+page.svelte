<!--
  @smuit/playground
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<script lang="ts">
    import { LoadingIndicator, LOADING_INDICATOR_SHAPES } from '@smuit/loading-indicator';
    import { onMount } from 'svelte';

    const variants = ['uncontained', 'contained'] as const;
    const sizes = ['sm', 'md', 'lg'] as const;
    const tints = ['neutral', 'primary', 'secondary', 'tertiary'] as const;
    const containerShapes = ['rounded', 'squircle', 'cookie'] as const;

    // Live determinate demo — ramps 0 → 1, holds on the completion checkmark,
    // then loops.
    let live = $state(0);
    onMount(() => {
        const id = setInterval(() => {
            live = live >= 1.25 ? 0 : Math.round((live + 0.05) * 100) / 100;
        }, 180);
        return () => clearInterval(id);
    });
    const liveProgress = $derived(Math.min(1, live));

    // A custom two-shape morph (circle ⇄ diamond) supplied via the `shapes` prop.
    const customShapes = [LOADING_INDICATOR_SHAPES.circle, LOADING_INDICATOR_SHAPES.diamond];
</script>

<div class="page">
    <header class="head">
        <a href="/" class="back">← Components</a>
        <h1>Loading Indicator <span class="ver">· v1.1</span></h1>
        <p class="lede">
            M3 Expressive loader — the active indicator morphs through a curated set of Material shapes (circle →
            cushion → diamond → pill) while rotating. v1.1 adds a determinate <code>progress</code> mode, a completion
            checkmark, custom <code>shapes</code>, and squircle / cookie container outlines.
        </p>
    </header>

    <!-- variant × size, default (primary) tint -->
    <section>
        <h2>Variants × sizes</h2>
        <div class="grid">
            {#each variants as variant (variant)}
                <div class="cell">
                    <div class="row">
                        {#each sizes as size (size)}
                            <div class="chipwrap">
                                <LoadingIndicator {variant} {size} />
                                <span class="chip">{size}</span>
                            </div>
                        {/each}
                    </div>
                    <span class="chip chip-strong">{variant}</span>
                </div>
            {/each}
        </div>
    </section>

    <!-- tints, contained (md) so the fill is visible -->
    <section>
        <h2>Tints · contained</h2>
        <div class="row">
            {#each tints as tint (tint)}
                <div class="chipwrap">
                    <LoadingIndicator variant="contained" size="md" {tint} />
                    <span class="chip">{tint}</span>
                </div>
            {/each}
        </div>
    </section>

    <!-- tints, uncontained -->
    <section>
        <h2>Tints · uncontained</h2>
        <div class="row">
            {#each tints as tint (tint)}
                <div class="chipwrap">
                    <LoadingIndicator variant="uncontained" size="md" {tint} />
                    <span class="chip">{tint}</span>
                </div>
            {/each}
        </div>
    </section>

    <!-- determinate progress -->
    <section>
        <h2>Determinate <span class="ver">· progress</span></h2>
        <p class="lede">
            Pass <code>progress</code> (0→1) and the indicator becomes a determinate
            <code>role="progressbar"</code> — a sweep arc tracks the value and the root exposes
            <code>aria-valuenow</code>. Reaching <code>1</code> hands off to the completion checkmark.
        </p>
        <div class="row">
            {#each [0.25, 0.5, 0.75] as p (p)}
                <div class="chipwrap">
                    <LoadingIndicator variant="contained" progress={p} />
                    <span class="chip">{Math.round(p * 100)}%</span>
                </div>
            {/each}
            <div class="chipwrap">
                <LoadingIndicator variant="contained" progress={liveProgress} complete={live >= 1} />
                <span class="chip">live · {Math.round(liveProgress * 100)}%</span>
            </div>
        </div>
    </section>

    <!-- completion hand-off -->
    <section>
        <h2>Completion</h2>
        <p class="lede">
            <code>complete</code> (or <code>progress >= 1</code>) settles into a success-tinted, drawn checkmark and
            clears <code>aria-busy</code>.
        </p>
        <div class="row">
            {#each variants as variant (variant)}
                <div class="chipwrap">
                    <LoadingIndicator {variant} complete />
                    <span class="chip">{variant}</span>
                </div>
            {/each}
        </div>
    </section>

    <!-- container shapes -->
    <section>
        <h2>Container shapes · contained</h2>
        <p class="lede">
            <code>containerShape</code> swaps the contained outline — the M3 <code>rounded</code> squircle-ish default,
            a fuller <code>squircle</code>, or a scalloped <code>cookie</code>.
        </p>
        <div class="row">
            {#each containerShapes as containerShape (containerShape)}
                <div class="chipwrap">
                    <LoadingIndicator variant="contained" size="lg" tint="secondary" {containerShape} />
                    <span class="chip">{containerShape}</span>
                </div>
            {/each}
        </div>
    </section>

    <!-- custom shapes -->
    <section>
        <h2>Custom shapes</h2>
        <p class="lede">
            Supply a <code>shapes</code> array (SVG <code>d</code> strings sharing the curated
            <code>M + 4·C + Z</code> structure) to drive a bespoke morph — here a circle ⇄ diamond cycle.
        </p>
        <div class="row">
            <div class="chipwrap">
                <LoadingIndicator variant="contained" shapes={customShapes} />
                <span class="chip">circle ⇄ diamond</span>
            </div>
        </div>
    </section>

    <section>
        <h2>Accessible label</h2>
        <p class="lede">
            The root is an indeterminate <code>role="progressbar"</code> with an
            <code>aria-label</code> (default “Loading”). Honours
            <code>prefers-reduced-motion</code> — enable it in your OS to see the morph stop on a resting shape.
        </p>
        <div class="row">
            <div class="chipwrap">
                <LoadingIndicator variant="contained" tint="primary" label="Fetching results" />
                <span class="chip">label="Fetching results"</span>
            </div>
        </div>
    </section>
</div>

<style>
    .page {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
        color: var(--page-fg);
    }
    .head {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .back {
        color: var(--page-fg);
        opacity: 0.6;
        text-decoration: none;
        font-size: var(--text-body-sm);
    }
    h1 {
        font-size: var(--text-display-sm);
        font-weight: 700;
    }
    .ver {
        opacity: 0.4;
        font-weight: 400;
    }
    h2 {
        font-size: var(--text-heading-md);
        font-weight: 600;
        margin-bottom: 1rem;
    }
    .lede {
        font-size: var(--text-body-md);
        line-height: var(--text-body-md--line-height);
        opacity: 0.75;
        max-width: 64ch;
    }
    code {
        font-size: var(--text-code-sm);
        background: var(--surface-mono-bg-muted);
        padding: 0.1em 0.35em;
        border-radius: 0.3rem;
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
        gap: 1.5rem;
    }
    .cell {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1.75rem 1rem;
        background: var(--canvas-bg);
        border: 1px solid var(--canvas-border);
        border-radius: 1rem;
    }
    .row {
        display: flex;
        gap: 1.75rem;
        flex-wrap: wrap;
        align-items: center;
    }
    .chipwrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.625rem;
    }
    .chip {
        font-size: var(--text-label-sm);
        opacity: 0.6;
        font-variant-numeric: tabular-nums;
    }
    .chip-strong {
        opacity: 0.9;
        font-weight: 600;
        text-transform: capitalize;
    }
</style>
