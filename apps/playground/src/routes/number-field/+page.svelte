<!--
  @smuit/playground
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<script lang="ts">
    import { NumberField } from '@smuit/text-field';

    let qty = $state<number | null>(1234);
    let price = $state<number | null>(1999.95);
    let grouped = $state<number | null>(1234567);
    let de = $state<number | null>(1234567.5);
    let age = $state<number | null>(null);
    let hex = $state<number | null>(null);
    let bin = $state<number | null>(null);

    // Pretend server check: reject a specific "taken" account number.
    async function checkAccount(value: number | null): Promise<string | null> {
        await new Promise((r) => setTimeout(r, 600));
        return value === 12345 ? 'That account number is already taken.' : null;
    }
</script>

<div style="display: flex; flex-direction: column; gap: 2.5rem; max-width: 52rem">
    <header>
        <h1 style="font-size: var(--text-display-sm); font-weight: 700; color: var(--page-fg)">Number Field</h1>
        <p style="color: var(--page-fg); opacity: 0.7; font-size: var(--text-body-md); margin-top: 0.5rem">
            <code>@smuit/text-field</code> · <code>NumberField</code> — a numeric field on the text-field foundation.
            Masks to a numeric alphabet (decimal, or hex/binary via a <code>0x</code>/<code>0b</code> prefix), binds a
            parsed <code>number | null</code>, right-aligns by default, and validates <code>min</code>/<code>max</code> plus
            an async server callback on blur. Thousands grouping is opt-in and locale-aware.
        </p>
    </header>

    <!-- ── Basics ───────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Basics <span class="demo-hint">— digits only, right-aligned</span></h2>
        <div class="demo-grid">
            <NumberField label="Quantity" bind:value={qty} supportingText="Whole numbers only." />
            <NumberField label="Population" placeholder="0" supportingText="No grouping by default." />
        </div>
        <p class="demo-readout">Bound value: <code>{qty === null ? 'null' : qty}</code> ({typeof qty})</p>
    </section>

    <!-- ── Decimals ─────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Decimals <span class="demo-hint">— <code>decimalAllowed</code>, accuracy 2</span></h2>
        <div class="demo-grid">
            <NumberField
                label="Price"
                prefix="$"
                decimalAllowed
                decimalAccuracy={2}
                bind:value={price}
                supportingText="Up to two decimal places."
            />
            <NumberField label="Rate" suffix="%" decimalAllowed supportingText="Default accuracy is 4 places." />
        </div>
        <p class="demo-readout">Bound value: <code>{price === null ? 'null' : price}</code></p>
    </section>

    <!-- ── Grouping + locale ────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">
            Grouping &amp; locale <span class="demo-hint">— opt-in, separator from the locale</span>
        </h2>
        <div class="demo-grid">
            <NumberField label="Grouped (en-US)" grouping bind:value={grouped} supportingText="1,234,567" />
            <NumberField
                label="Betrag (de-DE)"
                grouping
                decimalAllowed
                locale="de-DE"
                bind:value={de}
                supportingText="'.' groups · ',' decimal"
            />
        </div>
    </section>

    <!-- ── Alignment ────────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Alignment <span class="demo-hint">— default right; opt into left</span></h2>
        <div class="demo-grid">
            <NumberField label="Right (default)" value={42} />
            <NumberField label="Left" align="left" value={42} />
        </div>
    </section>

    <!-- ── Hex / binary ─────────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Hex &amp; binary <span class="demo-hint">— lead with 0x or 0b</span></h2>
        <div class="demo-grid">
            <NumberField label="Address" align="left" bind:value={hex} supportingText="Type 0xff → 255" />
            <NumberField label="Bit mask" align="left" bind:value={bin} supportingText="Type 0b101 → 5" />
        </div>
        <p class="demo-readout">
            hex → <code>{hex === null ? 'null' : hex}</code> · binary → <code>{bin === null ? 'null' : bin}</code>
        </p>
    </section>

    <!-- ── Validation (on blur) ─────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Validation <span class="demo-hint">— min/max + async server check on blur</span></h2>
        <div class="demo-grid">
            <NumberField label="Age" min={18} max={120} bind:value={age} supportingText="Must be 18–120." />
            <NumberField
                label="Account number"
                align="left"
                validate={checkAccount}
                supportingText="Try 12345 — checked on blur."
            />
        </div>
    </section>

    <!-- ── Variants · sizes ─────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Variants &amp; sizes</h2>
        <div class="demo-grid">
            <NumberField label="Outlined" />
            <NumberField label="Filled" variant="filled" />
            <NumberField label="Small" size="sm" />
            <NumberField label="Disabled" value={42} disabled />
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
