# smuit

> Material Design 3 components for Svelte.

**smuit** is a pnpm monorepo housing a Material Design 3 design system and a Svelte 5 component library. It ships a CSS-only theme package implementing MD3 color roles and tokens, ~50 independently versioned component packages under the `@smuit/*` npm scope, and a SvelteKit playground for developing and demoing every token and component.

Everything is built on Svelte 5 runes, Tailwind CSS v4 (`@theme` + `@utility`), and an oklch design-token system faithful to Material Design 3's color system, typography scale, shape tokens, and elevation model — with first-class light/dark theming.

---

## Table of Contents

- [Why smuit](#why-smuit)
- [Workspace Layout](#workspace-layout)
- [Quick Start](#quick-start)
- [Packages](#packages)
- [Components](#components)
- [Design Tokens](#design-tokens)
- [Development](#development)
- [Testing](#testing)
- [Branching & Releases](#branching--releases)
- [Documentation Map](#documentation-map)
- [Tech Stack](#tech-stack)
- [Acknowledgements](#acknowledgements)
- [License](#license)

---

## Why smuit

- **Material Design 3 fidelity.** Components follow MD3 design philosophy — color roles, shape tokens, typescale, and elevation — rather than inventing a parallel system. If MD3 specifies it, smuit implements it.
- **Headless-first accessibility.** Interactive components are built on battle-tested headless primitives (bits-ui, Melt UI, etc.) for correct focus management, keyboard behaviour, and ARIA semantics. smuit adds MD3 theming and structure on top.
- **Token-driven theming.** MD3 color roles (`primary`, `secondary`, `tertiary`, `error`, surface roles) are implemented with an oklch palette and a CSS space-toggle (`--L` / `--D`) — no JS theme switch, no flash.
- **Independently published.** Each component is its own `@smuit/*` package with its own version and changelog, depending only on `@smuit/theme`. Consumers install only what they use.
- **Svelte 5 native.** Runes (`$state`, `$derived`, `$props`, snippets) throughout — no legacy stores or `export let`.

---

## Workspace Layout

```
smuit/
├── apps/
│   └── playground/      (@smuit/playground) — SvelteKit dev sandbox, NOT published
├── packages/
│   └── theme/           (@smuit/theme) — CSS design tokens + Tailwind v4 theme, published
├── components/          — component packages, each published as @smuit/<name>
├── .claude/             — project guidance docs (see Documentation Map)
├── bin/wt               — git-flow + worktree helper
└── scripts/             — build/metadata/release utilities
```

**Dependency direction:** `apps/` → `components/` → `packages/`. No reverse dependencies. A component depends only on `@smuit/theme` (peer) and its headless primitive; it never reaches back into the playground.

---

## Quick Start

Requires **Node** + **pnpm** (`^11.4.0` — the repo auto-downloads it via `devEngines` if missing).

```bash
# Install all workspace dependencies
pnpm install

# Run the playground dev sandbox
pnpm --filter @smuit/playground dev

# Type-check, lint, format
pnpm check
pnpm lint
pnpm format
```

### Consuming a component (downstream)

```bash
pnpm add @smuit/button @smuit/theme
```

```css
/* app.css — import the theme once at the root */
@import '@smuit/theme';
```

```svelte
<script>
    import { Button } from '@smuit/button';
</script>

<Button variant="filled">Click me</Button>
```

---

## Packages

| Package              | Path                | Published | Description                                                    |
| -------------------- | ------------------- | --------- | -------------------------------------------------------------- |
| `@smuit/theme`       | `packages/theme`    | ✅        | CSS-only MD3 design tokens, oklch palettes, Tailwind v4 theme. |
| `@smuit/<component>` | `components/<name>` | ✅        | One package per component, following MD3 specifications.       |
| `@smuit/playground`  | `apps/playground`   | ❌        | SvelteKit sandbox — demos every token and component. Dev-only. |

### `@smuit/theme`

A pure-CSS package (no Svelte, no JS): a single **flat** stylesheet — `output.css`,
generated from `input.css` — with every MD3 color role, oklch palette, tint
`@utility`, elevation/shadow ramp, and typescale baked to concrete values (no
runtime `color-mix()` / `light-dark()`). Import it once at your app root:

```css
@import '@smuit/theme'; /* the flat theme — resolves to output.css */
```

The same file is also reachable as `@smuit/theme/flat`.

### Component package anatomy

Each component follows the same layout (example: `@smuit/button`):

```
components/button/
├── package.json           — @smuit/button; peer: @smuit/theme, svelte, tailwindcss
├── README.md              — per-component usage
├── CHANGELOG.md           — changesets-generated
├── tsconfig.json
└── src/
    ├── index.ts           — public entry
    ├── Button.svelte      — the component
    ├── button.variants.ts — tailwind-variants config
    ├── button.css         — semantic styles
    ├── types.ts           — prop types
    └── *.test.ts          — Vitest specs
```

---

## Components

MD3 components live in `components/`, each published as `@smuit/<name>`:

`app-bar` · `avatar` · `badge` · `bottom-app-bar` · `bottom-sheet` · `button` · `card` · `checkbox` · `chip` · `date-picker` · `dialog` · `divider` · `fab` · `icon-button` · `list` · `menu` · `navigation-bar` · `navigation-drawer` · `navigation-rail` · `progress` · `radio-group` · `search` · `select` · `slider` · `snackbar` · `switch` · `tabs` · `text-field` · `time-picker` · `tooltip`

### Adding a component

```bash
/create-bit    # wrap a headless primitive into a new @smuit/* package
/create-mui    # rebuild an SMUI/Material Design 3 component to smuit conventions
/create-shadcn # adapt a shadcn-svelte component to smuit tokens
```

---

## Design Tokens

Full reference: [`.claude/styling.md`](.claude/styling.md).

smuit maps Material Design 3's color system onto oklch palettes:

- **MD3 color roles** — `primary`, `secondary`, `tertiary`, `error` each with `on-*`, `*-container`, `on-*-container` variants. All oklch.
- **Neutral roles** — `surface`, `surface-variant`, `outline`, `outline-variant`, `background`.
- **Theming** — `--L` / `--D` space-toggle keyed off `html[data-theme="light|dark"]`. No JavaScript needed to switch themes.
- **Typescale** — MD3 type roles: `display-large` → `label-small` (15 roles across Display, Headline, Title, Body, Label).
- **Shape tokens** — MD3 shape scale: `none`, `extra-small`, `small`, `medium`, `large`, `extra-large`, `full`.
- **Elevation** — 6 tonal surface tints (`level-0` → `level-5`) per MD3 elevation model.

> Any new token or component must meet **AA contrast (4.5:1)** in both light and dark.

---

## Development

Commands are workspace-scoped — run from the repo root, or target a workspace with `--filter`.

| Command                                 | Does                                                  |
| --------------------------------------- | ----------------------------------------------------- |
| `pnpm format`                           | Prettier write (all workspaces)                       |
| `pnpm lint`                             | ESLint (all workspaces)                               |
| `pnpm check`                            | `svelte-check` across the workspace                   |
| `pnpm commit`                           | Commitizen prompt — conventional commit message       |
| `pnpm changeset`                        | Author a changeset by hand                            |
| `pnpm test`                             | Vitest (node mode)                                    |
| `pnpm test:browser`                     | Vitest (browser mode, Playwright)                     |
| `pnpm test:all`                         | Both node and browser test suites                     |
| `pnpm coverage`                         | Full coverage run + regenerate playground status JSON |
| `pnpm --filter @smuit/playground dev`   | Vite dev server                                       |
| `pnpm --filter @smuit/playground build` | Static build                                          |

Conventions live in `.claude/` — code style ([`karpathy.md`](.claude/karpathy.md)), Svelte 5 patterns ([`svelte.md`](.claude/svelte.md)), CSS authoring ([`css-authoring.md`](.claude/css-authoring.md)), variants ([`variants.md`](.claude/variants.md)), and the headless-wrapping pattern ([`bits.md`](.claude/bits.md)).

---

## Testing

See [`.claude/testing.md`](.claude/testing.md).

- **Node mode** (`pnpm test`) — fast unit tests for pure logic, variants, and `.svelte.ts` rune harnesses.
- **Browser mode** (`pnpm test:browser`) — Playwright-backed tests for components whose behaviour only compiles/runs in the browser (PascalCase `.test.ts` specs).
- **Coverage** — `pnpm coverage` runs both suites with v8 coverage and regenerates the per-component JSON the playground homepage reads.

---

## Branching & Releases

Full model: [`.claude/gitflow.md`](.claude/gitflow.md). We use **git flow** with protected long-lived branches.

| Branch              | Cut from | Merges into      | Notes                           |
| ------------------- | -------- | ---------------- | ------------------------------- |
| `master`            | —        | —                | Production. Tagged. Protected.  |
| `dev`               | `master` | —                | Integration. Protected.         |
| `feature/<slug>`    | `dev`    | `dev`            | Standard development work.      |
| `release/<version>` | `dev`    | `master` + `dev` | Where `changeset version` runs. |
| `hotfix/<version>`  | `master` | `master` + `dev` | Emergency patch on production.  |

- **Never commit directly to `master` or `dev`.** Both are protected (admins included).
- `master` only advances by **fast-forward from `dev`** (`pnpm push:master` or `git push origin dev:master`) — never via PR merge.
- Each `feat:` / `fix:` commit on a feature branch auto-attaches a changeset (post-commit hook).
- **Parallel work** uses git worktrees — `bin/wt feature <slug>` cuts a branch into a sibling `../smuit.worktrees/<slug>` directory so multiple sessions never collide on `HEAD`.

### Before shipping

- [ ] `pnpm check` — types pass
- [ ] `pnpm lint` — no errors
- [ ] `pnpm test:all` — both suites pass
- [ ] `pnpm --filter @smuit/playground build` — playground builds clean
- [ ] AA contrast (4.5:1) in light and dark for any new token/component
- [ ] All commits conventional; a changeset exists for any consumer-visible change

---

## Documentation Map

Developed with [Claude Code](https://claude.com/claude-code). Guidance lives in **[CLAUDE.md](CLAUDE.md)**:

| Doc                                                  | Covers                                              |
| ---------------------------------------------------- | --------------------------------------------------- |
| [CLAUDE.md](CLAUDE.md)                               | **Start here** — doc index + commands               |
| [.claude/karpathy.md](.claude/karpathy.md)           | Behavioral guidelines — minimal, deliberate change  |
| [.claude/process.md](.claude/process.md)             | Plan-before-execute discipline                      |
| [.claude/gitflow.md](.claude/gitflow.md)             | Branching model + worktree workflow                 |
| [.claude/svelte.md](.claude/svelte.md)               | SvelteKit + Svelte 5 runes, snippets, routing       |
| [.claude/styling.md](.claude/styling.md)             | MD3 design tokens, oklch palettes, `--L`/`--D`      |
| [.claude/css-authoring.md](.claude/css-authoring.md) | Inline-utility budget, semantic naming, `data-slot` |
| [.claude/bits.md](.claude/bits.md)                   | Headless primitive wrapping pattern                 |
| [.claude/component.md](.claude/component.md)         | Component standards, prop design, a11y              |
| [.claude/variants.md](.claude/variants.md)           | tailwind-variants config                            |
| [.claude/testing.md](.claude/testing.md)             | Vitest + Playwright browser mode                    |
| [.claude/tooling.md](.claude/tooling.md)             | ESLint, Prettier, lefthook, commitlint, changesets  |
| [.claude/distribution.md](.claude/distribution.md)   | Package publishing and release workflows            |

> **Contributing?** Read [CLAUDE.md](CLAUDE.md) first — it defines the conventions every change in this repo follows.

---

## Tech Stack

- **[Svelte 5](https://svelte.dev)** + **[SvelteKit](https://kit.svelte.dev)** — runes, snippets
- **[bits-ui](https://bits-ui.com)** — headless component primitives
- **[Tailwind CSS v4](https://tailwindcss.com)** — `@theme` + `@utility`, oklch
- **[tailwind-variants](https://www.tailwind-variants.org)** — type-safe variant/slot config
- **[Material Design 3](https://m3.material.io)** — design philosophy, color system, typescale, shape, elevation
- **[Vite](https://vitejs.dev)** + **[Vitest](https://vitest.dev)** (+ Playwright browser mode)
- **[Changesets](https://github.com/changesets/changesets)** — independent versioning
- **[pnpm](https://pnpm.io)** workspaces · **ESLint** · **Prettier** · **lefthook** · **commitlint**

---

## Acknowledgements

**smuit** stands on the shoulders of these projects:

- **[Material Design 3](https://m3.material.io)** (Google) — the design system this library implements. Color roles, typescale, shape tokens, elevation model, and component specifications are MD3's.
- **[bits-ui](https://bits-ui.com)** (Hunter Johnston) — headless Svelte primitives providing accessibility, focus management, and keyboard behaviour as the foundation for interactive components.
- **[SMUI](https://sveltematerialui.com)** (Hunter Perrin) — Svelte Material UI, one of the earliest and most comprehensive Material implementations in Svelte; a direct reference and benchmark.
- **[shadcn-svelte](https://www.shadcn-svelte.com)** (Huntabyte) — the Svelte port of shadcn/ui. Its copy-paste model, component anatomy, and token conventions directly influenced smuit's structure.
- **[svar-svelte](https://github.com/svar-widgets/svar-svelte)** — component patterns and composition techniques that informed smuit's approach to complex widget behaviour.
- **[Tailwind CSS](https://tailwindcss.com)** (Tailwind Labs) — the utility-first CSS framework powering `@smuit/theme`'s `@theme` blocks, `@utility` classes, and the design-token cascade.
- The broader Svelte OSS community — countless open-source components, patterns, and experiments on GitHub that shaped how smuit approaches Svelte 5 component authoring.

---

## License

[MIT](LICENSE) © wimwian
