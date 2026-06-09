/*
 * @smuit/text-field
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */

/**
 * Build-time cap on the number of autosuggest `suggestions` a field may take.
 * Passing more than this throws (autosuggest is a deliberate small-list
 * affordance — use a Select or search for long lists). This is a build-time
 * constant, not a per-instance prop: change it here (or via your bundler's
 * define/alias) and rebuild.
 */
export const MAX_SUGGESTIONS = 10;
