# OnboardBuddy

OnboardBuddy is a React and Next.js framework for building character-guided onboarding tours.

Instead of showing a normal tooltip, OnboardBuddy can show a friendly mascot that points at real UI elements, explains the current feature, and guides users step by step through a product.

The first product use case is a marketplace seller dashboard:

1. A seller opens the dashboard for the first time.
2. A cardboard-style panda guide appears.
3. The panda points at dashboard cards, products, orders, settings, and other UI.
4. The seller clicks Next, Back, Skip, or Finish.
5. Completion is saved locally in the MVP.
6. Future SaaS features can load tours remotely and show analytics.

## What the MVP includes

- Reusable React package in `packages/react`.
- Next.js demo app in `apps/demo`.
- Seller marketplace dashboard onboarding flow.
- 5-step character-guided tour.
- Built-in placeholder character.
- Custom image character support.
- Split body and moving hand support.
- Shoulder-pivot hand shake animation.
- Pointer and target anchor positioning.
- Dim, spotlight, blur, and no-overlay modes.
- Step interaction modes.
- localStorage completion tracking.
- Basic event callbacks.
- Mock remote-config loading.
- Analytics event foundation.
- JSON and form-based editor preview.
- Dashboard placeholder for future SaaS.

## Recommended reading order

1. [Getting started](01-Getting-Started.md)
2. [Core concepts](02-Core-Concepts.md)
3. [Tour configuration](03-Tour-Configuration.md)
4. [Split character assets](04-Split-Character-Assets.md)
5. [Editor guide](05-Editor-Guide.md)
6. [Remote config](06-Remote-Config.md)
7. [Analytics](07-Analytics.md)
8. [Demo app](08-Demo-App.md)
9. [Development](09-Development.md)
10. [Troubleshooting](10-Troubleshooting.md)
11. [Roadmap](11-Roadmap.md)

## Repository layout

```txt
apps/demo        Next.js reference app and seller marketplace demo
apps/dashboard   Placeholder for the future SaaS dashboard
packages/react   Reusable OnboardBuddy React package
docs             Architecture, API, feature guides, roadmap, and wiki
```

## Current status

OnboardBuddy is still an MVP. The core SDK and demo are working, but it is not yet a hosted SaaS product. The codebase is intentionally shaped so the same tour model can later power:

- hosted remote config
- visual tour builder
- analytics dashboard
- project keys
- versioning
- A/B testing
- segmentation
- billing
