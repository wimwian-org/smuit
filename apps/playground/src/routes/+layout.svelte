<!--
  @wimwian-org/playground
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<script lang="ts">
    import '../app.css';
    import { page } from '$app/state';

    let { children } = $props();

    let seg = $derived(page.url.pathname.replace(/^\//, ''));
    let pageLabel = $derived(seg ? seg : '');

    type Theme = 'light' | 'dark';
    let theme = $state<Theme>('light');

    function setTheme(t: Theme) {
        theme = t;
        document.documentElement.dataset.theme = t;
    }

    function toggleTheme() {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }
</script>

<div class="min-h-screen" style="background: var(--page-bg); color: var(--page-fg)">
    <header
        style="background: var(--canvas-bg); border-bottom: 1px solid var(--canvas-border)"
        class="sticky top-0 z-10 px-6 py-3"
    >
        <div class="mx-auto flex max-w-7xl items-center justify-between">
            <span style="color: var(--page-fg); font-size: var(--text-title-sm); font-weight: 700">
                <a href="/" style="text-decoration: none" aria-label="smuit home"
                    ><span style="color: #ff3e00">s</span><span style="color: #673ab7">mui</span><span
                        style="color: #10b981">t</span
                    ></a
                >
                {#if pageLabel}
                    <span style="opacity: 0.35; color: var(--page-fg)"> / </span>{pageLabel}
                {/if}
            </span>

            <!-- Theme toggle — single contrast-colour icon -->
            <button
                onclick={toggleTheme}
                aria-label="Toggle light / dark theme"
                aria-pressed={theme === 'dark'}
                title="Toggle theme"
                style="
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 2.25rem;
                    height: 2.25rem;
                    padding: 0;
                    border: 1px solid var(--surface-border);
                    border-radius: 0.5rem;
                    background: var(--surface-bg);
                    color: var(--page-fg);
                    cursor: pointer;
                    transition: background 150ms, border-color 150ms, color 150ms;
                "
            >
                {#if theme === 'light'}
                    <!-- sun -->
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="12" r="4" />
                        <path
                            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                        />
                    </svg>
                {:else}
                    <!-- moon -->
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                    </svg>
                {/if}
            </button>
        </div>
    </header>

    <main class="mx-auto max-w-7xl px-6 py-8">
        {@render children()}
    </main>
</div>
