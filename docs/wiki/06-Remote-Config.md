# Remote config

Remote config is the path from local developer-defined tours to SaaS-published tours.

The MVP does not include a real backend. It uses mock JSON hosted from the demo public folder, while keeping the provider API ready for a future hosted OnboardBuddy config API.

## Provider setup

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

## Fields

| Field | Purpose |
| --- | --- |
| `projectKey` | Future SaaS project key. Also included in analytics events. |
| `configUrl` | URL to fetch tour JSON from. |
| `fallbackTours` | Local tours used before load or after failure. |
| `requestInit` | Optional fetch options. |

## Payload shapes

Array:

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

## Minimal step payload

```json
{
  "id": "overview",
  "target": "[data-tour-id='overview']",
  "title": "Overview",
  "body": "Track your store performance."
}
```

## Runtime state

Use:

```tsx
const remote = useOnboardBuddyRemoteConfig()
```

Returns:

| Field | Meaning |
| --- | --- |
| `tours` | Current loaded tours. |
| `source` | `"remote"` or `"fallback"`. |
| `loading` | Whether config is loading. |
| `error` | Last loading or validation error. |
| `reload()` | Refetch config. |

Example:

```tsx
<p>Source: {remote.source}</p>
<p>Status: {remote.loading ? "Loading" : remote.error ? "Error" : "Ready"}</p>
<button onClick={() => void remote.reload()}>Reload mock config</button>
```

## Failure behavior

If the remote fetch fails or returns invalid data:

1. `remote.error` is set.
2. `remote.source` becomes `"fallback"`.
3. `remote.tours` becomes `fallbackTours` or an empty array.

This prevents onboarding from breaking the host app.

## Demo

Open:

```txt
/remote-config
```

The mock payload is:

```txt
apps/demo/public/tours/seller-dashboard.remote.json
```

Expected behavior:

- source shows `remote`
- status shows `Ready`
- tours loaded shows `1`
- reload keeps provider-shared state in sync
- restarting the tour uses the remote-copy step titles

## Future SaaS flow

Later:

1. Dashboard saves tours to the OnboardBuddy API.
2. Project receives a `projectKey`.
3. SDK fetches published config by project key.
4. SDK falls back to cached/local config if hosted config fails.
5. Analytics events include `projectKey` and `source`.

Possible future provider shape:

```tsx
<OnboardBuddyProvider
  remoteConfig={{
    projectKey: "project_abc123",
    configUrl: "https://api.onboardbuddy.com/config/project_abc123",
    fallbackTours: [localSellerTour]
  }}
>
  <App />
</OnboardBuddyProvider>
```
