Migration helper scripts

Available scripts (run from project root):

- `pnpm migration:css` — prefix CSS selectors by filename. Matches files by the pattern passed to the script; default: `src/**/*.*.@(css|scss)`. Only files whose basename contains a dot (e.g., `Card.Root.css`) are modified. Each rule in the file is prefixed with the class derived from the filename: `Card.Root.css` → `.card-root`.

- `pnpm migration:svelte` — transform Svelte sources. What it does (conservative):
    - Rewrites `class="Card.Root"` → `class="card-root"` (tokens with dots are converted to hyphen-lowercase).
    - Extracts static `style="..."` / `style='...'` attributes into a generated stylesheet `src/assets/inline-styles.generated.css` and replaces the attribute with a class on the element. Dynamic styles containing `{` or `}` are skipped and reported.
    - Keeps dynamic / complex class bindings untouched.

- `pnpm migration:scripts` — runs both scripts in sequence.

Notes & safety

- The scripts are conservative and best-effort. Review diffs and run tests before committing.
- The Svelte transform uses simple parsing (regex) to avoid installing a full Svelte AST transform. It handles most common static usages but will skip dynamic/mustache cases and report them.
- Backup or run on a feature branch.
