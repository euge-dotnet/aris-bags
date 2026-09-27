import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { formatPrice } from "../../lib/format";

type Dashboard = {
  productCount: number;
  activeProducts: number;
  orderCount: number;
  pendingOrders: number;
  sales: number;
};

export function AdminDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    api<Dashboard>("/api/admin/dashboard").then(setData).catch(() => setData(null));
  }, []);

  if (!data) return <p className="muted">Cargando panel…</p>;

  const stats = [
    { label: "Productos", value: data.productCount },
    { label: "Activos", value: data.activeProducts },
    { label: "Pedidos", value: data.orderCount },
    { label: "Pendientes", value: data.pendingOrders },
    { label: "Ventas", value: formatPrice(data.sales) },
  ];

  return (
    <div>
      <p className="eyebrow">Resumen</p>
      <h1 className="page-title">Dashboard</h1>
      <p className="muted admin-lead">Un vistazo rápido al catálogo y a los pedidos.</p>
      <div className="stat-grid">
        {stats.map((stat) => (
          <article key={stat.label}>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}
