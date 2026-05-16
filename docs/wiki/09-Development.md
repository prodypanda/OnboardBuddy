# Development

## Repository structure

```txt
apps/demo
  Next.js reference app and seller dashboard demo.

apps/dashboard
  Placeholder for the future SaaS dashboard.

packages/react
  Reusable OnboardBuddy React package.

docs
  Architecture, API docs, feature guides, roadmap, and wiki.
```

## Install

```bash
pnpm install
```

## Run

```bash
pnpm dev
```

## Verify

```bash
pnpm lint
pnpm typecheck
pnpm build
```

`pnpm lint` currently delegates to workspace validation. Full ESLint rules can be added when the project chooses a final linting policy.

## Important files

| Path | Purpose |
| --- | --- |
| `packages/react/src/index.tsx` | Provider, hooks, state machine, positioning, remote config, analytics. |
| `packages/react/src/styles.css` | Runtime styles for overlays, cards, character layers, and animations. |
| `apps/demo/src/lib/tours.ts` | Seller dashboard tour config. |
| `apps/demo/src/components/EditorClient.tsx` | JSON/form editor preview. |
| `apps/demo/src/components/AnalyticsDemo.tsx` | Analytics demo. |
| `apps/demo/public/tours` | Mock remote config payloads. |
| `apps/demo/public/characters` | Demo character assets. |
| `docs/wiki` | GitHub-wiki-ready documentation. |

## Adding a new tour step

1. Add a stable `data-tour-id` to the target UI.
2. Add a step to the tour config.
3. Choose `targetAnchor`.
4. Choose `pointerAnchor` or `character.hand.pointerAnchor`.
5. Set overlay and interaction mode.
6. Run the demo.
7. Tune anchors first, offset last.

## Adding a new character

1. Create body and hand images.
2. Place assets in `public/characters`.
3. Configure `character.imageUrl`.
4. Configure `character.hand.imageUrl`.
5. Tune in `/editor`.
6. Copy JSON into `apps/demo/src/lib/tours.ts` or a remote payload.

## Testing before a PR

Minimum:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Manual browser checks:

1. `/seller`: restart and complete the 5-step tour.
2. `/editor`: edit hand fields, confirm JSON mirrors form values, restart preview.
3. `/remote-config`: confirm remote source/status and reload.
4. `/analytics`: capture and flush events.
5. `/docs`: confirm docs sections render.

## Common local development note

If browser UI looks stale after changing the React package, restart `pnpm dev`.

Next.js may cache workspace package changes during local development.
