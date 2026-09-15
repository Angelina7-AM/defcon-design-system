# @defcon/ui

The **Defcon AI Design System** as a React + TypeScript component library — dark-mode, off-black layered surfaces, signal-amber accent, monospace metadata labels. Built with [tsup](https://tsup.egoist.dev/) and released with [Changesets](https://github.com/changesets/changesets).

## Install

```bash
pnpm add @defcon/ui
# peer deps:
pnpm add react react-dom
```

Import the stylesheet once at your app root:

```ts
import '@defcon/ui/styles.css';        // components + tokens
// or just the tokens:
import '@defcon/ui/tokens.css';
```

## Usage

```tsx
import { Button, Surface, MetadataLabel, Badge, Avatar, Breadcrumb, BreadcrumbItem } from '@defcon/ui';

export function Panel() {
  return (
    <Surface level={1} padded>
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Simulation</BreadcrumbItem>
      </Breadcrumb>
      <MetadataLabel>JOB&nbsp;·&nbsp;0x4F2A</MetadataLabel>
      <Avatar initials="DB" status="online" />
      <Badge variant="accent">Running</Badge>
      <Button variant="primary">Run simulation</Button>
      <Button variant="ghost">Cancel</Button>
    </Surface>
  );
}
```

## Components

| Component | Notes |
| --- | --- |
| `Button` | `variant`: primary/secondary/ghost/success/danger/warning/dark/tertiary · `size`: xs/sm/md/lg/xl · `outline`, `iconOnly`, `loading` |
| `Surface` | Layered off-black panel, `level` 0–2 |
| `MetadataLabel` | Monospace uppercase metadata text |
| `Badge` | `variant`: neutral/subtle/accent/danger/warning/success · `dot`, `loading`, `leftIcon`, `secondaryText`, `iconOnly`, `onDismiss` |
| `Avatar` / `AvatarGroup` / `AvatarGroupLabel` | `size` xs–2xl, `status` dot, `removable` |
| `Breadcrumb` / `BreadcrumbItem` | `<nav><ol>` trail; omit `href` on the last item for the current page |
| `Banner` | `type`: default/heading-description/icon-link/newsletter/logo-button + the six classification markings (unclassified/controlled-cui/confidential/secret/top-secret/top-secret-sci) · `position`, `showIcon`, `actions`, `onDismiss` |
| `Logo` / `Wordmark` | DEFCON brand marks — the 24px gradient mark and the "DEFCON AI" wordmark |

`Banner` is reproduced literally from its Figma component set, which is drawn
light-mode; its palette is scoped to `.dfc-banner` and does not use the dark
`--dfc-*` brand tokens. The classification colors are prescribed and are not
themeable. Figma's `Breakpoint` axis is responsive behavior rather than a prop,
so it is implemented as media queries.

More components (Cards, Modals, Forms, Navbar, Tables, ...) from the Figma design system are being ported incrementally — see open PRs/issues for progress.

Token values are also available in JS:

```ts
import { tokens } from '@defcon/ui';
tokens.accent.base; // '#ffb000'
```

## Develop

```bash
pnpm install
pnpm dev        # tsup watch build
pnpm test       # vitest
pnpm typecheck
pnpm lint
pnpm build      # ESM + CJS + .d.ts to dist/
```

## Tokens

`styles/tokens.css` holds the CSS custom properties; `src/tokens.ts` mirrors them in JS. The values shipped here are **starter values** — sync them with your Figma-mapped tokens (the set you formalized in `CLAUDE.md`) so the package stays the single source of truth for consumers.

### Text (foreground) colors

`tokens.css` also carries the 22 `--color-text-*` tokens ported from the Figma
"Text color variables" spec, mirrored in JS as `textColors.light` / `textColors.dark`.

These keep the spec's own naming rather than the `--dfc-*` family: CSS custom
properties share one namespace, so every foreground token is prefixed
`--color-text-` and the semantic color roles carry an extra `-fg` infix
(`--color-text-fg-danger`), while the structural ones do not
(`--color-text-heading`).

Light is the base mode. Dark follows the OS preference automatically, and either
mode can be forced on any subtree:

```html
<div data-theme="dark">…</div>   <!-- forces dark -->
<div data-theme="light">…</div>  <!-- forces light, even when the OS is dark -->
```

Four tokens are deliberately mode-invariant: `white`, `black`, `fg-brand-subtle`
and `fg-yellow`.

### Background colors

The companion set: 44 `--color-bg-*` tokens, mirrored in JS as
`backgroundColors.light` / `backgroundColors.dark`. Same theming rules as above;
seven are mode-invariant (`white`, `danger`, `dark`, `purple`, `sky`, `cyan`,
`orange`).

The `soft` / `medium` / `strong` shades let a surface be layered without
per-case overrides. Several of them **share a value in light mode and only
diverge in dark** — that is the point of the scale, not duplication:

| token | light | dark |
| --- | --- | --- |
| `--color-bg-primary` | `#ffffff` | `#030712` |
| `--color-bg-primary-soft` | `#ffffff` | `#101828` |
| `--color-bg-primary-medium` | `#ffffff` | `#1e2939` |
| `--color-bg-primary-strong` | `#ffffff` | `#333e4f` |

All four are white on a light background, but give a dark-mode component four
distinct surfaces to stack on.

### Border colors

24 `--color-border-*` tokens, mirrored as `borderColors.light` / `borderColors.dark`.
Same theming rules; four are mode-invariant (`dark`, `brand-light`, `purple`,
`orange`). As with backgrounds, the shades collapse in light and fan out in dark
— all four `base` shades are `#e5e7eb` in light but span `#101828`–`#4a5565` in dark.

> **Unverified:** the four `warning` border values. In Figma their swatches are
> bound to the `--color-text-fg-warning*` *text* tokens rather than border
> variables, both dark warning swatches resolve to the same `#fe9a00`, and all
> four palette labels disagree with the rendered color. The shipped values are
> what the spec draws, but confirm them with design before relying on them.

### Data visualization — categorical

14 `--color-viz-categorical-01` … `-14` tokens, mirrored as `vizCategorical.light` /
`vizCategorical.dark` — **ordered arrays**, because the spec requires the colors be
assigned in sequence ("carefully curated to maximize contrast between neighboring
colors"). Index 0 is `categorical-01`. Unlike the other families these are raw fills
in Figma, not bound variables, so the `--color-viz-*` naming is ours.

```ts
import { vizCategorical } from '@defcon/ui';
series.forEach((s, i) => (s.color = vizCategorical.light[i])); // in order
```

Spec guidance: cap a chart at 8–10 categories (3–5 is better), never encode meaning
in color alone, and prefer Blue/Orange/Green/Cyan for color-blind safety.

> **Distinctness only holds to ~10 categories.** Closest pair by CIE76 ΔE — first 8:
> light 35.1 / dark 27.4 (fine); first 10: light 23.0 / dark 25.1 (borderline); all 14:
> light 7.0 / dark 0.0 (broken). Slots 11–14 are the problem: in dark, `01`/`14` and
> `03`/`11` are exact duplicates (12 distinct colors for 14 slots); in light, `06` and
> `13` are near-identical dark reds. Stay at or below 10 series.

All four sets are **additive** — no component consumes them yet, and the `--dfc-*`
tokens still drive every component in this library.

| family | tokens | JS mirror |
| --- | --- | --- |
| `--color-text-*` | 22 | `textColors` |
| `--color-bg-*` | 44 | `backgroundColors` |
| `--color-border-*` | 24 | `borderColors` |
| `--color-viz-categorical-*` | 14 | `vizCategorical` |

## Releasing

Publishing runs through Changesets + GitHub Actions:

1. Record a change in your PR: `pnpm changeset` → pick a bump, write a summary, commit the generated file.
2. On merge to `main`, the **Release** workflow opens a "Version Packages" PR.
3. Merge that PR → it bumps the version, updates the changelog, and publishes `@defcon/ui` to npm.

**One-time setup:** add an [npm automation token](https://docs.npmjs.com/creating-and-viewing-access-tokens) as a repo secret named `NPM_TOKEN` (Settings → Secrets and variables → Actions). The org must allow publishing the `@defcon` scope.

## Push to GitHub

From this folder:

```bash
git init
git add .
git commit -m "chore: initial @defcon/ui scaffold"
git branch -M main

# With the GitHub CLI:
gh repo create defcon-ai/ui --private --source=. --remote=origin --push

# Or manually, after creating an empty repo on github.com:
git remote add origin git@github.com:defcon-ai/ui.git
git push -u origin main
```

Then add the `NPM_TOKEN` secret and your first changeset.

## License

MIT © Defcon AI
