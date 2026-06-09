/*
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { playwright } from '@vitest/browser-playwright';

// Browser-mode config: renders real Svelte components in Playwright.
// Run with: pnpm test:browser
// Excludes *.variants.test.ts — those are pure-TS and run in the faster node config.
export default defineConfig({
    plugins: [tailwindcss(), svelte()],
    test: {
        name: 'browser',
        browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            // Single instance: @vitest/coverage-v8 only supports one browser at a
            // time, and the testing.md target config specifies chromium. Add
            // firefox/webkit projects only for a no-coverage cross-browser pass.
            instances: [{ browser: 'chromium' }],
        },
        include: ['components/**/[A-Z]*.test.ts'],
        exclude: ['components/**/*.variants.test.ts'],
        setupFiles: ['./test-setup.ts'],
        passWithNoTests: true,
        coverage: {
            // istanbul (instrumentation-based) rather than v8: the playwright
            // browser provider doesn't expose the CDP commands v8 coverage needs.
            provider: 'istanbul',
            reportsDirectory: 'coverage-browser',
            reporter: ['text', 'json-summary', 'html', 'lcov'],
            include: ['components/**/*.{ts,svelte}'],
            exclude: [
                'components/**/*.{test,spec}.ts',
                'components/**/*.test.svelte',
                'components/**/*-harness.svelte.ts',
                'components/**/index.ts',
                'components/**/types.ts',
                '**/dist/**',
                '**/.svelte-kit/**',
                '**/*.d.ts',
            ],
        },
    },
});
