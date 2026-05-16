import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="docs-page">
      <Link href="/">← Home</Link>
      <h1>OnboardBuddy docs</h1>
      <p>
        Wrap your app with <code>OnboardBuddyProvider</code>, pass tour config, and use{" "}
        <code>useOnboardBuddy</code> to start or reset tours.
      </p>
      <pre>{`<OnboardBuddyProvider tours={tours}>
  <App />
</OnboardBuddyProvider>`}</pre>
      <h2>Core concepts</h2>
      <ul>
        <li>
          <strong>target</strong>: CSS selector for the element being explained.
        </li>
        <li>
          <strong>pointerAnchor</strong>: where the character finger is inside the image.
        </li>
        <li>
          <strong>targetAnchor</strong>: where on the UI element the finger points.
        </li>
        <li>
          <strong>overlay</strong>: none, dim, spotlight, or blur.
        </li>
        <li>
          <strong>interaction</strong>: blocked, target, or all.
        </li>
      </ul>
    </main>
  );
}
