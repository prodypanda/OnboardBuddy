# Remote config guide

Remote config lets OnboardBuddy load tours from a URL while still supporting local fallback tours.

The MVP uses mock JSON in the demo. The API is shaped so a future SaaS dashboard can publish hosted tour config without changing the provider interface.

## Provider config

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

Fields:

| Field | Purpose |
| --- | --- |
| `projectKey` | Optional future SaaS project key. Added as a query param when loading config. |
| `configUrl` | URL to fetch. Relative URLs resolve against the app origin. |
| `fallbackTours` | Tours used before load and after failed loads. |
| `requestInit` | Optional `fetch` options. |

## Payload shape

Tour array:

```json
[
  {
    "id": "seller-dashboard",
    "autoStart": true,
    "steps": []
  }
]
```

Wrapped object:

```json
{
  "tours": [
    {
      "id": "seller-dashboard",
      "autoStart": true,
      "steps": []
    }
  ]
}
```

Each step must include at least:

```json
{
  "id": "overview",
  "target": "[data-tour-id='overview']",
  "title": "Overview",
  "body": "Track your store performance."
}
```

## Runtime status

```tsx
const remote = useOnboardBuddyRemoteConfig()
```

Use this to show loading state, errors, current source, and manual reload controls:

```tsx
<p>Source: {remote.source}</p>
<p>Status: {remote.loading ? "Loading" : remote.error ? "Error" : "Ready"}</p>
<button onClick={() => void remote.reload()}>Reload config</button>
```

## Failure behavior

If loading fails or the payload shape is invalid:

1. `remote.error` is set.
2. `remote.source` becomes `"fallback"`.
3. `remote.tours` becomes `fallbackTours` or an empty array.

This keeps the app usable if hosted config is unavailable.

## Demo

Run the demo and open `/remote-config`.

The mock config lives at:

```txt
apps/demo/public/tours/seller-dashboard.remote.json
```

The route shows provider-shared remote state and a reload button.
