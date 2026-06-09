<!--
  @smuit/playground
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<script lang="ts">
    import { LoadingIndicator } from '@smuit/loading-indicator';

    const variants = ['uncontained', 'contained'] as const;
    const sizes = ['sm', 'md', 'lg'] as const;
    const tints = ['neutral', 'primary', 'secondary', 'tertiary'] as const;
</script>

<div class="page">
    <header class="head">
        <a href="/" class="back">← Components</a>
        <h1>Loading Indicator <span class="ver">· v1</span></h1>
        <p class="lede">
            M3 Expressive indeterminate loader — the active indicator morphs through a curated set of Material shapes
            (circle → cushion → diamond → pill) while rotating. Indeterminate-only in v1.
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
