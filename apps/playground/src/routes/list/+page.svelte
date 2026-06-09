<!--
  @smuit/playground
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<script lang="ts">
    import { List } from '@smuit/list';

    const tints = ['neutral', 'primary', 'secondary', 'tertiary'] as const;
    let clicked = $state('—');

    // Selection demos
    let assignee = $state('grace'); // single
    let labels = $state<string[]>(['urgent']); // multiple
</script>

{#snippet chevron()}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m9 18 6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
{/snippet}

{#snippet person()}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" stroke-linecap="round" />
    </svg>
{/snippet}

{#snippet avatar(initials: string)}
    <span
        style="display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: 50%; background: var(--surface-primary-solid); color: var(--surface-primary-solid-fg); font-size: var(--text-label-sm); font-weight: 600"
        aria-hidden="true">{initials}</span
    >
{/snippet}

<div style="display: flex; flex-direction: column; gap: 2.5rem; max-width: 52rem">
    <header>
        <h1 style="font-size: var(--text-display-sm); font-weight: 700; color: var(--page-fg)">List</h1>
        <p style="color: var(--page-fg); opacity: 0.7; font-size: var(--text-body-md); margin-top: 0.5rem">
            <code>@smuit/list</code> — Material Design 3 <strong>Baseline</strong> and
            <strong>Expressive</strong> variants, one/two/three-line rows, leading/trailing slots, static · button ·
            link items, single/multiple <strong>selection</strong> (checkbox · radio · switch), <strong>roving</strong>
            arrow-key navigation, and sticky <strong>subheaders</strong>.
        </p>
    </header>

    <!-- ── Variants ─────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Variants <span class="demo-hint">— Baseline (left) vs Expressive (right)</span></h2>
        <div class="demo-grid">
            <div>
                <p class="demo-cap">Baseline · with divider</p>
                <List.Root divider>
                    <List.Item supporting="Software engineer">
                        {#snippet leading()}{@render avatar('AL')}{/snippet}
                        Ada Lovelace
                    </List.Item>
                    <List.Item supporting="Computer scientist">
                        {#snippet leading()}{@render avatar('GH')}{/snippet}
                        Grace Hopper
                    </List.Item>
                    <List.Item supporting="Mathematician">
                        {#snippet leading()}{@render avatar('AT')}{/snippet}
                        Alan Turing
                    </List.Item>
                </List.Root>
            </div>
            <div>
                <p class="demo-cap">Expressive · grouped & rounded</p>
                <List.Root variant="expressive">
                    <List.Item supporting="Software engineer">
                        {#snippet leading()}{@render avatar('AL')}{/snippet}
                        Ada Lovelace
                    </List.Item>
                    <List.Item supporting="Computer scientist">
                        {#snippet leading()}{@render avatar('GH')}{/snippet}
                        Grace Hopper
                    </List.Item>
                    <List.Item supporting="Mathematician">
                        {#snippet leading()}{@render avatar('AT')}{/snippet}
                        Alan Turing
                    </List.Item>
                </List.Root>
            </div>
        </div>
    </section>

    <!-- ── Layouts (one / two line) ─────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Layouts</h2>
        <div class="demo-grid">
            <div>
                <p class="demo-cap">One-line</p>
                <List.Root variant="expressive">
                    <List.Item>
                        {#snippet leading()}{@render person()}{/snippet}
                        Profile
                    </List.Item>
                    <List.Item>
                        {#snippet leading()}{@render person()}{/snippet}
                        Account
                    </List.Item>
                </List.Root>
            </div>
            <div>
                <p class="demo-cap">Two-line · with trailing</p>
                <List.Root variant="expressive">
                    <List.Item supporting="Last edited 2 days ago">
                        {#snippet leading()}{@render person()}{/snippet}
                        Design spec
                        {#snippet trailing()}<span style="opacity: 0.6">2d</span>{/snippet}
                    </List.Item>
                    <List.Item supporting="Last edited 5 minutes ago">
                        {#snippet leading()}{@render person()}{/snippet}
                        Release notes
                        {#snippet trailing()}<span style="opacity: 0.6">5m</span>{/snippet}
                    </List.Item>
                </List.Root>
            </div>
        </div>
    </section>

    <!-- ── Interactivity ────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Interactivity <span class="demo-hint">— hover & focus the rows</span></h2>
        <div class="demo-grid">
            <div>
                <p class="demo-cap">Link rows (navigate)</p>
                <List.Root variant="expressive">
                    <List.Item href="#one">
                        Documentation
                        {#snippet trailing()}{@render chevron()}{/snippet}
                    </List.Item>
                    <List.Item href="#two">
                        Settings
                        {#snippet trailing()}{@render chevron()}{/snippet}
                    </List.Item>
                </List.Root>
            </div>
            <div>
                <p class="demo-cap">Button rows · clicked: <code>{clicked}</code></p>
                <List.Root variant="expressive">
                    <List.Item onclick={() => (clicked = 'Save')}>Save</List.Item>
                    <List.Item onclick={() => (clicked = 'Share')}>Share</List.Item>
                    <List.Item disabled>Delete (disabled)</List.Item>
                </List.Root>
            </div>
        </div>
    </section>

    <!-- ── Selection — single / multiple, with controls ──────────────── -->
    <section>
        <h2 class="demo-h2">
            Selection <span class="demo-hint">— roving focus (↑/↓, Home/End), Space/Enter to toggle</span>
        </h2>
        <div class="demo-grid">
            <div>
                <p class="demo-cap">Single · radio · <code>{assignee}</code></p>
                <List.Root
                    selection="single"
                    variant="expressive"
                    tint="primary"
                    bind:value={assignee}
                    aria-label="Assignee"
                >
                    <List.Item value="ada">Ada Lovelace</List.Item>
                    <List.Item value="grace">Grace Hopper</List.Item>
                    <List.Item value="alan">Alan Turing</List.Item>
                    <List.Item value="edsger" disabled>Edsger Dijkstra (disabled)</List.Item>
                </List.Root>
            </div>
            <div>
                <p class="demo-cap">Multiple · switch · <code>[{labels.join(', ')}]</code></p>
                <List.Root
                    selection="multiple"
                    control="switch"
                    variant="expressive"
                    tint="secondary"
                    bind:value={labels}
                    aria-label="Labels"
                >
                    <List.Subheader>Status</List.Subheader>
                    <List.Item value="urgent">Urgent</List.Item>
                    <List.Item value="blocked">Blocked</List.Item>
                    <List.Subheader>Area</List.Subheader>
                    <List.Item value="design" supporting="UI & UX">Design</List.Item>
                    <List.Item value="api">API</List.Item>
                </List.Root>
            </div>
            <div>
                <p class="demo-cap">Multiple · checkbox (baseline)</p>
                <List.Root selection="multiple" divider value={['api']} aria-label="Scopes">
                    <List.Item value="read">Read</List.Item>
                    <List.Item value="write">Write</List.Item>
                    <List.Item value="api">API access</List.Item>
                </List.Root>
            </div>
        </div>
    </section>

    <!-- ── Three-line layout ────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">
            Three-line <span class="demo-hint">— supporting block clamps to two wrapped lines</span>
        </h2>
        <div class="demo-grid">
            <List.Root variant="expressive">
                <List.Item
                    lines="three"
                    supporting="A vertical arrangement of related items presented as a continuous, scannable column — the workhorse layout for collections."
                >
                    {#snippet leading()}{@render person()}{/snippet}
                    About lists
                    {#snippet trailing()}{@render chevron()}{/snippet}
                </List.Item>
                <List.Item
                    lines="three"
                    supporting="Each row carries a headline, optional supporting text, and optional leading or trailing decorations or actions."
                >
                    {#snippet leading()}{@render person()}{/snippet}
                    Row anatomy
                </List.Item>
            </List.Root>
        </div>
    </section>

    <!-- ── Subheaders — sticky section labels ───────────────────────── -->
    <section>
        <h2 class="demo-h2">Subheaders <span class="demo-hint">— sticky labels; Expressive rounds each group</span></h2>
        <div class="demo-grid">
            <List.Root variant="expressive" tint="tertiary">
                <List.Subheader sticky>Favourites</List.Subheader>
                <List.Item href="#a">Inbox</List.Item>
                <List.Item href="#b">Starred</List.Item>
                <List.Subheader sticky>Folders</List.Subheader>
                <List.Item href="#c">Work</List.Item>
                <List.Item href="#d">Personal</List.Item>
            </List.Root>
        </div>
    </section>

    <!-- ── Tints — colour the fill, hover/press, and focus ──────────── -->
    <section>
        <h2 class="demo-h2">Tints <span class="demo-hint">— tinted fill at rest; hover or focus to deepen it</span></h2>
        <div class="demo-grid">
            {#each tints as t (t)}
                <div>
                    <p class="demo-cap">{t}</p>
                    <List.Root variant="expressive" tint={t}>
                        <List.Item href="#a">First</List.Item>
                        <List.Item href="#b">Second</List.Item>
                    </List.Root>
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
