# Editor guide

The editor route is the MVP prototype for a future visual SaaS dashboard.

Open:

```txt
/editor
```

It provides:

- a form editor
- a JSON textarea
- live validation
- preview restart
- split-hand calibration fields

## Important behavior

The editor can auto-start a preview tour. When the overlay is active, it blocks background form controls.

If you need to edit fields:

1. Click Skip on the active tour.
2. Edit the form or JSON.
3. Restart the preview.

## Recommended workflow

1. Open `/editor`.
2. Skip the auto-started preview if it is active.
3. Choose the step to edit.
4. Change basic content fields:
   - title
   - body
   - target selector
5. Change visual fields:
   - overlay
   - animation
   - target anchor
   - offset
6. Change character fields:
   - body image URL
   - hand image URL
   - hand position
   - hand size
   - shoulder pivot
   - fingertip anchor
   - base rotation
   - shake enabled/degrees/duration
7. Confirm JSON mirrors the form values.
8. Restart preview.
9. Copy JSON when satisfied.

## Form to JSON mirroring

The editor is designed so form edits update the JSON config.

Use this to learn the real config shape instead of writing every field manually.

For example, changing:

- Hand X to `50%`
- Hand Y to `40%`
- Hand width to `150`
- Hand height to `90`
- Shoulder pivot X to `30%`
- Fingertip X to `80%`
- Base rotation to `20`
- Shake degrees to `9`
- Shake duration to `1200`

should create matching values in the JSON textarea.

## JSON validation

If the JSON is invalid:

- the editor should show an error
- the current valid preview config should remain usable

Fix JSON syntax before restarting preview.

## Preview restart

Use preview restart after major changes because the active tour state may already be positioned using older values.

Recommended cycle:

1. Edit.
2. Check JSON.
3. Restart preview.
4. Inspect rendered position.
5. Repeat.

## What to tune first

For split characters:

1. Body size.
2. Hand size.
3. Hand position.
4. Shoulder pivot.
5. Fingertip anchor.
6. Resting rotation.
7. Shake degrees/duration.
8. Optional step offset.

Do not start with offset. Offset should be the final small correction.

## Future editor improvements

Planned:

- drag handles for shoulder pivot
- drag handles for fingertip anchor
- visual body/hand crop preview
- target selector picker
- import/export JSON
- project-based tour library
- publishing to hosted remote config
