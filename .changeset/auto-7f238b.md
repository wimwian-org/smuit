---
'@smuit/list': patch
---

Make `tint` visible: a single `--list-accent` token (set per tint) now drives the resting fill, the hover/pressed state layers, and the focus outline together — previously only the keyboard focus outline was tinted, so lists looked identical regardless of tint. The default tint is now `neutral`, so un-tinted lists stay grey and explicit tints clearly stand out.
