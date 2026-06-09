<!--
  @wimwian-org/playground
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<script lang="ts">
    import { MaskedField } from '@wimwian-org/text-field';

    let phone = $state('');
    let phoneRaw = $state('');
    let card = $state('');
    let expiry = $state('');
    let plate = $state('');
</script>

<div style="display: flex; flex-direction: column; gap: 2.5rem; max-width: 52rem">
    <header>
        <h1 style="font-size: var(--text-display-sm); font-weight: 700; color: var(--page-fg)">Masked Field</h1>
        <p style="color: var(--page-fg); opacity: 0.7; font-size: var(--text-body-md); margin-top: 0.5rem">
            <code>@wimwian-org/text-field</code> · <code>MaskedField</code> — a pattern-masked field on the text-field
            foundation. A <code>mask</code> template formats the value as you type and binds the formatted
            <code>value</code> plus, optionally, the raw <code>unmasked</code> characters. Tokens:
            <code>#</code> digit · <code>A</code> letter · <code>*</code> alphanumeric ·
            <code>\</code> escapes a token · everything else is a literal separator.
        </p>
    </header>

    <!-- ── Phone (value + unmasked) ─────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">
            Phone <span class="demo-hint">— <code>(###) ###-####</code>, with <code>unmasked</code></span>
        </h2>
        <div class="demo-grid">
            <MaskedField
                label="Phone"
                mask="(###) ###-####"
                bind:value={phone}
                bind:unmasked={phoneRaw}
                placeholder="(555) 123-4567"
                supportingText="Digits only; separators are inserted."
            />
        </div>
        <p class="demo-readout">
            value: <code>{phone || '(empty)'}</code> · unmasked: <code>{phoneRaw || '(empty)'}</code>
        </p>
    </section>

    <!-- ── Credit card · expiry ─────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Card &amp; expiry <span class="demo-hint">— grouped digits</span></h2>
        <div class="demo-grid">
            <MaskedField label="Card number" mask="#### #### #### ####" bind:value={card} prefix="💳" />
            <MaskedField label="Expiry" mask="##/##" bind:value={expiry} placeholder="MM/YY" />
        </div>
    </section>

    <!-- ── Letters + alnum ──────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">
            Letters &amp; alphanumeric <span class="demo-hint">— <code>A</code> and <code>#</code> tokens</span>
        </h2>
        <div class="demo-grid">
            <MaskedField label="Plate" mask="AA-####" bind:value={plate} supportingText="Two letters, four digits." />
            <MaskedField label="Postcode (UK)" mask="A#* #AA" supportingText="Mixed alphanumeric." />
        </div>
    </section>

    <!-- ── Variants · sizes ─────────────────────────────────────────── -->
    <section>
        <h2 class="demo-h2">Variants &amp; sizes</h2>
        <div class="demo-grid">
            <MaskedField label="Outlined" mask="###-###" />
            <MaskedField label="Filled" variant="filled" mask="###-###" />
            <MaskedField label="Small" size="sm" mask="###-###" />
            <MaskedField label="Disabled" mask="###-###" value="123456" disabled />
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
