/*
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Node-mode tests: lowercase utility tests + *.variants.test.ts, plus the
        // pure theme-generator core. Browser-mode tests (PascalCase *.test.ts) run
        // under vitest.browser.config.ts.
        include: [
            'components/**/[a-z]*.test.ts',
            'components/**/*.variants.test.ts',
            'packages/theme/src/theme/*.test.ts',
        ],
        passWithNoTests: true,
        coverage: {
            provider: 'v8',
            reportsDirectory: 'coverage',
            reporter: ['text', 'json-summary', 'html', 'lcov'],
            include: ['components/**/*.ts', 'packages/theme/src/theme/theme-gen.ts'],
            exclude: [
                'components/**/*.{test,spec}.ts',
                'components/**/*.svelte.ts',
                'components/**/index.ts',
                'components/**/types.ts',
                // DOM-dependent sources are browser-tested; their coverage is
                // reported by vitest.browser.config.ts, not here.
                'components/ripple/src/ripple.ts',
                '**/dist/**',
                '**/.svelte-kit/**',
                '**/*.d.ts',
            ],
        },
    },
});
