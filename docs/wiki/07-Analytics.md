# Analytics

OnboardBuddy includes a lightweight analytics foundation so the SDK can later power a SaaS analytics dashboard.

The MVP captures events locally in memory and optionally forwards them through adapter hooks.

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

If `analytics` is provided, analytics are enabled by default. Use `enabled: false` to keep config in place but stop capture.

## Events

| Event | When it fires |
| --- | --- |
| `tour_started` | A tour starts through auto-start, `start`, or `reset`. |
| `step_viewed` | The active step changes or first renders. |
| `tour_skipped` | The user skips or closes the active tour. |
| `tour_completed` | The user finishes the tour. |

## Event shape

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

## Local event log

Use:

```tsx
const analytics = useOnboardBuddyAnalytics()
```

Returns:

| Field | Purpose |
| --- | --- |
| `events` | Captured local event log. |
| `clear()` | Clears local events. |
| `flush()` | Calls adapter `flush`, clears flushed events, and returns flushed count. |

Example:

```tsx
function AnalyticsPanel() {
  const analytics = useOnboardBuddyAnalytics()

  return (
    <section>
      <p>Local events: {analytics.events.length}</p>
      <button onClick={analytics.clear}>Clear local log</button>
      <button onClick={() => void analytics.flush()}>Flush local log</button>
    </section>
  )
}
```

## Adapter hooks

`track` runs per event:

```ts
track: (event) => {
  console.info("captured", event)
}
```

`flush` runs when app code calls `analytics.flush()`:

```ts
flush: async (events) => {
  await fetch("/api/onboarding-events", {
    method: "POST",
    body: JSON.stringify({ events })
  })
}
```

The demo uses a mock flush sink to avoid duplicate uploads. It does not upload on both `track` and `flush`.

## Demo

Open:

```txt
/analytics
```

Suggested test:

1. Clear local state.
2. Restart tour.
3. Click Next once.
4. Click Skip.
5. Confirm local event count is at least four.
6. Click Flush local log.
7. Confirm local event count becomes zero.
8. Confirm mock uploads count equals the flushed count.
9. Confirm event types include `tour_started`, `step_viewed`, and `tour_skipped`.

## Future SaaS dashboard

The same event model can power:

- start rate
- completion rate
- skip rate
- per-step drop-off
- tour version comparison
- A/B test variants
- account/project-level reporting
- audience segmentation
