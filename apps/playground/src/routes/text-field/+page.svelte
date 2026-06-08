<!--
  @smuit/playground
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<script lang="ts">
    import { TextField, TextArea, Field } from '@smuit/text-field';

    let bound = $state('Ada Lovelace');
    let counted = $state('Hello');
    let composed = $state('');
    let bio = $state('Mathematician & first programmer.');

    const tints = ['neutral', 'primary', 'secondary', 'tertiary'] as const;
</script>

{#snippet search()}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" stroke-linecap="round" />
    </svg>
{/snippet}

<div style="display: flex; flex-direction: column; gap: 2.5rem; max-width: 52rem">
    <header>
        <h1 style="font-size: var(--text-display-sm); font-weight: 700; color: var(--page-fg)">Text Field</h1>
        <p style="color: var(--page-fg); opacity: 0.7; font-size: var(--text-body-md); margin-top: 0.5rem">
            <code>@smuit/text-field</code> · v1 (MVP) — filled · outlined, floating label, prefix/suffix + icons, and a character
            counter. Validation, multiline, and alternate input types are deferred.
        </p>
    </header>

    <!-- ── Variants ─────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Variants</h2>
        <div class="demo-grid">
            <TextField label="Outlined" supportingText="Default treatment." />
            <TextField label="Filled" variant="filled" supportingText="Tonal-fill treatment." />
        </div>
    </section>

    <!-- ── Sizes ────────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Sizes</h2>
        <div class="demo-grid">
            <TextField label="Small" size="sm" />
            <TextField label="Medium" size="md" />
            <TextField label="Small · filled" variant="filled" size="sm" />
            <TextField label="Medium · filled" variant="filled" size="md" />
        </div>
    </section>

    <!-- ── Tints (focus a field to see the accent) ──────────────────── -->
    <section>
        <h2 class="demo-h2">Tints <span class="demo-hint">— focus a field to see the accent</span></h2>
        <div class="demo-grid">
            {#each tints as t (t)}
                <TextField label={t[0].toUpperCase() + t.slice(1)} tint={t} value="Focus me" />
            {/each}
        </div>
    </section>

    <!-- ── Decorations ──────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Decorations</h2>
        <div class="demo-grid">
            <TextField label="Amount" prefix="$" suffix=".00" supportingText="Prefix & suffix reveal on focus." />
            <TextField label="Search" variant="filled">
                {#snippet leadingIcon()}{@render search()}{/snippet}
            </TextField>
            <TextField label="Password-style action">
                {#snippet trailingIcon()}
                    <button type="button" aria-label="Toggle">👁</button>
                {/snippet}
            </TextField>
            <TextField label="Bio" maxlength={30} bind:value={counted} supportingText="Counter with a soft cap." />
        </div>
    </section>

    <!-- ── States ───────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">States</h2>
        <div class="demo-grid">
            <TextField label="Enabled" placeholder="Type here…" />
            <TextField label="Read-only" value="Read-only value" readonly />
            <TextField label="Disabled" value="Disabled value" disabled />
            <TextField label="Hidden label" hideLabel placeholder="Label is hidden but announced" />
        </div>
        <div style="margin-top: 1rem">
            <TextField label="Full width" fullWidth supportingText="Stretches to fill the container." />
        </div>
    </section>

    <!-- ── Elevation ────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Elevation <span class="demo-hint">— focus to lift &amp; deepen the shadow</span></h2>
        <div class="demo-grid">
            <TextField label="Outlined" elevation />
            <TextField label="Filled" variant="filled" elevation />
        </div>
    </section>

    <!-- ── Validation & error ───────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Validation &amp; error</h2>
        <div class="demo-grid">
            <TextField label="Required" required supportingText="We need this one." />
            <TextField label="Outlined error" error errorText="Enter a valid value." value="nope" />
            <TextField label="Filled error" variant="filled" error errorText="Invalid value." value="x" />
            <TextField label="No asterisk" required noAsterisk supportingText="Required, glyph suppressed." />
        </div>
    </section>

    <!-- ── TextArea (multiline) ─────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">TextArea <span class="demo-hint">— multiline sibling, same parts</span></h2>
        <div class="demo-grid">
            <TextArea label="Bio" bind:value={bio} rows={3} maxlength={160} supportingText="A few words about you." />
            <TextArea label="Notes (filled)" variant="filled" rows={3} placeholder="Type a few lines…" />
        </div>
        <div style="margin-top: 1rem">
            <TextArea label="Autosize" autosize rows={2} fullWidth placeholder="Grows as you type…" />
        </div>
    </section>

    <!-- ── Composition (Field.* parts) ──────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Composition <span class="demo-hint">— built from the Field.* parts directly</span></h2>
        <Field.Root bind:value={composed} variant="filled" maxlength={120} fullWidth>
            <Field.Box>
                <Field.Label>Message</Field.Label>
                <Field.Adornment side="leading">{@render search()}</Field.Adornment>
                <Field.Input placeholder="Compose with Field.Root / Box / Label / Adornment / Input…" />
            </Field.Box>
            <Field.Caption>
                <Field.Supporting>Same parts that back &lt;TextField&gt;.</Field.Supporting>
                <Field.Counter />
            </Field.Caption>
        </Field.Root>
    </section>

    <!-- ── Controlled ───────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Controlled value</h2>
        <TextField label="Name" bind:value={bound} fullWidth />
        <p style="color: var(--page-fg); opacity: 0.7; font-size: var(--text-body-sm); margin-top: 0.5rem">
            Bound value: <code>{bound}</code>
        </p>
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
    .demo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
        gap: 1.5rem 1.25rem;
        align-items: start;
    }
</style>
