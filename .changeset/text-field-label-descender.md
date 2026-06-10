---
'@wimwian-org/text-field': patch
---

Fix the floating label clipping glyph descenders (e.g. the "g" in "Age"): `truncate`'s `overflow: hidden` combined with `line-height: 1` cut anything below the line-box. Pad the label's block axis to enlarge the clip region and cancel the growth with an equal negative margin, so descenders render without moving the label in any variant.
