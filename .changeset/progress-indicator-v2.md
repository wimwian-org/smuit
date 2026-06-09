---
'@smuit/progress-indicator': minor
---

Ship the deferred features:

- **Circular** shape (`shape="circular"`) — an SVG ring on the same `value`/`max`
  model, sized per `size`, determinate + indeterminate.
- **Buffer** (linear) — a secondary `buffer` channel with a faint fill and a
  dotted track beyond it.
- **Four-colour** indeterminate (`fourColor`) — the animated indicator cycles
  through four accents (linear bar + circular ring).
- **Label / value readout** — a built-in `label` caption and an inline `showValue`
  percentage (centred inside the ring for circular).
