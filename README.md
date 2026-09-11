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
