# Troubleshooting

## Tour does not start

Check:

1. The provider receives the tour.
2. The tour id passed to `start()` or `reset()` matches config.
3. `autoStart` is set if expecting automatic start.
4. localStorage completion is not already set.

Try:

```tsx
const buddy = useOnboardBuddy()
buddy.reset("seller-dashboard")
```

## Target is not found

Check the selector:

```ts
target: "[data-tour-id='overview']"
```

And the DOM:

```tsx
<section data-tour-id="overview">
```

Prefer `data-tour-id` over class names because styling classes can change.

## Character points to the wrong place

Tune in this order:

1. `targetAnchor`
2. `pointerAnchor` or `character.hand.pointerAnchor`
3. character size
4. hand size and position
5. `offset`

Do not rely on offset for large positioning errors.

## Hand shakes from the wrong point

Adjust:

```ts
shoulderPivot: { x: "12%", y: "58%" }
```

The pivot is relative to the hand image, not the body image.

If the image was cropped differently, the same pivot numbers may no longer work.

## Hand is detached from body

Adjust:

```ts
position: { x: "58%", y: "47%" }
```

`position` places the top-left corner of the hand image inside the body container.

Tune hand position before tuning shoulder pivot.

## Fingertip misses target

Adjust:

```ts
pointerAnchor: { x: "95%", y: "18%" }
```

This point should sit exactly on the fingertip inside the hand image.

## Editor fields cannot be clicked

The preview tour overlay may be active.

Click Skip first, then edit the form.

## JSON editor shows errors

Validate:

- strings use double quotes in JSON mode
- no trailing commas
- arrays and objects are closed
- each step includes `id`, `target`, `title`, and `body`

## Remote config falls back

Check:

1. `configUrl` is reachable.
2. payload is either an array or `{ "tours": [...] }`
3. steps include required fields
4. the browser can fetch the URL

Fallback is expected if remote loading fails.

## Analytics events duplicate

Avoid writing to the same upload log from both `track` and `flush`.

Recommended:

- use `track` for immediate external ingestion
- use `flush` for batched external ingestion
- do not use both to append into the same mock upload list unless you intentionally want both records

The demo only populates mock uploads during `flush`.

## Build fails after changing docs only

Run:

```bash
pnpm typecheck
pnpm build
```

Docs-only changes should not usually affect build output. If build fails, inspect whether a code file or JSON payload changed accidentally.

## Browser shows stale UI

Restart:

```bash
pnpm dev
```

Then hard-refresh the browser.
