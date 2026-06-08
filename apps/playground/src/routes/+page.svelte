<!--
  @smuit/playground
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<script lang="ts">
    import { flagContrast } from '$lib/contrast';
    import { ripple, rippleVariants } from '@smuit/ripple';
    import { TextField } from '@smuit/text-field';

    type PaletteName = 'mono' | 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning' | 'success';

    const palettes: PaletteName[] = ['mono', 'primary', 'secondary', 'tertiary', 'error', 'warning', 'success'];
    const brandSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    const ragSteps = [100, 200, 300, 400, 500, 600, 700, 800, 900];

    function stepsFor(name: PaletteName): number[] {
        return name === 'error' || name === 'warning' || name === 'success' ? ragSteps : brandSteps;
    }

    const descriptions: Record<PaletteName, string> = {
        mono: 'Neutral grayscale — page backgrounds, structural borders, and text at all contrast levels.',
        primary: 'Brand colour — primary actions, navigation active states, and key highlights.',
        secondary: 'Tonal accent — secondary actions, selection chips, and complementary emphasis.',
        tertiary: 'Complementary accent — decorative elements, badges, and contrast pops.',
        error: 'Destructive and invalid states — delete actions, removals, and form validation errors.',
        warning: 'Caution states — potential issues that require user attention before proceeding.',
        success: 'Positive confirmation — task completion, validation passes, and affirmative feedback.',
    };

    // Per-role type ramps (mirrors input.css --type-* config) + the shared
    // 7-step elevation/shadow ramp.
    const typeRamps: { role: string; steps: number }[] = [
        { role: 'display', steps: 3 },
        { role: 'title', steps: 3 },
        { role: 'heading', steps: 5 },
        { role: 'body', steps: 5 },
        { role: 'label', steps: 3 },
        { role: 'code', steps: 3 },
    ];
    const labelSet: Record<number, string[]> = {
        3: ['sm', 'md', 'lg'],
        5: ['xs', 'sm', 'md', 'lg', 'xl'],
        7: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    };
    const elevLabels = labelSet[7];

    let active = $state<PaletteName>('primary');

    // Explicit per-palette flat-theme tokens — --surface-<palette>-<role>.
    let sBg = $derived(`var(--surface-${active}-bg)`);
    let sBgMuted = $derived(`var(--surface-${active}-bg-muted)`);
    let sFg = $derived(`var(--surface-${active}-fg)`);
    let sBorder = $derived(`var(--surface-${active}-border)`);
    let sAccent = $derived(`var(--surface-${active}-accent)`);
    let sSolid = $derived(`var(--surface-${active}-solid)`);
    let sSolidHover = $derived(`var(--surface-${active}-solid-hover)`);
    let sSolidFg = $derived(`var(--surface-${active}-solid-fg)`);

    // ── Contrast QA — identify (don't fix) anything below 5:1 ─────────
    type SurfaceKey = 'hero' | 'default' | 'muted' | 'solid';
    type RatioInfo = { ratio: number; low: boolean };
    const MIN_RATIO = 5;

    let ratios = $state<Record<SurfaceKey, RatioInfo>>({
        hero: { ratio: 0, low: false },
        default: { ratio: 0, low: false },
        muted: { ratio: 0, low: false },
        solid: { ratio: 0, low: false },
    });

    // Guarded so equal values don't loop through reactivity.
    function record(key: SurfaceKey) {
        return (ratio: number, low: boolean) => {
            const cur = ratios[key];
            if (cur.ratio === ratio && cur.low === low) return;
            ratios = { ...ratios, [key]: { ratio, low } };
        };
    }

    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    // ── Demo form state ──────────────────────────────────────────────
    let fName = $state('Ada Lovelace');
    let fEmail = $state('ada@smuit.dev');
    let fRole = $state('engineer');
    let fBio = $state('Mathematician & first programmer.');
    let fPlan = $state<'free' | 'pro' | 'team'>('pro');
    let fNotify = $state(true);
    let fTerms = $state(false);
    let fVolume = $state(60);
    let fDigest = $state(true);
</script>

