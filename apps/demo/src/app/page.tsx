import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home">
      <section>
        <p className="eyebrow">OnboardBuddy</p>
        <h1>Character-guided onboarding tours for React and Next.js.</h1>
        <p>
          Show a friendly guide that points at real UI elements, explains dashboard features, and
          adapts to mobile screens.
        </p>
        <div className="home-actions">
          <Link href="/seller">Open seller dashboard demo</Link>
          <Link href="/remote-config">Preview remote config</Link>
          <Link href="/analytics">Preview analytics events</Link>
          <Link href="/editor">Try JSON + form editor</Link>
          <Link href="/docs">Read docs</Link>
        </div>
      </section>
    </main>
  );
}
