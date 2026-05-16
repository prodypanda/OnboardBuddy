import { DemoShell } from "@/components/DemoShell";
import { RestartTourButton } from "@/components/RestartTourButton";
import { defaultTours } from "@/lib/tours";

const products = [
  ["Wireless Headphones", "Live", "$89.00", "142"],
  ["Minimal Desk Lamp", "Draft", "$42.00", "18"],
  ["Travel Backpack", "Live", "$118.00", "64"],
  ["Ceramic Coffee Set", "Review", "$36.00", "27"]
];

export default function SellerPage() {
  return (
    <DemoShell tours={defaultTours}>
      <main className="dashboard">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Seller marketplace</p>
            <h1>Store dashboard</h1>
          </div>
          <div className="header-actions">
            <RestartTourButton tourId="seller-dashboard" />
            <button data-tour-id="add-product" className="primary-button" type="button">
              Add product
            </button>
          </div>
        </header>

        <section data-tour-id="overview" className="metrics-grid">
          <Metric label="Revenue" value="$24,890" trend="+18.2%" />
          <Metric label="Orders" value="1,284" trend="+9.4%" />
          <Metric label="Conversion" value="6.8%" trend="+2.1%" />
          <Metric label="Live listings" value="92" trend="+11" />
        </section>

        <section className="dashboard-grid">
          <div data-tour-id="products-table" className="panel products-panel">
            <div className="panel-header">
              <div>
                <h2>Product listings</h2>
                <p>Manage inventory, pricing, and publishing state.</p>
              </div>
              <button type="button">Export</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map(([name, status, price, stock]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>
                      <span className={`status status-${status.toLowerCase()}`}>{status}</span>
                    </td>
                    <td>{price}</td>
                    <td>{stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="stack">
            <section data-tour-id="orders" className="panel">
              <h2>Orders queue</h2>
              <p className="muted">12 new orders need fulfillment today.</p>
              <div className="progress-bar">
                <span style={{ width: "72%" }} />
              </div>
              <button type="button">View orders</button>
            </section>
            <section data-tour-id="settings" className="panel">
              <h2>Store settings</h2>
              <p className="muted">Payout, shipping, taxes, and public profile settings.</p>
              <button type="button">Open settings</button>
            </section>
          </div>
        </section>
      </main>
    </DemoShell>
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
