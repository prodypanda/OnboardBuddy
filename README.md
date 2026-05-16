# OnboardBuddy

OnboardBuddy is a React/Next.js character-guided onboarding tour system.

It lets product teams guide users through an app with a cartoon-style character that points at real UI elements, supports separate character/hand image layers, configurable overlays, animations, first-time completion tracking, and future SaaS-powered remote configuration.

## Workspace

```txt
apps/demo                       Next.js seller marketplace demo
apps/demo/remote-config          Mock hosted-config demo
apps/dashboard                  Future SaaS dashboard placeholder
packages/react                  Reusable React package
docs                            Architecture, API, and roadmap notes
```

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

`pnpm lint` currently runs TypeScript validation in each workspace. Full ESLint rules can be added once the project chooses a stable Next/ESLint configuration.

## MVP status

The first MVP focuses on local React configuration, a realistic seller dashboard demo, mock remote-config loading, and an editor-like JSON/form preview. SaaS publishing, auth, billing, and hosted analytics are planned for later.

## Remote config preview

The SDK can be prepared for future hosted publishing without building the SaaS backend yet:

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

The demo loads a mock hosted config from `apps/demo/public/tours/seller-dashboard.remote.json`.

## Split character + moving hand

Character steps can use one base image plus a separate hand/arm image. The hand layer rotates from a configurable `shoulderPivot`, while `pointerAnchor` defines the fingertip used for target alignment:

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

This keeps the body still while the hand slightly shakes from the shoulder joint.

Hand calibration fields:

- `position`: places the hand layer inside the character box.
- `width` / `height`: size the hand image independently from the body image.
- `shoulderPivot`: sets the CSS transform origin for the hand layer.
- `pointerAnchor`: marks the fingertip inside the hand image for target alignment.
- `rotation`: sets the hand's resting angle before shake is applied.
- `shake.enabled`: disables hand shaking for still poses when set to `false`.
- `shake.degrees`: controls how far the hand rotates in each direction.
- `shake.durationMs`: controls the speed of the shake cycle.
