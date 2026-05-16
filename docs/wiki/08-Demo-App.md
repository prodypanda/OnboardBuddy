# Demo app

The demo app proves the package works in a realistic Next.js marketplace dashboard.

Run:

```bash
pnpm dev
```

## Routes

| Route | What it demonstrates |
| --- | --- |
| `/` | Landing page and navigation. |
| `/seller` | Main seller dashboard onboarding. |
| `/editor` | Tour config editing and preview. |
| `/remote-config` | Mock hosted config loading. |
| `/analytics` | Event capture and mock flush. |
| `/docs` | In-app docs page. |

## `/seller`

The seller demo is the core MVP scenario.

It includes a marketplace dashboard with:

- overview metrics
- products/listings table
- add product action
- orders panel
- store settings/profile area

The onboarding tour has five steps and uses the split character body/hand mascot on key steps.

Expected behavior:

- first step title: `Start with your store overview`
- count: `1/5`
- body image visible
- hand image visible
- hand has shake animation
- spotlight overlay highlights the target

## `/editor`

The editor is a preview of the future SaaS visual builder.

It includes:

- JSON textarea
- form editor
- step selection
- target/overlay/animation controls
- split-hand calibration fields
- preview restart

Use it to tune body and hand image values before copying JSON into a tour config.

## `/remote-config`

This page wraps the demo in `remoteConfig` mode and fetches mock JSON from the public folder.

Expected status:

- source: `remote`
- status: `Ready`
- tours loaded: `1`

Reload should keep state in sync with the provider.

## `/analytics`

This page enables analytics and exposes the local event log.

It shows:

- local captured event count
- latest event
- clear button
- flush button
- mock uploads

It is intentionally local/mock only. The SaaS backend is future work.

## `/docs`

This page gives in-app documentation for:

- quick start
- split character and moving hand
- remote config
- analytics

It helps users understand the product without leaving the demo.

## Demo assets

Current demo split character assets live in:

```txt
apps/demo/public/characters/split-character.svg
apps/demo/public/characters/split-hand.svg
```

Remote config mock payload:

```txt
apps/demo/public/tours/seller-dashboard.remote.json
```

Tour config:

```txt
apps/demo/src/lib/tours.ts
```
