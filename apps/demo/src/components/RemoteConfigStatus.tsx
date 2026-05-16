"use client";

import { useOnboardBuddyRemoteConfig } from "@prodypanda/onboardbuddy";

export function RemoteConfigStatus() {
  const remote = useOnboardBuddyRemoteConfig();

  return (
    <section className="remote-status panel">
      <div>
        <p className="eyebrow">Mock remote config</p>
        <h2>SDK-ready hosted tour loading</h2>
      </div>
      <dl>
        <div>
          <dt>Source</dt>
          <dd>{remote.source}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{remote.loading ? "Loading" : "Ready"}</dd>
        </div>
        <div>
          <dt>Tours loaded</dt>
          <dd>{remote.tours.length}</dd>
        </div>
      </dl>
      {remote.error ? <p className="error">{remote.error.message}</p> : null}
      <button type="button" onClick={() => void remote.reload()}>
        Reload mock config
      </button>
    </section>
  );
}
