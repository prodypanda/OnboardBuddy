import { RemoteConfigStatus } from "@/components/RemoteConfigStatus";
import { RemoteDemoShell } from "@/components/RemoteDemoShell";
import { RestartTourButton } from "@/components/RestartTourButton";
import { sellerTour } from "@/lib/tours";
import type { BuddyRemoteConfig } from "@onboardbuddy/react";

const remoteConfig: BuddyRemoteConfig = {
  projectKey: "demo_marketplace",
  configUrl: "/tours/seller-dashboard.remote.json",
  fallbackTours: [sellerTour]
};

export default function RemoteConfigPage() {
  return (
    <RemoteDemoShell remoteConfig={remoteConfig}>
      <main className="dashboard">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Remote config preview</p>
            <h1>Hosted-tour SDK path</h1>
          </div>
          <div className="header-actions">
            <RestartTourButton tourId="seller-dashboard-remote" />
          </div>
        </header>

        <RemoteConfigStatus remoteConfig={remoteConfig} />

        <section data-tour-id="overview" className="metrics-grid remote-metrics">
          <Metric label="Remote status" value="Ready" trend="JSON loaded" />
          <Metric label="Project key" value="demo" trend="mock SaaS" />
          <Metric label="Fallback" value="Enabled" trend="local tours" />
          <Metric label="Tours" value="1" trend="3 steps" />
        </section>

        <section className="dashboard-grid">
          <div data-tour-id="products-table" className="panel products-panel">
            <div className="panel-header">
              <div>
                <h2>Remote-config tour targets</h2>
                <p>This page uses the same UI target model as the package API.</p>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>MVP behavior</th>
                  <th>Future SaaS behavior</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Config source</td>
                  <td>Static JSON</td>
                  <td>Hosted API</td>
                </tr>
                <tr>
                  <td>Project key</td>
                  <td>Mock query param</td>
                  <td>Paid SDK key</td>
                </tr>
                <tr>
                  <td>Fallback</td>
                  <td>Local tours</td>
                  <td>Cached safe config</td>
                </tr>
              </tbody>
            </table>
          </div>

          <section data-tour-id="settings" className="panel">
            <h2>Future publishing controls</h2>
            <p className="muted">
              Later this can connect to the SaaS dashboard for versioning, analytics upload, and
              A/B testing.
            </p>
            <button type="button">Open future settings</button>
          </section>
        </section>
      </main>
    </RemoteDemoShell>
  );
}

function Metric({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <article className="metric-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{trend}</span>
    </article>
  );
}
