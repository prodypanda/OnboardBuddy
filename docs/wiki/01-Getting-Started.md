# Getting started

This guide shows the fastest path to run OnboardBuddy locally and understand how an app uses it.

## Requirements

- Node.js compatible with Next.js 15.
- pnpm 9.x.

The repo declares:

```json
{
  "packageManager": "pnpm@9.15.1"
}
```

## Install dependencies

```bash
pnpm install
```

## Run the demo

```bash
pnpm dev
```

Open the URL printed by Next.js. If port `3000` is busy, Next.js may choose another port such as `3001` or `3002`.

## Demo routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page linking to all demo flows. |
| `/seller` | Main 5-step seller dashboard onboarding tour. |
| `/editor` | JSON and form editor preview for tour configuration. |
| `/remote-config` | Mock hosted-config loading and reload state. |
| `/analytics` | Local analytics event capture and mock upload flush. |
| `/docs` | In-app product documentation page. |

## Minimal app setup

Import the package CSS once in your app shell:

```tsx
import "@onboardbuddy/react/styles.css"
```

Wrap your app with the provider:

```tsx
import { OnboardBuddyProvider } from "@onboardbuddy/react"
import { tours } from "./tours"

export function App() {
  return (
    <OnboardBuddyProvider tours={tours}>
      <MarketplaceDashboard />
    </OnboardBuddyProvider>
  )
}
```

Add stable target selectors to your UI:

```tsx
<section data-tour-id="overview">
  <h2>Store overview</h2>
</section>
```

Create a tour:

```ts
export const sellerTour = {
  id: "seller-dashboard",
  autoStart: true,
  completion: {
    strategy: "localStorage",
    key: "onboardbuddy:seller-dashboard:v1"
  },
  steps: [
    {
      id: "overview",
      target: "[data-tour-id='overview']",
      title: "Start with your store overview",
      body: "Track revenue, conversion, and active listings from the summary cards.",
      targetAnchor: "left-center",
      overlay: "spotlight",
      animation: "wiggle",
      interaction: "blocked"
    }
  ]
}
```

Pass it to the provider:

```tsx
<OnboardBuddyProvider tours={[sellerTour]}>
  <MarketplaceDashboard />
</OnboardBuddyProvider>
```

## Manual restart

Use the hook when you want a button to restart onboarding:

```tsx
import { useOnboardBuddy } from "@onboardbuddy/react"

function RestartButton() {
  const buddy = useOnboardBuddy()

  return (
    <button onClick={() => buddy.reset("seller-dashboard")}>
      Restart onboarding
    </button>
  )
}
```

`reset()` clears completion and starts the tour. `start()` starts the tour without clearing completion.

## Verify the MVP locally

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Then manually verify:

1. `/seller` starts and finishes the 5-step tour.
2. `/editor` mirrors form edits into JSON and restarts preview.
3. `/remote-config` loads mock hosted JSON and reloads successfully.
4. `/analytics` captures events and flushes them to mock uploads.
5. `/docs` shows product documentation sections.
