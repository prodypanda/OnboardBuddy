# OnboardBuddy architecture

## Product

OnboardBuddy is a character-guided onboarding tour system for React and Next.js apps. It uses a configurable character image or built-in SVG guide to point at real UI elements during onboarding.

## Monorepo

```txt
apps/demo        Next.js seller marketplace demo
apps/dashboard   Future SaaS dashboard placeholder
packages/react   Reusable React package
docs             Architecture and roadmap
```

## Core package responsibilities

- Provider and hook API
- Tour state machine
- Target element lookup by CSS selector
- Pointer anchor and target anchor positioning
- Split character body/hand layers with shoulder-pivot animation
- Overlay rendering
- Character rendering
- Animations
- Completion persistence
- Basic event callbacks
- Optional remote-config loading with fallback tours
- Responsive fallback behavior

## MVP API

```tsx
<OnboardBuddyProvider tours={tours}>
  <App />
</OnboardBuddyProvider>
```

```tsx
const buddy = useOnboardBuddy()
buddy.start("seller-dashboard")
buddy.reset("seller-dashboard")
```

## Remote config API

The package supports an SDK-ready remote config shape while the MVP uses local/mock JSON:

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

Remote payloads can be either:

```json
[{ "id": "seller-dashboard", "steps": [] }]
```

or:

```json
{ "tours": [{ "id": "seller-dashboard", "steps": [] }] }
```

If loading fails, the SDK uses `fallbackTours`. Later, `projectKey` can map to a paid SaaS project and `configUrl` can point to the hosted OnboardBuddy API.

## Tour step model

```ts
{
  id: "products",
  target: "[data-tour-id='products-table']",
  title: "Manage products",
  body: "Add, edit, and publish marketplace products.",
  character: { type: "builtin" },
  pointerAnchor: { x: "82%", y: "40%" },
  targetAnchor: "left-center",
  offset: { x: 12, y: -8 },
  overlay: "spotlight",
  animation: "wiggle",
  interaction: "blocked"
}
```

## Split character hand model

For more natural mascot motion, `character.hand` can layer a separate hand/arm image over the body image:

```ts
{
  character: {
    type: "image",
    imageUrl: "/characters/split-character.svg",
    width: 220,
    height: 220,
    hand: {
      imageUrl: "/characters/split-hand.svg",
      width: 132,
      height: 76,
      position: { x: "58%", y: "47%" },
      shoulderPivot: { x: "12%", y: "58%" },
      pointerAnchor: { x: "95%", y: "18%" },
      rotation: -10,
      shake: { degrees: 5, durationMs: 850 }
    }
  }
}
```

`position` places the hand layer inside the character box. `width` and `height` size it independently from the body image. `shoulderPivot` becomes the CSS transform origin, so shake animation rotates from the shoulder joint instead of moving the whole mascot. `pointerAnchor` marks the fingertip inside the hand image and overrides the step-level pointer anchor for target alignment. `rotation` sets the resting angle, while `shake.enabled`, `shake.degrees`, and `shake.durationMs` control whether the hand moves, how far it rotates, and how quickly it loops.

## Free vs paid direction

Free/core:

- Local config
- Basic tours
- Built-in character
- Custom image URL
- Split character and moving hand image layers
- Basic overlays and animations
- localStorage completion
- Manual start/reset
- Basic event callbacks

Paid later:

- Remote config
- Analytics upload
- White-label/custom branding controls
- A/B testing
- Versioning
- Project keys
- Visual builder
- Hosted publishing
