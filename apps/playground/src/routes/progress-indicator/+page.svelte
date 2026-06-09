<!--
  @smuit/playground
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<script lang="ts">
    import { ProgressIndicator } from '@smuit/progress-indicator';

    const tints = ['neutral', 'primary', 'secondary', 'error', 'warning', 'success'] as const;
    const sizes = ['sm', 'md', 'lg'] as const;

    // A live determinate value the user can scrub.
    let value = $state(0.6);
</script>

<div style="display: flex; flex-direction: column; gap: 2.5rem; max-width: 52rem">
    <header>
        <h1 style="font-size: var(--text-display-sm); font-weight: 700; color: var(--page-fg)">Progress Indicator</h1>
        <p style="color: var(--page-fg); opacity: 0.7; font-size: var(--text-body-md); margin-top: 0.5rem">
            <code>@smuit/progress-indicator</code> · v1 (MVP) — Material Design 3
            <strong>linear</strong> progress in <strong>determinate</strong> and
            <strong>indeterminate</strong> modes, retintable, in three track heights. Circular, four-color, and buffer are
            deferred.
        </p>
    </header>

    <!-- ── Modes ───────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Modes <span class="demo-hint">— determinate vs indeterminate</span></h2>
        <div class="demo-grid">
            <div>
                <p class="demo-cap">Determinate · 60%</p>
                <ProgressIndicator value={0.6} aria-label="Determinate example, 60 percent" />
            </div>
            <div>
                <p class="demo-cap">Indeterminate</p>
                <ProgressIndicator indeterminate aria-label="Indeterminate example" />
            </div>
        </div>
    </section>

    <!-- ── Live value ──────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Live value <span class="demo-hint">— scrub to update the fill</span></h2>
        <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 28rem">
            <ProgressIndicator {value} aria-label="Live determinate value" />
            <label style="display: flex; align-items: center; gap: 0.75rem; color: var(--page-fg)">
                <input type="range" min="0" max="1" step="0.01" bind:value style="flex: 1" />
                <span style="font-size: var(--text-body-sm); font-variant-numeric: tabular-nums; min-width: 3ch"
                    >{Math.round(value * 100)}%</span
                >
            </label>
        </div>
    </section>

    <!-- ── Tints ───────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Tints <span class="demo-hint">— determinate (70%)</span></h2>
        <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 28rem">
            {#each tints as tint (tint)}
                <div>
                    <p class="demo-cap">{tint}</p>
                    <ProgressIndicator value={0.7} {tint} aria-label="{tint} determinate, 70 percent" />
                </div>
            {/each}
        </div>
    </section>

    <!-- ── Sizes ───────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Sizes <span class="demo-hint">— sm 4px · md 8px · lg 12px</span></h2>
        <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 28rem">
            {#each sizes as size (size)}
                <div>
                    <p class="demo-cap">{size}</p>
                    <ProgressIndicator value={0.5} {size} aria-label="{size} determinate, 50 percent" />
                </div>
            {/each}
        </div>
    </section>

    <!-- ── Indeterminate across tints ──────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Indeterminate <span class="demo-hint">— animated, across tints</span></h2>
        <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 28rem">
            {#each tints as tint (tint)}
                <div>
                    <p class="demo-cap">{tint}</p>
                    <ProgressIndicator indeterminate {tint} aria-label="{tint} indeterminate" />
                </div>
            {/each}
        </div>
    </section>
</div>

<style>
    .demo-h2 {
        color: var(--page-fg);
        font-size: var(--text-heading-md);
        font-weight: 600;
        margin-bottom: 1rem;
    }
    .demo-hint {
        font-weight: 400;
        opacity: 0.5;
        font-size: var(--text-body-sm);
    }
    .demo-cap {
        color: var(--page-fg);
        opacity: 0.5;
        font-size: var(--text-label-sm);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: 0.5rem;
    }
    .demo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
        gap: 1.5rem 1.25rem;
        align-items: start;
    }
</style>
