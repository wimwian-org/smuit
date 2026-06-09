<!--
  @smuit/playground
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<script lang="ts">
    import { PasswordField } from '@smuit/text-field';

    let pw = $state('hunter2');
    let confirm = $state('');
</script>

<div style="display: flex; flex-direction: column; gap: 2.5rem; max-width: 52rem">
    <header>
        <h1 style="font-size: var(--text-display-sm); font-weight: 700; color: var(--page-fg)">Password Field</h1>
        <p style="color: var(--page-fg); opacity: 0.7; font-size: var(--text-body-md); margin-top: 0.5rem">
            <code>@smuit/text-field</code> · <code>PasswordField</code> — a masked
            <code>type="password"</code> field on the text-field foundation. Ships a built-in show/hide reveal toggle in
            the trailing slot and defaults <code>autocomplete</code> to <code>current-password</code>. Set
            <code>revealable={false}</code> to drop the toggle.
        </p>
    </header>

    <!-- ── Basics ───────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Basics <span class="demo-hint">— click the eye to reveal</span></h2>
        <div class="demo-grid">
            <PasswordField label="Password" bind:value={pw} supportingText="Click the eye to reveal." />
            <PasswordField
                label="New password"
                autocomplete="new-password"
                placeholder="••••••••"
                supportingText="autocomplete = new-password."
            />
        </div>
        <p class="demo-readout">Bound value: <code>{pw || '(empty)'}</code></p>
    </section>

    <!-- ── No toggle ────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Without the toggle <span class="demo-hint">— <code>revealable={false}</code></span></h2>
        <div class="demo-grid">
            <PasswordField
                label="One-time code"
                revealable={false}
                autocomplete="one-time-code"
                supportingText="No reveal affordance."
            />
            <PasswordField label="Confirm password" bind:value={confirm} revealable={false} />
        </div>
    </section>

    <!-- ── Variants · sizes · states ────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Variants, sizes &amp; states</h2>
        <div class="demo-grid">
            <PasswordField label="Outlined" value="secret123" />
            <PasswordField label="Filled" variant="filled" value="secret123" />
            <PasswordField label="Small" size="sm" value="secret123" />
            <PasswordField label="Disabled" value="secret123" disabled />
            <PasswordField label="Error" value="123" error errorText="Too short — use 8+ characters." />
            <PasswordField label="Required" required value="secret123" />
        </div>
    </section>
</div>

<style>
    .demo-h2 {
        font-size: var(--text-title-sm);
        font-weight: 600;
        color: var(--page-fg);
        margin-bottom: 1rem;
    }
    .demo-hint {
        font-weight: 400;
        opacity: 0.55;
        font-size: var(--text-body-sm);
    }
    .demo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
        gap: 1.5rem;
    }
    .demo-readout {
        margin-top: 0.75rem;
        font-size: var(--text-body-sm);
        color: var(--page-fg);
        opacity: 0.7;
    }
</style>
