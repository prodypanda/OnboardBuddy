# @prodypanda/onboardbuddy

Character-guided onboarding tours for React and Next.js.

OnboardBuddy helps apps show friendly mascot-guided onboarding flows that point at real UI elements, with support for split body/hand character assets, shoulder-pivot hand shake, overlays, local completion, remote-config-ready loading, and analytics event hooks.

## Install

```bash
pnpm add @prodypanda/onboardbuddy
```

Import the stylesheet once:

```tsx
import "@prodypanda/onboardbuddy/styles.css"
```

## Quick start

```tsx
import { OnboardBuddyProvider } from "@prodypanda/onboardbuddy"
import "@prodypanda/onboardbuddy/styles.css"

const tours = [
  {
    id: "seller-dashboard",
    autoStart: true,
    completion: {
      strategy: "localStorage",
      key: "onboardbuddy:seller-dashboard:v1"
    },
    steps: [
      {
        id: "overview",
        target: "[data-tour-id='overview']",
        title: "Start with your store overview",
        body: "Track revenue, conversion, and active listings from the summary cards.",
        targetAnchor: "left-center",
        overlay: "spotlight",
        animation: "wiggle",
        interaction: "blocked"
      }
    ]
  }
]

export function App() {
  return (
    <OnboardBuddyProvider tours={tours}>
      <main>
        <section data-tour-id="overview">Store overview</section>
      </main>
    </OnboardBuddyProvider>
  )
}
```

## Manual controls

```tsx
import { useOnboardBuddy } from "@prodypanda/onboardbuddy"

function RestartTourButton() {
  const buddy = useOnboardBuddy()

  return (
    <button onClick={() => buddy.reset("seller-dashboard")}>
      Restart onboarding
    </button>
  )
}
```

## Split body + moving hand character

```ts
{
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
      shake: { enabled: true, degrees: 5, durationMs: 850 }
    }
  }
}
```

## Documentation

Full docs live in the repository:

- https://github.com/prodypanda/OnboardBuddy#readme
- https://github.com/prodypanda/OnboardBuddy/tree/main/docs/wiki
