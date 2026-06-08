/*
 * @smuit/playground
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    server: {
        watch: {
            // @smuit/theme is symlinked into node_modules; follow it so edits to
            // the theme's CSS (palettes, tokens, tints) trigger HMR in the playground.
            followSymlinks: true,
            ignored: ['!**/packages/theme/src/**'],
        },
    },
});
