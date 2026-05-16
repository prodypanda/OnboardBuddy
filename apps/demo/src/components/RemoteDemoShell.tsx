"use client";

import { OnboardBuddyProvider } from "@onboardbuddy/react";
import type { BuddyRemoteConfig } from "@onboardbuddy/react";
import Link from "next/link";
import type { ReactNode } from "react";

export function RemoteDemoShell({
  children,
  remoteConfig
}: {
  children: ReactNode;
  remoteConfig: BuddyRemoteConfig;
}) {
  return (
    <OnboardBuddyProvider
      remoteConfig={remoteConfig}
      onComplete={(tour) => console.info("Remote OnboardBuddy completed", tour.id)}
      onStart={(tour) => console.info("Remote OnboardBuddy started", tour.id)}
      onStepView={(tour, step) => console.info("Remote OnboardBuddy viewed", tour.id, step.id)}
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
            <Link href="/editor">Editor preview</Link>
            <Link href="/docs">Docs</Link>
          </nav>
        </aside>
        {children}
      </div>
    </OnboardBuddyProvider>
  );
}
