/*
 * @wimwian-org/text-field
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */

// `@wimwian-org/theme` resolves to a CSS file (its `.` export is output.css), so
// the side-effect `import '@wimwian-org/theme'` in Root.svelte — which loads the
// design tokens so the bit renders standalone — has no type declaration. Declare
// the module so svelte-check can resolve the import. Inert for consumers (a stray
// ambient .d.ts in a dependency is not auto-loaded into their program).
declare module '@wimwian-org/theme' {}
