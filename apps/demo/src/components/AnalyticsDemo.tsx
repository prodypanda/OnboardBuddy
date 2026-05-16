"use client";

import { RestartTourButton } from "@/components/RestartTourButton";
import { sellerTour } from "@/lib/tours";
import {
  OnboardBuddyProvider,
  useOnboardBuddyAnalytics,
  type BuddyAnalyticsAdapter,
  type BuddyAnalyticsEvent
} from "@prodypanda/onboardbuddy";
import Link from "next/link";
import { useMemo, useState } from "react";

const analyticsTour = {
  ...sellerTour,
  id: "seller-dashboard-analytics",
  autoStart: false,
  completion: {
    strategy: "localStorage" as const,
    key: "onboardbuddy:seller-dashboard-analytics:v1"
  }
};

export function AnalyticsDemo() {
  const [mockUploads, setMockUploads] = useState<BuddyAnalyticsEvent[]>([]);
  const adapter = useMemo<BuddyAnalyticsAdapter>(
    () => ({
      flush: (events) => {
        setMockUploads((current) => [...current, ...events]);
      }
    }),
    []
  );

  return (
    <OnboardBuddyProvider
      tours={[analyticsTour]}
      analytics={{
        enabled: true,
        metadata: {
          accountType: "seller",
          demo: true
        },
        adapter
      }}
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
        <AnalyticsDashboard mockUploads={mockUploads} onClearUploads={() => setMockUploads([])} />
      </div>
    </OnboardBuddyProvider>
  );
}

function AnalyticsDashboard({
  mockUploads,
  onClearUploads
}: {
  mockUploads: BuddyAnalyticsEvent[];
  onClearUploads: () => void;
}) {
  const analytics = useOnboardBuddyAnalytics();
  const lastEvent = analytics.events.at(-1);

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Analytics preview</p>
          <h1>Tour event foundation</h1>
        </div>
        <div className="header-actions">
          <RestartTourButton tourId="seller-dashboard-analytics" />
          <button className="primary-button secondary-button" type="button" onClick={analytics.clear}>
            Clear local log
          </button>
        </div>
      </header>

      <section className="metrics-grid analytics-metrics">
        <Metric label="Local events" value={analytics.events.length.toString()} />
        <Metric label="Mock uploads" value={mockUploads.length.toString()} />
        <Metric label="Last event" value={formatEventType(lastEvent?.type)} />
        <Metric label="Source" value={lastEvent?.source ?? "local"} />
      </section>

      <section className="dashboard-grid">
        <div className="panel products-panel">
          <div className="panel-header">
            <div>
              <h2>Captured analytics events</h2>
              <p>Run the tour to capture started, step viewed, skipped, and completed events.</p>
            </div>
            <button type="button" onClick={() => void analytics.flush()}>
              Flush local log
            </button>
          </div>
          <AnalyticsTable events={analytics.events} />
        </div>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Mock upload sink</h2>
              <p>Represents a future paid analytics ingestion endpoint.</p>
            </div>
            <button type="button" onClick={onClearUploads}>
              Clear uploads
            </button>
          </div>
          <AnalyticsTable events={mockUploads} compact />
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="metric-card">
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

function AnalyticsTable({ events, compact = false }: { events: BuddyAnalyticsEvent[]; compact?: boolean }) {
  if (events.length === 0) {
    return <p className="muted">No analytics events yet. Restart the onboarding tour to generate events.</p>;
  }

  return (
    <table className={compact ? "compact-table" : undefined}>
      <thead>
        <tr>
          <th>Type</th>
          <th>Tour</th>
          {!compact ? <th>Step</th> : null}
          {!compact ? <th>Source</th> : null}
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={`${event.timestamp}-${event.type}-${event.stepId ?? "tour"}`}>
            <td>{event.type}</td>
            <td>{event.tourId}</td>
            {!compact ? <td>{event.stepId ?? "—"}</td> : null}
            {!compact ? <td>{event.source}</td> : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatEventType(type: BuddyAnalyticsEvent["type"] | undefined) {
  if (!type) {
    return "None";
  }

  return type.replace(/_/g, " ");
}
