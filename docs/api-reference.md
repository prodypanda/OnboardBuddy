# OnboardBuddy API reference

This document describes the public React package API exposed by `@prodypanda/onboardbuddy`.

## Installation

```bash
pnpm add @prodypanda/onboardbuddy
```

Import the package stylesheet once in your app shell:

```tsx
import "@prodypanda/onboardbuddy/styles.css"
```

## Provider

```tsx
<OnboardBuddyProvider tours={tours}>
  <App />
</OnboardBuddyProvider>
```

Use local tours:

```tsx
<OnboardBuddyProvider
  tours={[sellerTour]}
  onStart={(tour) => console.info("started", tour.id)}
  onStepView={(tour, step, index) => console.info("viewed", tour.id, step.id, index)}
  onSkip={(tour, step) => console.info("skipped", tour.id, step.id)}
  onComplete={(tour) => console.info("completed", tour.id)}
>
  <App />
</OnboardBuddyProvider>
```

Use remote config with local fallback tours:

```tsx
<OnboardBuddyProvider
  remoteConfig={{
    projectKey: "demo_marketplace",
    configUrl: "/tours/seller-dashboard.remote.json",
    fallbackTours: [sellerTour]
  }}
>
  <App />
</OnboardBuddyProvider>
```

Enable local analytics capture and optional upload hooks:

```tsx
<OnboardBuddyProvider
  tours={[sellerTour]}
  analytics={{
    enabled: true,
    metadata: { accountType: "seller" },
    adapter: {
      track: (event) => console.info(event),
      flush: async (events) => sendToAnalytics(events)
    }
  }}
>
  <App />
</OnboardBuddyProvider>
```

## `useOnboardBuddy()`

```tsx
const buddy = useOnboardBuddy()
```

Returns:

| Field | Type | Purpose |
| --- | --- | --- |
| `activeTourId` | `string \| null` | Current tour id, or `null` when closed. |
| `activeStepIndex` | `number` | Current zero-based step index. |
| `start(tourId)` | function | Starts a tour without clearing completion. |
| `reset(tourId)` | function | Clears completion and starts a tour. |
| `next()` | function | Advances one step or completes the tour on the last step. |
| `back()` | function | Moves one step back. |
| `skip()` | function | Skips and marks the tour complete. |
| `complete()` | function | Completes and closes the tour. |

## `useOnboardBuddyRemoteConfig()`

Use inside a provider that receives `remoteConfig`.

```tsx
const remote = useOnboardBuddyRemoteConfig()
```

Returns:

| Field | Type | Purpose |
| --- | --- | --- |
| `tours` | `BuddyTour[]` | Loaded remote or fallback tours. |
| `source` | `"remote" \| "fallback"` | Current config source. |
| `loading` | `boolean` | Whether config is loading. |
| `error` | `Error \| null` | Last load error. |
| `reload()` | `() => Promise<void>` | Reloads the config URL. |

Remote payloads can be either a tour array:

```json
[{ "id": "seller-dashboard", "steps": [] }]
```

or a wrapped object:

```json
{ "tours": [{ "id": "seller-dashboard", "steps": [] }] }
```

## `useOnboardBuddyAnalytics()`

Use inside a provider with `analytics` enabled.

```tsx
const analytics = useOnboardBuddyAnalytics()
```

Returns:

| Field | Type | Purpose |
| --- | --- | --- |
| `events` | `BuddyAnalyticsEvent[]` | Captured local event log. |
| `clear()` | function | Clears local captured events. |
| `flush()` | function | Calls the optional adapter `flush` hook, clears local events, and resolves the flushed count. |

## Tour config

```ts
type BuddyTour = {
  id: string
  autoStart?: boolean
  completion?: {
    strategy: "localStorage"
    key?: string
  }
  steps: BuddyStep[]
}
```

`autoStart` starts the tour on first load unless it is already completed. Completion currently uses `localStorage`; if no key is provided, OnboardBuddy uses `onboardbuddy:${tour.id}:completed`.

## Step config

```ts
type BuddyStep = {
  id: string
  target: string
  title: string
  body: string
  character?: BuddyCharacter
  pointerAnchor?: BuddyPoint
  targetAnchor?: BuddyAnchor
  offset?: { x?: number; y?: number }
  overlay?: BuddyOverlay
  animation?: BuddyAnimation
  controls?: BuddyStepControls
  interaction?: BuddyInteraction
}
```

| Field | Purpose |
| --- | --- |
| `target` | CSS selector for the UI element being explained. |
| `pointerAnchor` | Finger/pointer point inside the full character box. |
| `targetAnchor` | Point on the target element to aim at. |
| `offset` | Manual pixel offset after automatic positioning. |
| `overlay` | `"none"`, `"dim"`, `"spotlight"`, or `"blur"`. |
| `animation` | `"none"`, `"wiggle"`, `"bounce"`, or `"pulse"`. |
| `interaction` | `"blocked"`, `"target"`, or `"all"`. |
| `controls` | Per-step Back, Next, Skip, Finish, and count visibility. |

## Character config

Use the built-in placeholder:

```ts
character: { type: "builtin" }
```

Use a custom image:

```ts
character: {
  type: "image",
  imageUrl: "/characters/guide.svg",
  alt: "Marketplace guide",
  width: 220,
  height: 220
}
```

Use split body + moving hand:

```ts
character: {
  type: "image",
  imageUrl: "/characters/split-character.svg",
  width: 220,
  height: 220,
  hand: {
    imageUrl: "/characters/split-hand.svg",
    alt: "Pointing hand",
    width: 132,
    height: 76,
    position: { x: "58%", y: "47%" },
    shoulderPivot: { x: "12%", y: "58%" },
    pointerAnchor: { x: "95%", y: "18%" },
    rotation: -10,
    shake: { enabled: true, degrees: 5, durationMs: 850 }
  }
}
```

Hand fields:

| Field | Purpose |
| --- | --- |
| `position` | Places the hand layer inside the character box. |
| `width` / `height` | Sizes the hand independently from the body. |
| `shoulderPivot` | CSS transform origin for shoulder-joint rotation. |
| `pointerAnchor` | Fingertip point inside the hand image. Overrides step `pointerAnchor`. |
| `rotation` | Resting hand angle in degrees. |
| `shake.enabled` | Set `false` for still poses. |
| `shake.degrees` | Rotation range in each direction. |
| `shake.durationMs` | Animation duration. |

## Analytics events

```ts
type BuddyAnalyticsEvent = {
  type: "tour_started" | "step_viewed" | "tour_skipped" | "tour_completed"
  tourId: string
  stepId?: string
  stepIndex?: number
  stepCount: number
  source: "local" | "remote" | "fallback"
  projectKey?: string
  timestamp: string
  metadata?: Record<string, string | number | boolean | null>
}
```

`adapter.track` runs for every captured event. `adapter.flush` runs when app code calls `analytics.flush()`.
