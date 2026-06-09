<!--
  @smuit/playground
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<script lang="ts">
    import { Tabs } from '@smuit/tabs';

    const tints = ['neutral', 'primary', 'secondary', 'tertiary', 'error', 'warning', 'success'] as const;

    // Each tab set is controlled — one piece of state per demo.
    let vBold = $state('overview');
    let vSubtle = $state('all');
    let sSm = $state('day');
    let sMd = $state('day');
    let vIcons = $state('home');
    let vStates = $state('active');
    let vManual = $state('a');
    let vTints = $state<Record<string, string>>(Object.fromEntries(tints.map((t) => [t, 'one'])));
</script>

{#snippet home()}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M3 11l9-8 9 8" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M5 10v10h14V10" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
{/snippet}
{#snippet bell()}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
{/snippet}
{#snippet gear()}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
{/snippet}

<div style="display: flex; flex-direction: column; gap: 2.5rem; max-width: 52rem">
    <header>
        <h1 style="font-size: var(--text-display-sm); font-weight: 700; color: var(--page-fg)">Tabs</h1>
        <p style="color: var(--page-fg); opacity: 0.7; font-size: var(--text-body-md); margin-top: 0.5rem">
            <code>@smuit/tabs</code> · v1 (MVP) — Material Design 3 <strong>bold</strong> and
            <strong>subtle</strong> variants, sm/md sizes, tints, inline leading icons, and an
            <strong>animated sliding indicator</strong> (snaps under reduced-motion), backed by
            <code>bits-ui</code>. Overflow scrolling, vertical orientation, stacked icons, and badges are deferred.
        </p>
    </header>

    <!-- ── Variants ─────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Variants <span class="demo-hint">— bold (Primary) vs subtle (Secondary)</span></h2>
        <div class="demo-grid">
            <div>
                <p class="demo-cap">bold · tint primary</p>
                <Tabs.Root bind:value={vBold} variant="bold" tint="primary">
                    <Tabs.List>
                        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
                        <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="overview">The overview panel.</Tabs.Content>
                    <Tabs.Content value="activity">The activity panel.</Tabs.Content>
                    <Tabs.Content value="reports">The reports panel.</Tabs.Content>
                </Tabs.Root>
            </div>
            <div>
                <p class="demo-cap">subtle · neutral</p>
                <Tabs.Root bind:value={vSubtle} variant="subtle">
                    <Tabs.List>
                        <Tabs.Trigger value="all">All</Tabs.Trigger>
                        <Tabs.Trigger value="starred">Starred</Tabs.Trigger>
                        <Tabs.Trigger value="archived">Archived</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="all">Everything.</Tabs.Content>
                    <Tabs.Content value="starred">Starred only.</Tabs.Content>
                    <Tabs.Content value="archived">Archived only.</Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    </section>

    <!-- ── Sizes ────────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Sizes <span class="demo-hint">— sm vs md</span></h2>
        <div class="demo-grid">
            <div>
                <p class="demo-cap">sm</p>
                <Tabs.Root bind:value={sSm} size="sm" tint="secondary">
                    <Tabs.List>
                        <Tabs.Trigger value="day">Day</Tabs.Trigger>
                        <Tabs.Trigger value="week">Week</Tabs.Trigger>
                        <Tabs.Trigger value="month">Month</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="day">Per-day view.</Tabs.Content>
                    <Tabs.Content value="week">Per-week view.</Tabs.Content>
                    <Tabs.Content value="month">Per-month view.</Tabs.Content>
                </Tabs.Root>
            </div>
            <div>
                <p class="demo-cap">md (default)</p>
                <Tabs.Root bind:value={sMd} size="md" tint="secondary">
                    <Tabs.List>
                        <Tabs.Trigger value="day">Day</Tabs.Trigger>
                        <Tabs.Trigger value="week">Week</Tabs.Trigger>
                        <Tabs.Trigger value="month">Month</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="day">Per-day view.</Tabs.Content>
                    <Tabs.Content value="week">Per-week view.</Tabs.Content>
                    <Tabs.Content value="month">Per-month view.</Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    </section>

    <!-- ── Leading icons ────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Leading icons <span class="demo-hint">— bold, inline icon + label</span></h2>
        <Tabs.Root bind:value={vIcons} variant="bold" tint="primary">
            <Tabs.List>
                <Tabs.Trigger value="home">
                    {#snippet icon()}{@render home()}{/snippet}
                    Home
                </Tabs.Trigger>
                <Tabs.Trigger value="alerts">
                    {#snippet icon()}{@render bell()}{/snippet}
                    Alerts
                </Tabs.Trigger>
                <Tabs.Trigger value="settings">
                    {#snippet icon()}{@render gear()}{/snippet}
                    Settings
                </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="home">Home panel.</Tabs.Content>
            <Tabs.Content value="alerts">Alerts panel.</Tabs.Content>
            <Tabs.Content value="settings">Settings panel.</Tabs.Content>
        </Tabs.Root>
    </section>

    <!-- ── States ───────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">
            States <span class="demo-hint">— hover, focus (Tab key), and a disabled tab</span>
        </h2>
        <Tabs.Root bind:value={vStates} tint="primary">
            <Tabs.List>
                <Tabs.Trigger value="active">Active</Tabs.Trigger>
                <Tabs.Trigger value="enabled">Enabled</Tabs.Trigger>
                <Tabs.Trigger value="disabled" disabled>Disabled</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="active">The active panel.</Tabs.Content>
            <Tabs.Content value="enabled">A second, selectable panel.</Tabs.Content>
            <Tabs.Content value="disabled">Unreachable while disabled.</Tabs.Content>
        </Tabs.Root>
    </section>

    <!-- ── Activation mode ──────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">
            Manual activation <span class="demo-hint">— arrow keys move focus; Enter/Space selects</span>
        </h2>
        <Tabs.Root bind:value={vManual} activationMode="manual" tint="tertiary">
            <Tabs.List>
                <Tabs.Trigger value="a">First</Tabs.Trigger>
                <Tabs.Trigger value="b">Second</Tabs.Trigger>
                <Tabs.Trigger value="c">Third</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="a">First panel.</Tabs.Content>
            <Tabs.Content value="b">Second panel.</Tabs.Content>
            <Tabs.Content value="c">Third panel.</Tabs.Content>
        </Tabs.Root>
    </section>

    <!-- ── Tints ────────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Tints <span class="demo-hint">— indicator, active label, and focus accent</span></h2>
        <div class="demo-grid">
            {#each tints as t (t)}
                <div>
                    <p class="demo-cap">{t}</p>
                    <Tabs.Root bind:value={vTints[t]} tint={t}>
                        <Tabs.List>
                            <Tabs.Trigger value="one">One</Tabs.Trigger>
                            <Tabs.Trigger value="two">Two</Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content value="one">First.</Tabs.Content>
                        <Tabs.Content value="two">Second.</Tabs.Content>
                    </Tabs.Root>
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
