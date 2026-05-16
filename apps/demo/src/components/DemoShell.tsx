"use client";

import { OnboardBuddyProvider } from "@onboardbuddy/react";
import type { BuddyTour } from "@onboardbuddy/react";
import Link from "next/link";
import type { ReactNode } from "react";

export function DemoShell({ children, tours }: { children: ReactNode; tours: BuddyTour[] }) {
  return (
    <OnboardBuddyProvider
      tours={tours}
      onComplete={(tour) => console.info("OnboardBuddy completed", tour.id)}
      onSkip={(tour, step) => console.info("OnboardBuddy skipped", tour.id, step.id)}
      onStart={(tour) => console.info("OnboardBuddy started", tour.id)}
      onStepView={(tour, step) => console.info("OnboardBuddy viewed", tour.id, step.id)}
    >
      <div className="app-frame">
        <aside className="sidebar">
          <Link className="brand" href="/">
            <span>OB</span>
            OnboardBuddy
          </Link>
          <nav>
            <Link href="/seller">Seller demo</Link>
            <Link href="/remote-config">Remote config</Link>
            <Link href="/analytics">Analytics</Link>
            <Link href="/editor">Editor preview</Link>
            <Link href="/docs">Docs</Link>
          </nav>
        </aside>
        {children}
      </div>
    </OnboardBuddyProvider>
  );
}
