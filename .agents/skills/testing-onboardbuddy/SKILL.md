---
name: testing-onboardbuddy
description: Test OnboardBuddy demo flows end-to-end. Use when verifying seller tours, remote config flows, editor preview behavior, or character/pointer rendering changes.
---

# OnboardBuddy Testing

## Devin Secrets Needed

- `GITHUB_ONBOARDBUDDY_PUSH_TOKEN`: only needed for GitHub push/comment operations; not needed for local runtime testing.

## Local setup

1. From the repo root, run `pnpm dev`.
2. Use the local URL printed by Next.js. If port `3000` is busy, Next.js may use another port such as `3001`.
3. Open the route under test in Chrome before starting assertions.
4. If the browser appears to serve stale UI after code changes, restart `pnpm dev` before continuing the recorded run.

## Visual tour testing checklist

- Maximize Chrome before recording.
- Start a screen recording for UI tests and annotate:
  - setup/navigation
  - each `It should ...` test start
  - consolidated pass/fail assertions
- Prefer browser/UI interactions for tour controls, editor fields, and restart buttons.
- Use console inspection only as supporting evidence for computed styles or DOM state that is hard to prove visually.
- Check browser console for runtime errors before reporting.

## Seller tour checks

For `/seller`:

1. Click `Restart onboarding` if the tour is not already active.
2. Verify the expected step title, step count, and highlighted target.
3. For character/pointer changes, confirm the visible mascot points toward the highlighted UI element.
4. For split character/hand changes, confirm:
   - body image and hand image both render
   - hand layer has the shake animation class when shake is enabled
   - body remains comparatively stable while hand rotates/shakes
   - fingertip remains aimed at the spotlighted target

## Editor preview checks

For `/editor`:

1. Confirm the selected step matches the feature under test.
2. Verify form fields mirror the JSON config values.
3. Change relevant fields through the form, not directly through the JSON textarea unless the test specifically targets JSON parsing.
4. Confirm each edited form value persists and the JSON editor mirrors the same value.
5. Click `Restart onboarding` and confirm the preview opens on the expected step title and step count.
6. Confirm the preview updates without breaking the tour.

For split hand configs, useful fields include:

- `Character image URL`
- `Moving hand image URL`
- `Hand X`
- `Hand Y`
- `Hand width`
- `Hand height`
- `Shoulder pivot X`
- `Shoulder pivot Y`
- `Fingertip X`
- `Fingertip Y`
- `Base rotation`
- `Shake enabled`
- `Shake degrees`
- `Shake duration ms`

When testing full hand calibration, use a distinctive set of values so old defaults are easy to detect, for example:

- `Hand X`: `50%`
- `Hand Y`: `40%`
- `Hand width`: `150`
- `Hand height`: `90`
- `Shoulder pivot X`: `30%`
- `Fingertip X`: `80%`
- `Base rotation`: `20`
- `Shake degrees`: `9`
- `Shake duration ms`: `1200`

After restarting onboarding, inspect the rendered hand layer if needed:

- find the `/characters/split-hand.svg` image
- confirm `obuddy-character-hand` is present
- confirm `obuddy-hand-shake` is present when shake is enabled
- confirm width/height match the edited fields
- confirm transform origin corresponds to shoulder pivot and hand size
- confirm CSS variables such as `--obuddy-hand-base-rotation`, `--obuddy-hand-shake-degrees`, and `--obuddy-hand-shake-duration` match the edited values

For shake-disable tests:

1. Click `Skip` to close any active tour overlay.
2. Uncheck `Shake enabled` in the editor.
3. Confirm JSON includes `enabled: false` under the hand shake config.
4. Click `Restart onboarding`.
5. Confirm the hand image still renders, `obuddy-hand-shake` is absent, and computed `animation-name` is `none`.

## Evidence and reporting

- Capture full-screen screenshots of key pass/fail states.
- Include screenshots of edited form values, live preview output, and any disabled/error state.
- Write a markdown test report with inline screenshots.
- When testing a PR, post one concise PR comment with escalations first, then pass/fail assertions and evidence.
- Attach the screen recording when the test involved browser interactions.
