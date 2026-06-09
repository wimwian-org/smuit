---
'@smuit/loading-indicator': minor
---

Add the deferred loading-indicator features: a determinate `progress` (0→1) mode with a sweep arc and `aria-valuenow`, a completion hand-off (`complete` / `progress >= 1`) that settles into a success checkmark, a custom `shapes` morph sequence (with exported `LOADING_INDICATOR_SHAPES` / `DEFAULT_SHAPE_SEQUENCE`), and a `containerShape` option (`rounded` / `squircle` / `cookie`) for the contained variant. The exact AndroidX spring-physics morph remains deferred.
