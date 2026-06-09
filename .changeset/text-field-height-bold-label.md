---
'@smuit/text-field': patch
---

Tighten the field vertically: `--tf-height` now fits the content (input line +
floated-label region + bottom padding) rather than a fixed 56px — md `2.75rem`,
sm `2.5rem`. The lifted (floated) label is now **bold** (700) instead of
semibold.
