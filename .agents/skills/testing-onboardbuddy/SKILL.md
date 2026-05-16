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

## Visual tour testing checklist

- Maximize Chrome before recording.
- Start a screen recording for UI tests and annotate:
  - setup/navigation
  - each `It should ...` test start
  - consolidated pass/fail assertions
- Prefer browser/UI interactions for tour controls, editor fields, and restart buttons.
- Use console inspection only as supporting evidence for computed styles or DOM state that is hard to prove visually.

## Seller tour checks

For `/seller`:

1. Click `Restart onboarding` if the tour is not already active.
2. Verify the expected step title, step count, and highlighted target.
3. For character/pointer changes, confirm the visible mascot points toward the highlighted UI element.
4. For split character/hand changes, confirm:
   - body image and hand image both render
   - hand layer has the shake animation class
   - body remains comparatively stable while hand rotates/shakes
   - fingertip remains aimed at the spotlighted target

## Editor preview checks

For `/editor`:

1. Confirm the selected step matches the feature under test.
2. Verify form fields mirror the JSON config values.
3. Change one relevant field and restart onboarding.
4. Confirm the preview updates without breaking the tour.

For split hand configs, useful fields include:

- `Character image URL`
- `Moving hand image URL`
- `Shoulder X`
- `Shoulder Y`

## Evidence and reporting

- Capture full-screen screenshots of key pass/fail states.
- Check browser console for runtime errors before reporting.
- Write a markdown test report with inline screenshots.
- When testing a PR, post one concise PR comment with escalations first, then pass/fail assertions and evidence.
