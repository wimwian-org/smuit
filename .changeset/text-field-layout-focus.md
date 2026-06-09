---
'@wimwian-org/text-field': minor
---

Refine the text-field layout, alignment, and focus styling:

- **Filled & standard** are 8px taller, with a 4px gap above and below the input.
- **Outlined** input now sits on the same line above the underline as filled/standard, and the outline closes tighter (no extra centred padding); the resting label, input text, and leading icon line up consistently across all three variants.
- **Single-colour focus** across every variant — no neutral border or focus ring shown beside the tint indicator — and hovering a focused field keeps the accent (no grey fallback).
- **Adornments**: leading/trailing icons scale to `1em` and centre on the input baseline; the `standard` variant now correctly offsets the label past a leading icon (fixes an invalid `calc()` from a unitless `0`).
- **Multiline**: the filled textarea grows its top fill so the floated label is covered with a gap to the text; the standard textarea lifts its floated label above the first line.
