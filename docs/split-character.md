# Split character and moving hand guide

OnboardBuddy can render a mascot as two layers:

1. A base body image.
2. A separate hand/arm image that rotates from a shoulder joint.

This gives the tour a more natural pointing motion without animating the entire character.

## Basic config

```ts
{
  id: "overview",
  target: "[data-tour-id='overview']",
  title: "Start with your store overview",
  body: "Track revenue, conversion, and active listings from the summary.",
  targetAnchor: "left-center",
  character: {
    type: "image",
    imageUrl: "/characters/split-character.svg",
    alt: "OnboardBuddy guide",
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
      shake: {
        enabled: true,
        degrees: 5,
        durationMs: 850
      }
    }
  }
}
```

## Coordinate model

All points can use pixels or percentages:

```ts
{ x: 42, y: 18 }
{ x: "58%", y: "47%" }
```

Percentages are usually better because the image can resize.

## Hand positioning

`hand.position` places the top-left corner of the hand image inside the body box.

Example:

```ts
position: { x: "58%", y: "47%" }
```

Means the hand image starts 58% from the left and 47% from the top of the character container.

## Shoulder pivot

`hand.shoulderPivot` becomes the CSS `transform-origin` for the hand layer.

Example:

```ts
shoulderPivot: { x: "12%", y: "58%" }
```

Means the hand rotates around a point near the left-middle of the hand image.

## Fingertip anchor

`hand.pointerAnchor` marks the fingertip inside the hand image. When this is set, OnboardBuddy uses it instead of the step-level `pointerAnchor` for automatic positioning.

Example:

```ts
pointerAnchor: { x: "95%", y: "18%" }
```

Means the fingertip is near the upper-right edge of the hand image.

## Resting angle and shake

`rotation` sets the hand's resting angle:

```ts
rotation: -10
```

`shake` controls the shoulder animation:

```ts
shake: {
  enabled: true,
  degrees: 5,
  durationMs: 850
}
```

Set `enabled: false` to keep the separate hand visible but still.

## Calibration workflow

1. Open `/editor`.
2. Select the target step.
3. Enter the body and hand image URLs.
4. Tune hand position and size until the hand attaches to the shoulder.
5. Tune `shoulderPivot` until rotation feels natural.
6. Tune `pointerAnchor` until the fingertip points to the target.
7. Tune `rotation` and shake timing.
8. Restart the preview after each major change.
9. Copy the JSON output into your tour config.

## Asset tips

- Export body and hand images with transparent backgrounds.
- Keep the hand image tightly cropped around the arm/hand.
- Put the shoulder end of the hand image near one edge so `shoulderPivot` is easy to reason about.
- Prefer SVG or high-resolution PNG assets for crisp scaling.
- Use descriptive `alt` text when the image conveys meaningful identity; use an empty alt for purely decorative hand layers.