{#snippet badge(info: RatioInfo)}
    <p
        style="
            margin-top: 0.5rem;
            display: flex;
            gap: 0.4rem;
            align-items: baseline;
            color: var(--page-fg);
            font-size: var(--text-label-sm);
            line-height: var(--text-label-sm--line-height);
            font-variant-numeric: tabular-nums;
        "
    >
        <span style="opacity: 0.55">fg / bg contrast</span>
        <span style="font-weight: 600">{info.ratio.toFixed(2)}:1</span>
        <span
            style="
                margin-left: auto;
                font-weight: 700;
                color: {info.low ? 'var(--color-error-600)' : 'var(--color-success-600)'};
            ">{info.low ? '⚠ LOW (<5)' : 'OK ≥5'}</span
        >
    </p>
{/snippet}

<!-- ── Tab bar ─────────────────────────────────────────────────────── -->
<nav style="border-bottom: 1px solid var(--canvas-border); margin-bottom: 2.5rem">
    <div style="display: flex; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch">
        {#each palettes as p (p)}
            {@const isActive = active === p}
            <button
                onclick={() => {
                    active = p;
                }}
                style="
                    padding: 0.625rem 1.25rem;
                    background: none;
                    border: none;
                    border-bottom: 2px solid {isActive ? `var(--color-${p}-500)` : 'transparent'};
                    cursor: pointer;
                    white-space: nowrap;
                    font-size: var(--text-body-sm);
                    font-weight: 500;
                    color: {isActive ? `var(--color-${p}-500)` : 'var(--page-fg)'};
                    opacity: {isActive ? '1' : '0.5'};
                    transition: opacity 150ms, color 150ms, border-color 150ms;
                    font-family: inherit;
                    margin-bottom: -1px;
                ">{p}</button
            >
        {/each}
    </div>
</nav>

<!-- ── Components index ───────────────────────────────────────────── -->
<nav aria-label="Component demos" style="margin-bottom: 2.5rem">
    <p
        style="color: var(--page-fg); opacity: 0.5; font-size: var(--text-label-sm); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem"
    >
        Components
    </p>
    <a
        href="/text-field"
        style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; border: 1px solid var(--canvas-border); border-radius: 0.5rem; color: var(--page-fg); text-decoration: none; font-size: var(--text-body-sm); font-weight: 500"
        >Text Field <span style="opacity: 0.5">· v1</span></a
    >
</nav>

<!-- ── Content zone — flat-theme tokens ───────────────────────────── -->
<div style="display: flex; flex-direction: column; gap: 2.5rem">
    <!-- ── Hero ───────────────────────────────────────────────────── -->
    <section>
        <div
            use:flagContrast={{ min: MIN_RATIO, onResult: record('hero') }}
            style="
                background: {sBg};
                color: {sFg};
                border: 1px solid {sBorder};
                border-top: 3px solid {sAccent};
                border-radius: 1.25rem;
                padding: 2.5rem;
                box-shadow: var(--shadow-xl);
            "
        >
            <p
                style="
                color: {sAccent};
                text-transform: uppercase;
                letter-spacing: 0.1em;
                font-size: var(--text-label-sm);
                font-weight: 600;
                margin-bottom: 0.75rem;
            "
            >
                @smuit/theme/flat · {active}
            </p>

            <h1
                style="font-size: var(--text-display-sm); line-height: var(--text-display-sm--line-height); font-weight: 700; margin-bottom: 0.75rem"
            >
                {cap(active)} Palette
            </h1>

            <p
                style="font-size: var(--text-body-md); line-height: var(--text-body-md--line-height); opacity: 0.75; max-width: 54ch; margin-bottom: 1.75rem"
            >
                {descriptions[active]}
            </p>

            <div style="display: flex; gap: 0.625rem; flex-wrap: wrap; align-items: center">
                <span
                    style="background: {sSolid}; color: {sSolidFg}; padding: 0.5rem 1.25rem; border-radius: 0.5rem; font-size: var(--text-body-sm); font-weight: 500"
                    >Solid</span
                >
                <span
                    style="background: {sBgMuted}; color: {sFg}; border: 1px solid {sBorder}; padding: 0.5rem 1.25rem; border-radius: 0.5rem; font-size: var(--text-body-sm); font-weight: 500"
                    >Muted</span
                >
                <span
                    style="background: transparent; color: {sFg}; border: 1px solid {sAccent}; padding: 0.5rem 1.25rem; border-radius: 0.5rem; font-size: var(--text-body-sm); font-weight: 500"
                    >Outlined</span
                >
            </div>
        </div>
        {@render badge(ratios.hero)}
    </section>

    <!-- ── Palette ────────────────────────────────────────────────── -->
    <section>
        <h2 style="color: {sFg}; font-size: var(--text-heading-md); font-weight: 600; margin-bottom: 1rem">Palette</h2>
        <div style="display: flex; gap: 0.25rem">
            {#each stepsFor(active) as step (step)}
                <div
                    style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem; flex: 1; min-width: 0"
                >
                    <div
                        style="background: var(--color-{active}-{step}); width: 100%; height: 3.5rem; border-radius: 0.375rem"
                    ></div>
                    <span
                        style="color: {sFg}; opacity: 0.4; font-size: var(--text-label-sm); font-variant-numeric: tabular-nums"
                        >{step}</span
                    >
                </div>
            {/each}
        </div>
    </section>

    <!-- ── Surfaces (each flagged if fg/bg < 5) ──────────────────────── -->
    <section>
        <h2 style="color: {sFg}; font-size: var(--text-heading-md); font-weight: 600; margin-bottom: 1rem">Surfaces</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: 1rem">
            <div>
                <div
                    use:flagContrast={{ min: MIN_RATIO, onResult: record('default') }}
                    style="background: {sBg}; color: {sFg}; border: 1px solid {sBorder}; border-radius: 1rem; padding: 1.5rem; box-shadow: var(--shadow-sm)"
                >
                    <p style="opacity: 0.4; font-size: var(--text-code-sm); margin-bottom: 0.625rem">
                        surface-{active}-bg
                    </p>
                    <p style="font-size: var(--text-title-sm); font-weight: 600; margin-bottom: 0.375rem">Default</p>
                    <p style="opacity: 0.7; font-size: var(--text-body-sm)">
                        Cards, panels, and containers at the primary elevation level.
                    </p>
                </div>
                {@render badge(ratios.default)}
            </div>

            <div>
                <div
                    use:flagContrast={{ min: MIN_RATIO, onResult: record('muted') }}
                    style="background: {sBgMuted}; color: {sFg}; border: 1px solid {sBorder}; border-radius: 1rem; padding: 1.5rem; box-shadow: var(--shadow-sm)"
                >
                    <p style="opacity: 0.4; font-size: var(--text-code-sm); margin-bottom: 0.625rem">
                        surface-{active}-bg-muted
                    </p>
                    <p style="font-size: var(--text-title-sm); font-weight: 600; margin-bottom: 0.375rem">Muted</p>
                    <p style="opacity: 0.7; font-size: var(--text-body-sm)">
                        Hover backgrounds, nested containers, and subtle fill at 80% opacity.
                    </p>
                </div>
                {@render badge(ratios.muted)}
            </div>

            <div>
                <div
                    use:flagContrast={{ min: MIN_RATIO, onResult: record('solid') }}
                    style="background: {sSolid}; color: {sSolidFg}; border-radius: 1rem; padding: 1.5rem; box-shadow: var(--shadow-md)"
                >
                    <p style="opacity: 0.4; font-size: var(--text-code-sm); margin-bottom: 0.625rem">
                        surface-{active}-solid
                    </p>
                    <p style="font-size: var(--text-title-sm); font-weight: 600; margin-bottom: 0.375rem">Solid</p>
                    <p style="opacity: 0.7; font-size: var(--text-body-sm)">
                        High-contrast fill for primary actions, filled chips, and indicators.
                    </p>
                </div>
                {@render badge(ratios.solid)}
            </div>
        </div>
    </section>

    <!-- ── Form (generic controls, painted in the active palette) ──── -->
    <section>
        <h2 style="color: {sFg}; font-size: var(--text-heading-md); font-weight: 600; margin-bottom: 1rem">
            Form Controls
        </h2>
        <form
            class="form-card"
            onsubmit={(e) => e.preventDefault()}
            style="
                --fa: {sAccent}; --fg: {sFg}; --bd: {sBorder}; --muted: {sBgMuted};
                --solid: {sSolid}; --solid-hover: {sSolidHover}; --solid-fg: {sSolidFg};
                --tf-notch-bg: {sBg};
                background: {sBg};
                border: 1px solid {sBorder};
                border-radius: 1rem;
                padding: 1.5rem;
                box-shadow: var(--shadow-sm);
            "
        >
            <div class="grid2">
                <TextField label="Full name" placeholder="Jane Doe" bind:value={fName} fullWidth elevation />
                <TextField label="Email" placeholder="you@example.com" bind:value={fEmail} fullWidth elevation />
            </div>

            <label class="field">
                <span class="lbl">Role</span>
                <select class="form-control" bind:value={fRole}>
                    <option value="engineer">Engineer</option>
                    <option value="designer">Designer</option>
                    <option value="manager">Manager</option>
                    <option value="other">Other</option>
                </select>
            </label>

            <label class="field">
                <span class="lbl">Bio</span>
                <textarea
                    class="form-control"
                    rows="3"
                    bind:value={fBio}
                    placeholder="A few words about you…"
                    style="resize: vertical"
                ></textarea>
            </label>

            <fieldset class="field" style="border: none; padding: 0; margin: 0">
                <span class="lbl">Plan</span>
                <div class="row">
                    {#each ['free', 'pro', 'team'] as plan (plan)}
                        <label class="choice">
                            <input type="radio" name="plan" value={plan} bind:group={fPlan} />
                            {cap(plan)}
                        </label>
                    {/each}
                </div>
            </fieldset>

            <label class="field">
                <span class="lbl">Volume · {fVolume}%</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    bind:value={fVolume}
                    style="width: 100%; accent-color: var(--fa)"
                />
            </label>

            <div class="row" style="gap: 1.25rem; flex-wrap: wrap">
                <label class="choice"><input type="checkbox" bind:checked={fNotify} /> Email notifications</label>
                <label class="choice">
                    <span class="switch">
                        <input type="checkbox" bind:checked={fDigest} />
                        <span class="track"></span>
                        <span class="thumb"></span>
                    </span>
                    Weekly digest
                </label>
            </div>

            <label class="choice"
                ><input type="checkbox" bind:checked={fTerms} /> I accept the terms &amp; conditions</label
            >

            <div class="row" style="justify-content: flex-end; gap: 0.75rem; margin-top: 0.25rem">
                <button type="reset" class="btn btn-outline" use:ripple={{ variant: 'md' }}>Cancel</button>
                <button type="submit" class="btn btn-solid" disabled={!fTerms} use:ripple={{ variant: 'md' }}
                    >Create account</button
                >
            </div>
        </form>
    </section>

    <!-- ── Ripple (@smuit/ripple) — 5 variants ────────────────────── -->
    <section>
        <h2 style="color: {sFg}; font-size: var(--text-heading-md); font-weight: 600; margin-bottom: 0.25rem">
            Ripple · @smuit/ripple
        </h2>
        <p style="color: {sFg}; opacity: 0.6; font-size: var(--text-body-sm); margin-bottom: 1rem">
            MUI-style touch ripple — click each button. Variant sets the expansion duration.
        </p>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap">
            {#each rippleVariants as v (v)}
                <button
                    use:ripple={{ variant: v }}
                    style="
                        padding: 0.7rem 1.4rem;
                        border: none;
                        border-radius: 0.5rem;
                        background: {sSolid};
                        color: {sSolidFg};
                        font: inherit;
                        font-size: var(--text-body-sm);
                        font-weight: 600;
                        cursor: pointer;
                        box-shadow: var(--shadow-sm);
                    ">{v}</button
                >
            {/each}
        </div>
    </section>

    <!-- ── Type ramps (per role) ──────────────────────────────────── -->
    <section>
        <h2 style="color: {sFg}; font-size: var(--text-heading-md); font-weight: 600; margin-bottom: 1rem">
            Type Ramps · font-sans
        </h2>
        <div style="display: flex; flex-direction: column; gap: 1.75rem">
            {#each typeRamps as ramp (ramp.role)}
                <div>
                    <p
                        style="color: {sFg}; opacity: 0.5; font-size: var(--text-label-sm); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem"
                    >
                        {ramp.role} · {ramp.steps}-step
                    </p>
                    <div style="border: 1px solid {sBorder}; border-radius: 1rem; overflow: hidden">
                        {#each labelSet[ramp.steps] as label, i (label)}
                            <div
                                style="
                                display: flex; align-items: baseline; gap: 2rem; padding: 0.75rem 1.5rem;
                                background: {sBg};
                                {i > 0 ? `border-top: 1px solid ${sBorder};` : ''}
                            "
                            >
                                <code
                                    style="min-width: 11rem; flex-shrink: 0; color: {sFg}; opacity: 0.5; font-size: var(--text-code-sm)"
                                    >--text-{ramp.role}-{label}</code
                                >
                                <p
                                    style="color: {sFg}; font-size: var(--text-{ramp.role}-{label}); line-height: var(--text-{ramp.role}-{label}--line-height); white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                                >
                                    The quick brown fox
                                </p>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- ── Elevation + shadow ramp (7-step) ───────────────────────── -->
    <section>
        <h2 style="color: {sFg}; font-size: var(--text-heading-md); font-weight: 600; margin-bottom: 1rem">
            Elevation &amp; Shadow Ramp · 7-step
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr)); gap: 1.5rem">
            {#each elevLabels as label (label)}
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem">
                    <div
                        style="
                        width: 100%; height: 5rem; border-radius: 0.75rem;
                        background: var(--surface-{active}-bg);
                        border: 1px solid var(--surface-{active}-border);
                        box-shadow: var(--shadow-{label});
                    "
                    ></div>
                    <div style="text-align: center">
                        <code style="color: {sFg}; font-size: var(--text-code-sm); opacity: 0.75">shadow-{label}</code>
                        <p
                            style="color: {sFg}; opacity: 0.4; font-size: var(--text-label-sm); font-variant-numeric: tabular-nums"
                        >
                            elev {label}
                        </p>
                    </div>
                </div>
            {/each}
        </div>
    </section>
</div>

<style>
    /* Form controls — colours come from CSS vars set on .form-card inline
       (--fa accent, --fg text, --bd border, --solid / --solid-hover / --solid-fg),
       so the whole form repaints when the active palette changes. */
    .form-card {
        display: flex;
        flex-direction: column;
        gap: 1.1rem;
        color: var(--fg);
    }
    .grid2 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
        gap: 1.1rem;
    }
    .field {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        min-width: 0;
    }
    .lbl {
        font-size: var(--text-label-sm);
        font-weight: 600;
        opacity: 0.8;
    }
    .row {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .form-control {
        width: 100%;
        box-sizing: border-box;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--bd);
        border-radius: 0.5rem;
        background: var(--muted);
        color: var(--fg);
        font: inherit;
        font-size: var(--text-body-sm);
        transition:
            border-color 120ms,
            box-shadow 120ms;
    }
    .form-control:focus {
        outline: none;
        border-color: var(--fa);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--fa) 22%, transparent);
    }

    .choice {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: var(--text-body-sm);
        cursor: pointer;
    }
    .choice input[type='checkbox'],
    .choice input[type='radio'] {
        width: 1.05rem;
        height: 1.05rem;
        accent-color: var(--fa);
        cursor: pointer;
    }

    /* Switch — track turns the solid colour when on */
    .switch {
        position: relative;
        display: inline-block;
        width: 2.6rem;
        height: 1.5rem;
        flex-shrink: 0;
    }
    .switch input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        opacity: 0;
        cursor: pointer;
    }
    .switch .track {
        position: absolute;
        inset: 0;
        border-radius: 999px;
        background: var(--bd);
        transition: background 150ms;
    }
    .switch .thumb {
        position: absolute;
        top: 0.18rem;
        left: 0.18rem;
        width: 1.14rem;
        height: 1.14rem;
        border-radius: 50%;
        background: var(--page-bg);
        box-shadow: 0 1px 2px oklch(0 0 0 / 0.3);
        transition: transform 150ms;
    }
    .switch input:checked ~ .track {
        background: var(--solid);
    }
    .switch input:checked ~ .thumb {
        transform: translateX(1.1rem);
    }
    .switch input:focus-visible ~ .track {
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--fa) 22%, transparent);
    }

    /* Buttons */
    .btn {
        padding: 0.55rem 1.15rem;
        border-radius: 0.5rem;
        font: inherit;
        font-size: var(--text-body-sm);
        font-weight: 600;
        cursor: pointer;
        transition:
            background 120ms,
            border-color 120ms,
            opacity 120ms;
    }
    .btn-solid {
        background: var(--solid);
        color: var(--solid-fg);
        border: 1px solid var(--solid);
    }
    .btn-solid:hover {
        background: var(--solid-hover);
        border-color: var(--solid-hover);
    }
    .btn-solid:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }
    .btn-outline {
        background: transparent;
        color: var(--fa);
        border: 1px solid var(--fa);
    }
    .btn-outline:hover {
        background: color-mix(in srgb, var(--fa) 10%, transparent);
    }
</style>
