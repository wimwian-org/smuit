---
'@wimwian-org/theme': minor
---

Add batteries-included entry points and move font loading out of the flat token bundle.

- New `@wimwian-org/theme/css` export — a single stylesheet that pulls in Google Fonts, Tailwind, and the flat token theme, ordered so the remote `@import` always leads the bundle.
- New `@wimwian-org/theme/svelte` export — a `<Theme />` component that imports that CSS and renders the font `preconnect` hints (which CSS can't express) into `<svelte:head>`. `svelte` is an optional peer dependency.
- The flat `@wimwian-org/theme` / `@wimwian-org/theme/flat` bundle (`output.css`) no longer carries the Google Fonts `@import`, so it can be safely imported after Tailwind without tripping the "@import must precede all other statements" rule. Consumers wanting fonts should use `/css` or `/svelte`.
