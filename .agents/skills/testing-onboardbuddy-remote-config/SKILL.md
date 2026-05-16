---
name: testing-onboardbuddy-remote-config
description: Test the OnboardBuddy Next.js demo remote-config onboarding flow end-to-end. Use when verifying remote tour loading, reload behavior, or provider-shared remote config state.
---

# Testing OnboardBuddy Remote Config

## Devin Secrets Needed

- None required for local runtime testing.
- `GITHUB_ONBOARDBUDDY_PUSH_TOKEN` is only needed when pushing branches or updating PRs.

## Local Setup

1. From the repo root, install dependencies if needed:
   ```bash
   pnpm install
   ```
2. Run validation before browser testing:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm build
   ```
3. Start the demo app:
   ```bash
   pnpm dev
   ```
4. Open `http://localhost:3000/remote-config`.

## Important Testing Notes

- Restart `pnpm dev` after pulling remote-config/provider changes. A stale Next.js dev server might keep serving old code and make the status panel appear stuck at `fallback` / `Loading`.
- The remote-config page auto-starts the tour because the mock JSON has `autoStart: true`. The active tour overlay intentionally blocks background controls, including `Reload mock config`.
- To test reload through the UI, first click `Skip` on the auto-started tour, then click `Reload mock config`, then click `Restart onboarding`.
- The mock remote JSON is served at `/tours/seller-dashboard.remote.json`; it should load tour id `seller-dashboard-remote` with 3 steps.

## Core E2E Flow

1. Visit `http://localhost:3000/remote-config`.
2. Verify the status panel shows:
   - `Source` = `remote`
   - `Status` = `Ready`
   - `Tours loaded` = `1`
3. Verify the auto-started tour shows:
   - title `Remote config: overview`
   - step count `1/3`
   - body text containing `This step was loaded from a mock hosted JSON file`
4. Click `Skip` and verify the tour closes while status remains `remote / Ready / 1`.
5. Click `Reload mock config` and verify status remains `remote / Ready / 1`.
6. Click `Restart onboarding` and verify the overview step reopens with remote copy and `1/3`.
7. Click `Next` and verify the second step shows:
   - title `Remote config: listings`
   - step count `2/3`
   - body text containing `Product teams could later publish this copy`
8. Click `Next` and verify the final step shows:
   - title `Remote config: settings`
   - step count `3/3`
   - body text containing `The SDK falls back to local tours if remote loading fails`
9. Click `Finish` and verify the tour closes while status remains `remote / Ready / 1`.

## Recording Guidance

- Record browser testing for this flow.
- Annotate the recording at these points:
  - remote status ready
  - overview step visible
  - skip closes overlay
  - reload keeps remote-ready status
  - listings step `2/3`
  - settings step `3/3`
  - finish closes tour
