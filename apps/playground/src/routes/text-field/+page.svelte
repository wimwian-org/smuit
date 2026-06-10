<!--
  @wimwian-org/playground
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<script lang="ts">
    import { TextField, TextArea, Field } from '@wimwian-org/text-field';

    let bound = $state('Ada Lovelace');
    let counted = $state('Hello');
    let composed = $state('');
    let adorned = $state('1234567890.00 — long value to demonstrate horizontal scroll');
    let bio = $state('Mathematician & first programmer.');
    let fruit = $state('');
    const fruits = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Date', 'Fig', 'Grape'];

    const tints = ['neutral', 'primary', 'secondary', 'tertiary'] as const;

    // Variant-comparison table: each use case rendered as outlined · filled · standard.
    const cmpVariants = [undefined, 'filled', 'standard'] as const;
    const sizes = ['sm', 'md'] as const;
    // A supporting string long enough to wrap onto a second line beside the counter.
    const twoLineSupport =
        'Guidance that runs long enough to wrap onto a second line, shown beside the live character counter.';
    type CmpCase = {
        uc: string;
        label: string;
        value?: string;
        placeholder?: string;
        hideLabel?: boolean;
        required?: boolean;
        error?: boolean;
        disabled?: boolean;
    };
    const cmpCases: CmpCase[] = [
        { uc: 'Resting label', label: 'Label' },
        { uc: 'With value', label: 'Label', value: 'Jane Doe' },
        { uc: 'Placeholder', label: 'Label', hideLabel: true, placeholder: 'Type here…' },
        { uc: 'Required', label: 'Label', required: true },
        { uc: 'Error', label: 'Label', value: 'nope', error: true },
        { uc: 'Disabled', label: 'Label', value: 'Value', disabled: true },
    ];
    type CmpMl = { uc: string; label: string; value?: string; disabled?: boolean };
    const cmpMlCases: CmpMl[] = [
        { uc: 'Resting label', label: 'Notes' },
        { uc: 'With value', label: 'Notes', value: 'Line one\nLine two' },
        { uc: 'Disabled', label: 'Notes', value: 'Locked content', disabled: true },
    ];
</script>

