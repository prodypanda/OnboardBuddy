# Tour configuration

This page is the practical reference for writing OnboardBuddy tour JSON/TypeScript.

## Tour object

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

Example:

```ts
export const sellerTour = {
  id: "seller-dashboard",
  autoStart: true,
  completion: {
    strategy: "localStorage",
    key: "onboardbuddy:seller-dashboard:v1"
  },
  steps: []
}
```

## Step object

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

Example:

```ts
{
  id: "orders",
  target: "[data-tour-id='orders-panel']",
  title: "Keep orders moving",
  body: "Review new orders, shipping status, and customer updates from here.",
  targetAnchor: "right-center",
  pointerAnchor: { x: "82%", y: "40%" },
  offset: { x: 12, y: -8 },
  overlay: "spotlight",
  animation: "wiggle",
  interaction: "blocked",
  controls: {
    back: true,
    next: true,
    skip: true,
    stepCount: true
  }
}
```

## Anchors

Supported anchors:

```ts
"top-left"
"top-center"
"top-right"
"right-center"
"bottom-right"
"bottom-center"
"bottom-left"
"left-center"
"center"
```

Use `targetAnchor` to pick where on the UI element the pointer should land.

Use `pointerAnchor` to pick where inside the character image the finger/pointer is located.

## Points

Points support pixels or percentages:

```ts
{ x: 42, y: 20 }
{ x: "82%", y: "40%" }
```

Percentages are preferred for image anchors because they keep working when the image is resized.

## Offset

`offset` applies a manual pixel adjustment after automatic anchor positioning:

```ts
offset: { x: 12, y: -8 }
```

Use offsets only after anchors are correct. Offsets are best for small polish adjustments.

## Overlay modes

```ts
overlay: "none" | "dim" | "spotlight" | "blur"
```

Recommended defaults:

- `spotlight` for feature walkthroughs.
- `dim` for simple contextual guidance.
- `blur` for strong focus moments.
- `none` when embedding the guide in a less blocking UI.

## Animation modes

```ts
animation: "none" | "wiggle" | "bounce" | "pulse"
```

These apply to the character container. Split-hand shake is configured separately on `character.hand.shake`.

## Interaction modes

```ts
interaction: "blocked" | "target" | "all"
```

| Mode | Use when |
| --- | --- |
| `blocked` | The user should focus only on tour controls. |
| `target` | The user should interact with the highlighted target. |
| `all` | The tour is informational and should not block the page. |

## Controls

```ts
controls: {
  back?: boolean
  next?: boolean
  skip?: boolean
  finish?: boolean
  stepCount?: boolean
}
```

Hide controls only when the step has another clear action.

## Built-in character

```ts
character: { type: "builtin" }
```

Use this during early prototyping when custom art is not ready.

## Image character

```ts
character: {
  type: "image",
  imageUrl: "/characters/guide.png",
  alt: "Onboarding guide",
  width: 220,
  height: 220
}
```

## Split image character

```ts
character: {
  type: "image",
  imageUrl: "/characters/panda-body.png",
  alt: "OnboardBuddy panda guide",
  width: 220,
  height: 220,
  hand: {
    imageUrl: "/characters/panda-hand.png",
    alt: "",
    width: 132,
    height: 76,
    position: { x: "58%", y: "47%" },
    shoulderPivot: { x: "12%", y: "58%" },
    pointerAnchor: { x: "95%", y: "18%" },
    rotation: -10,
    shake: {
      enabled: true,
      degrees: 5,
      durationMs: 850
    }
  }
}
```

See [Split character assets](04-Split-Character-Assets.md) for the full calibration workflow.

## Event callbacks

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

Callbacks are useful for local product logic. Use the analytics adapter when you want normalized event capture and upload.
