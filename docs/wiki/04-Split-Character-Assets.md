# Split character assets

OnboardBuddy can animate a mascot with two separate image layers:

1. Body image.
2. Hand/arm image.

The body stays stable while the hand rotates from a shoulder pivot.

## Why split the hand?

A single full-body image can wiggle or bounce, but it cannot naturally point with only the arm moving.

The split model makes it possible to:

- keep the character body readable and still
- shake only the pointing arm
- rotate from a shoulder joint
- align the fingertip to UI elements
- reuse the same body with different hand poses later

## Asset requirements

Create or export two separate assets:

| Asset | Requirement |
| --- | --- |
| Body | Character without the moving hand attached. |
| Hand | Shoulder/arm/hand/finger as a separate image. |

Recommended formats:

- SVG for clean vector mascots.
- PNG with transparent background for generated art.

If the generator gives a white background, remove it after generation and export transparent PNGs.

## Generation prompt

Use this prompt as a starting point for a panda merchant mascot:

```text
Create a high-quality 2D character asset sheet for a React onboarding mascot named OnboardBuddy.

Character concept: a cute IT merchant panda cardboard cutout mascot. The panda should look friendly, smart, trustworthy, and playful. He is an ecommerce/marketplace seller assistant: wearing a small merchant apron or vest, a tiny headset microphone, and subtle tech details like a laptop badge, store icon, or small code/analytics symbols on accessories. The visual style should be bright, glossy, colorful, rounded, and polished like a premium casual mobile puzzle game mascot, with thick clean outlines, soft gradients, expressive eyes, and a cheerful commercial illustration look.

IMPORTANT asset layout: generate this as a character sheet with TWO SEPARATE SPRITES on the same white background:

1. BODY SPRITE:
- Full panda body without the pointing arm attached.
- The body should have a visible shoulder area/socket where the separate arm will later rotate from.
- Pose should be stable, front-facing 3/4 view, standing like a cardboard mascot.
- Body must look complete enough for onboarding UI, but leave the pointing arm detached for animation.

2. SEPARATE ARM/HAND SPRITE:
- Place a detached arm and hand beside the body with a clear white gap between them.
- The separate arm should include the shoulder joint, upper arm, forearm, hand, and extended index finger.
- The index finger should point clearly to the right and slightly upward, like it is pointing at a UI element.
- Make the shoulder joint/pivot area rounded and visually clear so it can rotate from the shoulder later.
- The fingertip must be clear and easy to identify for pointer alignment.
- The arm must match the panda body’s style, scale, colors, lighting, and outline thickness.

Background and extraction requirements:
- Pure white background only.
- No scenery, no UI, no text, no logo, no watermark.
- Do not let the body and arm touch or overlap.
- Use clean edges so the white background can be removed later.
- Keep both sprites fully visible with padding around them.

Final output should look like a professional game mascot asset sheet ready to crop into two PNG layers: panda-body.png and panda-hand.png.
```

Negative prompt:

```text
No realistic photo, no 3D render, no dark background, no busy background, no attached pointing arm, no overlapping body and hand, no extra fingers, no missing fingers, no deformed hand, no text, no watermark, no logo, no cropped parts, no scenery, no UI screenshot, no low-resolution pixel art.
```

## Cropping workflow

1. Generate the asset sheet.
2. Crop the body into `panda-body.png`.
3. Crop the hand/arm into `panda-hand.png`.
4. Remove the white background from both files.
5. Keep transparent padding only where useful for alignment.
6. Export both images at high resolution.
7. Put them in the app public folder, for example:

```txt
apps/demo/public/characters/panda-body.png
apps/demo/public/characters/panda-hand.png
```

## Config example

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

## Field meanings

| Field | Meaning |
| --- | --- |
| `imageUrl` | Body image URL. |
| `hand.imageUrl` | Hand/arm image URL. |
| `width` / `height` | Body container size. |
| `hand.width` / `hand.height` | Hand layer size. |
| `hand.position` | Top-left location of the hand inside the body container. |
| `hand.shoulderPivot` | CSS transform origin used as the shoulder joint. |
| `hand.pointerAnchor` | Fingertip point inside the hand image. |
| `hand.rotation` | Resting angle before shake. |
| `hand.shake.enabled` | Whether the hand shakes. |
| `hand.shake.degrees` | Rotation amount in each direction. |
| `hand.shake.durationMs` | Shake loop duration. |

## Calibration workflow

Use `/editor`:

1. Skip any active overlay if the preview tour auto-starts.
2. Select the step you want to tune.
3. Set body and hand image URLs.
4. Adjust hand width and height.
5. Adjust hand X/Y until the shoulder connects visually to the body.
6. Adjust shoulder pivot until the arm rotates naturally.
7. Adjust fingertip X/Y until it points to the target element.
8. Adjust base rotation.
9. Adjust shake degrees and duration.
10. Restart preview and repeat until alignment looks right.
11. Copy the JSON into code or remote config.

## Tips

- Keep the hand image tightly cropped around the arm and finger.
- Put the shoulder end near one edge of the hand image.
- Use percentage points for anchors.
- Use a small shake range, usually `4` to `9` degrees.
- If the hand looks detached, tune `hand.position` before tuning `shoulderPivot`.
- If the fingertip misses the target, tune `hand.pointerAnchor` before using `offset`.
- Use `shake.enabled: false` for static poses.
