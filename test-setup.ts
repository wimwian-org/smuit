/*
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
// Loads design tokens into the browser before any component renders.
// Components import @smuit/theme individually too; this guarantees CSS custom
// properties are in scope for computed-style assertions.
import './packages/theme/src/index.css';
