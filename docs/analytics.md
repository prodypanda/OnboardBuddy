# Analytics foundation

OnboardBuddy includes a lightweight analytics foundation for future SaaS reporting.

The MVP captures events in memory and lets apps provide adapter hooks. A paid SaaS version can replace the adapter with hosted ingestion.

## Enable analytics

```tsx
<OnboardBuddyProvider
  tours={[sellerTour]}
  analytics={{
    enabled: true,
    metadata: {
      accountType: "seller",
      plan: "demo"
    },
    adapter: {
      track: (event) => console.info("event", event),
      flush: async (events) => sendToAnalytics(events)
    }
  }}
>
  <App />
</OnboardBuddyProvider>
```

If `analytics` is provided, analytics are enabled by default. Use `enabled: false` to keep config in place while disabling capture.

## Events

The SDK captures:

| Event | When it fires |
| --- | --- |
| `tour_started` | A tour starts through auto-start, `start`, or `reset`. |
| `step_viewed` | The active step changes or first renders. |
| `tour_skipped` | The user skips/closes the active tour. |
| `tour_completed` | The user finishes the active tour. |

Shape:

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

## Inspect events in-app

```tsx
const analytics = useOnboardBuddyAnalytics()

return (
  <>
    <p>Events captured: {analytics.events.length}</p>
    <button onClick={analytics.clear}>Clear</button>
    <button onClick={() => void analytics.flush()}>Flush</button>
  </>
)
```

`flush()` calls the optional adapter `flush` hook with the current events, clears local memory, and resolves with the number of flushed events.

## Demo

Run the demo and open `/analytics`.

The page includes:

- a tour restart button
- local captured event count
- latest event type
- a mock upload sink populated when `analytics.flush()` calls the adapter

## SaaS path

Future hosted analytics can reuse the same event model and adapter boundary:

1. SDK signs events with a project key.
2. Adapter batches events to the OnboardBuddy API.
3. Backend stores normalized events.
4. Dashboard visualizes starts, completions, skips, per-step drop-off, and variants.
