import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="docs-page">
      <Link href="/">← Home</Link>
      <p className="eyebrow">Documentation</p>
      <h1>OnboardBuddy docs</h1>
      <p>
        OnboardBuddy is a React/Next.js onboarding system that renders a friendly character
        pointing at real UI elements. It supports local tours, mock remote config, split body/hand
        character animation, editor previewing, completion persistence, and analytics hooks.
      </p>

      <nav className="docs-links" aria-label="Documentation sections">
        <a href="#quick-start">Quick start</a>
        <a href="#tour-config">Tour config</a>
        <a href="#split-hand">Split hand</a>
        <a href="#remote-config">Remote config</a>
        <a href="#analytics">Analytics</a>
        <a href="#demo-routes">Demo routes</a>
      </nav>

      <section id="quick-start">
        <h2>Quick start</h2>
        <pre>{`import "@prodypanda/onboardbuddy/styles.css"
import { OnboardBuddyProvider, useOnboardBuddy } from "@prodypanda/onboardbuddy"

<OnboardBuddyProvider tours={tours}>
  <App />
</OnboardBuddyProvider>`}</pre>
        <p>
          Use <code>useOnboardBuddy()</code> anywhere inside the provider to start, reset, skip, or
          complete tours.
        </p>
      </section>

      <section id="tour-config">
        <h2>Tour config</h2>
        <pre>{`{
  id: "products",
  target: "[data-tour-id='products-table']",
  title: "Manage marketplace listings",
  body: "Review inventory, pricing, and publishing state.",
  character: { type: "builtin" },
  pointerAnchor: { x: "84%", y: "44%" },
  targetAnchor: "top-left",
  overlay: "spotlight",
  animation: "wiggle",
  interaction: "blocked",
  controls: { back: true, next: true, skip: true, stepCount: true }
}`}</pre>
        <ul>
          <li>
            <strong>target</strong>: CSS selector for the element being explained.
          </li>
          <li>
            <strong>pointerAnchor</strong>: finger point inside the character box.
          </li>
          <li>
            <strong>targetAnchor</strong>: point on the UI element the finger aims at.
          </li>
          <li>
            <strong>overlay</strong>: none, dim, spotlight, or blur.
          </li>
          <li>
            <strong>interaction</strong>: blocked, target, or all.
          </li>
        </ul>
      </section>

      <section id="split-hand">
        <h2>Split character + moving hand</h2>
        <p>
          For more natural mascot animation, use a base body image plus a separate hand image. The
          hand rotates from <code>shoulderPivot</code>, while <code>pointerAnchor</code> marks the
          fingertip used for target alignment.
        </p>
        <pre>{`character: {
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
    shake: { enabled: true, degrees: 5, durationMs: 850 }
  }
}`}</pre>
      </section>

      <section id="remote-config">
        <h2>Remote config</h2>
        <pre>{`<OnboardBuddyProvider
  remoteConfig={{
    projectKey: "demo_marketplace",
    configUrl: "/tours/seller-dashboard.remote.json",
    fallbackTours: [sellerTour]
  }}
>
  <App />
</OnboardBuddyProvider>`}</pre>
        <p>
          <code>useOnboardBuddyRemoteConfig()</code> exposes loaded tours, source, loading state,
          errors, and a reload helper.
        </p>
      </section>

      <section id="analytics">
        <h2>Analytics</h2>
        <pre>{`<OnboardBuddyProvider
  tours={tours}
  analytics={{
    enabled: true,
    metadata: { accountType: "seller" },
    adapter: {
      track: (event) => console.info(event),
      flush: async (events) => sendToAnalytics(events)
    }
  }}
>
  <App />
</OnboardBuddyProvider>`}</pre>
        <p>
          Captured events include <code>tour_started</code>, <code>step_viewed</code>,{" "}
          <code>tour_skipped</code>, and <code>tour_completed</code>. Use{" "}
          <code>useOnboardBuddyAnalytics()</code> to inspect, clear, or flush the local event log.
        </p>
      </section>

      <section id="demo-routes">
        <h2>Demo routes</h2>
        <ul>
          <li>
            <Link href="/seller">/seller</Link>: 5-step seller marketplace dashboard tour.
          </li>
          <li>
            <Link href="/remote-config">/remote-config</Link>: mock hosted config and reload state.
          </li>
          <li>
            <Link href="/analytics">/analytics</Link>: event capture and mock upload sink.
          </li>
          <li>
            <Link href="/editor">/editor</Link>: JSON + form editor with split-hand calibration.
          </li>
        </ul>
      </section>
    </main>
  );
}
