/*
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import svelteConfig from './svelte.config.js';

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...svelte.configs['flat/recommended'],
    prettier,
    ...svelte.configs['flat/prettier'],
    {
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    {
        files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
                extraFileExtensions: ['.svelte'],
                svelteConfig,
            },
        },
    },
    {
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
        },
    },
    {
        // apps/ are dev-only tools; relax rules that only make sense in production apps.
        files: ['apps/**'],
        rules: {
            'svelte/no-navigation-without-resolve': 'off',
        },
    },
    {
        ignores: [
            'build/',
            'coverage',
            '**/.svelte-kit/**',
            '**/node_modules/',
            '**/dist/',
            '**/public/',
            'pnpm-lock.yaml',
            'pnpm-workspace.yaml',
        ],
    },
];
