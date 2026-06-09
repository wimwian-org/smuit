/*
 * @wimwian-org/playground
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter({
            fallback: '404.html',
        }),
    },
};
