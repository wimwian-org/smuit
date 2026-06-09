---
'@smuit/theme': patch
---

Darken the `solid` surface role to step **700/300** (light/dark) and shift `solid-hover` to **750/250**, for bolder solid fills. `toneOf` now computes intermediate steps on demand, so the 9-step RAG palettes (error/warning/success) resolve the 250/750 tones too.
