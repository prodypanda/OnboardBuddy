# OnboardBuddy development guide

## Requirements

- Node.js compatible with Next.js 15
- pnpm 9.x

The repository declares:

```json
{
  "packageManager": "pnpm@9.15.1"
}
```

## Install

```bash
pnpm install
```

## Run the demo

```bash
pnpm dev
```

Open the URL printed by Next.js. If port `3000` is busy, Next.js may choose `3001`.

Main demo routes:

| Route | Purpose |
| --- | --- |
| `/` | Landing page linking to all demos. |
| `/seller` | 5-step seller marketplace onboarding tour. |
| `/remote-config` | Mock hosted config loader with reload/status UI. |
| `/analytics` | Local event capture and mock upload sink. |
| `/editor` | JSON + form editor preview, including split-hand calibration fields. |
| `/docs` | In-app quick docs. |

## Verification commands

```bash
pnpm lint
pnpm typecheck
pnpm build
```

`pnpm lint` currently delegates to each workspace's TypeScript validation. Add ESLint when the project chooses a stable Next/ESLint configuration.

## Package layout

```txt
packages/react/src/index.tsx    Provider, hooks, state machine, positioning, remote config, analytics
packages/react/src/styles.css   Runtime CSS for overlays, cards, character layers, animations
apps/demo/src/lib/tours.ts      Seller dashboard demo tour config
apps/demo/public/tours          Mock remote-config JSON
apps/demo/public/characters     Demo split character body/hand assets
```

## Testing checklist

Before opening a PR:

1. Run `pnpm install` if dependencies are missing.
2. Run `pnpm lint`, `pnpm typecheck`, and `pnpm build`.
3. Start `pnpm dev`.
4. Verify `/seller` can restart and finish the 5-step tour.
5. Verify `/editor` mirrors form edits into JSON and can restart preview.
6. Verify split-hand configs render body + hand layers and the hand can shake or stay still.
7. Verify `/remote-config` loads mock tours and reloads without status divergence.
8. Verify `/analytics` captures started, viewed, skipped, and completed events.

If the browser shows stale UI after changing package code, restart `pnpm dev`.

## Adding a tour step

1. Add a stable selector to the target element, preferably `data-tour-id`.
2. Add a step in `apps/demo/src/lib/tours.ts`.
3. Choose `targetAnchor` on the UI element and `pointerAnchor` or `character.hand.pointerAnchor` on the mascot.
4. Set `overlay`, `animation`, `interaction`, and `controls`.
5. Run the demo and adjust offsets only after anchor points are correct.

## Calibrating a split hand

Use `/editor` for visual calibration:

1. Pick the step.
2. Set `Character image URL` to the body image.
3. Set `Moving hand image URL` to the hand/arm image.
4. Tune hand `position`, `width`, and `height`.
5. Tune `shoulderPivot` until the hand rotates from the shoulder.
6. Tune fingertip `pointerAnchor` so automatic positioning points at the target.
7. Adjust `rotation`, `shake.degrees`, and `shake.durationMs`.
8. Disable `Shake enabled` for static poses.

Copy the resulting JSON into the tour config or remote payload.