{#snippet search()}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" stroke-linecap="round" />
    </svg>
{/snippet}

{#snippet card()}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" stroke-linecap="round" />
    </svg>
{/snippet}

<div style="display: flex; flex-direction: column; gap: 2.5rem; max-width: 52rem">
    <header>
        <h1 style="font-size: var(--text-display-sm); font-weight: 700; color: var(--page-fg)">Text Field</h1>
        <p style="color: var(--page-fg); opacity: 0.7; font-size: var(--text-body-md); margin-top: 0.5rem">
            <code>@wimwian-org/text-field</code> · v1 (MVP) — filled · outlined, floating label, prefix/suffix + icons, and
            a character counter. Validation, multiline, and alternate input types are deferred.
        </p>
    </header>

    <!-- ── Variants ─────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Variants</h2>
        <div class="demo-grid">
            <TextField label="Outlined" supportingText="Default treatment." />
            <TextField label="Filled" variant="filled" supportingText="Tonal-fill treatment." />
            <TextField label="Standard" variant="standard" supportingText="Legacy underline." />
        </div>
    </section>

    <!-- ── Variant comparison (use case × variant, underlines aligned) ── -->
    <section>
        <h2 class="demo-h2">Variant comparison <span class="demo-hint">— underlines aligned per row</span></h2>
        <div class="cmp">
            <span class="cmp-head">Use case</span>
            <span class="cmp-head">Outlined</span>
            <span class="cmp-head">Filled</span>
            <span class="cmp-head">Standard</span>
            {#each cmpCases as c (c.uc)}
                <span class="cmp-uc">{c.uc}</span>
                {#each cmpVariants as v (v ?? 'outlined')}
                    <TextField
                        label={c.label}
                        value={c.value}
                        placeholder={c.placeholder}
                        hideLabel={c.hideLabel}
                        required={c.required}
                        error={c.error}
                        disabled={c.disabled}
                        variant={v}
                        fullWidth
                    />
                {/each}
            {/each}
            <span class="cmp-uc">Leading icon</span>
            {#each cmpVariants as v (v ?? 'outlined')}
                <TextField label="Label" variant={v} fullWidth>
                    {#snippet leadingIcon()}{@render search()}{/snippet}
                </TextField>
            {/each}
        </div>

        <h3 class="cmp-sub">Multiline</h3>
        <div class="cmp">
            <span class="cmp-head">Use case</span>
            <span class="cmp-head">Outlined</span>
            <span class="cmp-head">Filled</span>
            <span class="cmp-head">Standard</span>
            {#each cmpMlCases as c (c.uc)}
                <span class="cmp-uc">{c.uc}</span>
                {#each cmpVariants as v (v ?? 'outlined')}
                    <TextArea label={c.label} value={c.value} disabled={c.disabled} rows={3} variant={v} fullWidth />
                {/each}
            {/each}
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
            <TextField label="Search" variant="filled" supportingText="Leading icon.">
                {#snippet leadingIcon()}{@render search()}{/snippet}
            </TextField>
            <TextField label="Password-style action" supportingText="Trailing action.">
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

    <!-- ── Autosuggest ──────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">
            Autosuggest <span class="demo-hint">— focus to open · ↑ ↓ navigate · Enter pick · Esc close</span>
        </h2>
        <div class="demo-grid">
            <TextField
                label="Fruit"
                bind:value={fruit}
                suggestions={fruits}
                supportingText="Choose from the short list."
            />
        </div>
    </section>

    <!-- ── TextArea (multiline) ─────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">TextArea <span class="demo-hint">— multiline sibling, same parts</span></h2>
        <div class="demo-grid">
            <TextArea label="Bio" bind:value={bio} rows={3} maxlength={160} supportingText="A few words about you." />
            <TextArea
                label="Notes (filled)"
                variant="filled"
                rows={3}
                placeholder="Type a few lines…"
                supportingText="Filled, resizable."
            />
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
                <Field.Line>
                    <Field.Adornment side="leading">{@render search()}</Field.Adornment>
                    <Field.Input placeholder="Compose with Field.Root / Box / Label / Line / Adornment / Input…" />
                </Field.Line>
            </Field.Box>
            <Field.Caption>
                <Field.Supporting>Same parts that back &lt;TextField&gt;.</Field.Supporting>
                <Field.Counter />
            </Field.Caption>
        </Field.Root>
    </section>

    <!-- ── Full adornment row (no wrap · input scrolls) ─────────────── -->
    <section>
        <h2 class="demo-h2">
            Full adornment row <span class="demo-hint">— svg · text · input · text · svg, no wrap</span>
        </h2>
        <Field.Root bind:value={adorned} variant="outlined" fullWidth>
            <Field.Box>
                <Field.Label>Amount</Field.Label>
                <Field.Line>
                    <Field.Adornment side="leading">{@render card()}</Field.Adornment>
                    <Field.Adornment side="prefix">$</Field.Adornment>
                    <Field.Input />
                    <Field.Adornment side="suffix">USD</Field.Adornment>
                    <Field.Adornment side="trailing">{@render search()}</Field.Adornment>
                </Field.Line>
            </Field.Box>
            <Field.Caption>
                <Field.Supporting>The five slots stay on one line; the input scrolls its text.</Field.Supporting>
            </Field.Caption>
        </Field.Root>
    </section>

    <!-- ── Fully populated (every slot) × size × variant ────────────── -->
    <section>
        <h2 class="demo-h2">
            Fully populated
            <span class="demo-hint"
                >— leading/trailing icons + prefix/suffix, 2-line support text & counter, per size × variant</span
            >
        </h2>
        <div class="cmp">
            <span class="cmp-head">Size</span>
            <span class="cmp-head">Outlined</span>
            <span class="cmp-head">Filled</span>
            <span class="cmp-head">Standard</span>
            {#each sizes as s (s)}
                <span class="cmp-uc">{s}</span>
                {#each cmpVariants as v (v ?? 'outlined')}
                    <TextField
                        label="Amount"
                        variant={v}
                        size={s}
                        value="1250.00"
                        prefix="$"
                        suffix="USD"
                        maxlength={40}
                        supportingText={twoLineSupport}
                    >
                        {#snippet leadingIcon()}{@render card()}{/snippet}
                        {#snippet trailingIcon()}{@render search()}{/snippet}
                    </TextField>
                {/each}
            {/each}
        </div>
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
        /* Line fields up by the bottom of the field box (the underline), so rows
           with mixed box heights (sm/md) align on the indicator, not the top.
           Keep each row's supporting-text presence uniform so the box bottoms
           coincide with the underlines. */
        align-items: end;
    }
    .cmp {
        display: grid;
        grid-template-columns: minmax(7rem, 0.7fr) repeat(3, 1fr);
        gap: 1.75rem 1.25rem;
        /* Bottom-align every cell so the three variants' underlines line up
           across each row (filled is 8px taller, so top-align would stagger them). */
        align-items: end;
    }
    .cmp-head {
        color: var(--page-fg);
        font-size: var(--text-label-sm);
        font-weight: 600;
        opacity: 0.55;
    }
    .cmp-uc {
        color: var(--page-fg);
        font-size: var(--text-body-sm);
        opacity: 0.8;
    }
    .cmp-sub {
        color: var(--page-fg);
        font-size: var(--text-heading-sm);
        font-weight: 600;
        margin: 2rem 0 1rem;
    }
</style>
