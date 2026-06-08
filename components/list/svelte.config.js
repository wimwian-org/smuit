/*
 * @smuit/list
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// svelte-package input/output/types are passed as CLI flags (see package.json
// "build"); `config.package` was removed in @sveltejs/package v2.4+.
export default {
    preprocess: vitePreprocess(),
};
