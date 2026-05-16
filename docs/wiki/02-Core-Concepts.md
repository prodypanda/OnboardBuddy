# Core concepts

## Tour

A tour is a named onboarding flow.

```ts
{
  id: "seller-dashboard",
  autoStart: true,
  completion: { strategy: "localStorage" },
  steps: []
}
```

The tour id is used by:

- `buddy.start(tourId)`
- `buddy.reset(tourId)`
- localStorage completion keys
- analytics events
- future remote config publishing

## Step

A step explains one UI element.

```ts
{
  id: "products",
  target: "[data-tour-id='products-table']",
  title: "Manage products",
  body: "Add, edit, and publish marketplace products.",
  targetAnchor: "left-center",
  overlay: "spotlight"
}
```

Every step needs:

- `id`
- `target`
- `title`
- `body`

## Target

`target` is a CSS selector for the UI element the character should point at.

Recommended:

```tsx
<button data-tour-id="add-product">Add product</button>
```

```ts
target: "[data-tour-id='add-product']"
```

Avoid fragile selectors based on layout or generated class names.

## Target anchor

`targetAnchor` chooses the point on the UI element that the character should aim at.

Examples:

- `center`
- `top-center`
- `right-center`
- `bottom-center`
- `left-center`
- `top-left`
- `top-right`
- `bottom-left`
- `bottom-right`

Use the anchor closest to where the mascot should point.

## Pointer anchor

`pointerAnchor` marks the point inside the mascot image that should line up with the target anchor.

```ts
pointerAnchor: { x: "82%", y: "40%" }
```

For split characters, `character.hand.pointerAnchor` marks the fingertip inside the hand image and overrides the step-level pointer anchor.

## Character

A character can be:

1. Built-in placeholder.
2. Single image.
3. Split body image plus moving hand image.

Built-in:

```ts
character: { type: "builtin" }
```

Single image:

```ts
character: {
  type: "image",
  imageUrl: "/characters/guide.png",
  width: 220,
  height: 220
}
```

Split body and hand:

```ts
character: {
  type: "image",
  imageUrl: "/characters/panda-body.png",
  width: 220,
  height: 220,
  hand: {
    imageUrl: "/characters/panda-hand.png",
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

## Overlay

Overlay modes:

| Mode | Behavior |
| --- | --- |
| `none` | No page overlay. |
| `dim` | Dims the page. |
| `spotlight` | Dims the page and highlights the target area. |
| `blur` | Adds a stronger blurred/dimmed background. |

## Interaction

Interaction modes:

| Mode | Behavior |
| --- | --- |
| `blocked` | Blocks background page clicks while the tour is active. |
| `target` | Allows interaction with the highlighted target. |
| `all` | Allows page interaction while showing the tour. |

Use `blocked` for guided onboarding. Use `target` or `all` when the step asks the user to click something.

## Completion

The MVP supports localStorage completion:

```ts
completion: {
  strategy: "localStorage",
  key: "onboardbuddy:seller-dashboard:v1"
}
```

If no key is provided, the default key is based on the tour id.

Version the key when you want users to see the tour again after major changes.

## Provider

The provider owns tour state and renders the active tour.

```tsx
<OnboardBuddyProvider tours={tours}>
  <App />
</OnboardBuddyProvider>
```

It can also receive:

- event callbacks
- remote config
- analytics config

## Hooks

| Hook | Purpose |
| --- | --- |
| `useOnboardBuddy()` | Start, reset, skip, complete, next, and back. |
| `useOnboardBuddyRemoteConfig()` | Read remote loading state and reload config. |
| `useOnboardBuddyAnalytics()` | Inspect, clear, and flush captured events. |
