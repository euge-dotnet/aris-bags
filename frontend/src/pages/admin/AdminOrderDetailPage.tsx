import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, type Order } from "../../lib/api";
import { bagById } from "../../lib/bagColors";
import { formatPrice } from "../../lib/format";

const statuses = ["pending", "confirmed", "preparing", "shipped", "completed", "cancelled"];

export function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  async function load() {
    if (!id) return;
    setOrder(await api<Order>(`/api/admin/orders/${id}`));
  }

  useEffect(() => {
    load().catch(() => setOrder(null));
  }, [id]);

  async function changeStatus(status: string) {
    if (!id) return;
    setOrder(await api<Order>(`/api/admin/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }));
  }

  if (!order) return <p>Cargando pedido…</p>;

  return (
    <div>
      <h1 className="page-title">Pedido</h1>
      <p>{order.customerName} · {order.customerEmail} · {order.customerPhone}</p>
      <p className="muted">{order.shippingAddress}</p>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.productName} × {item.quantity}
            {item.bagColor ? ` · ${bagById(item.bagColor).label}` : ""}
            {item.drawingPublicId ? ` · ${item.drawingPublicId}` : ""} —{" "}
            {formatPrice(item.subtotal)}
          </li>
        ))}
      </ul>
      <p>Total {formatPrice(order.total)}</p>
      <label className="field">
        <span>Estado</span>
        <select value={order.status} onChange={(event) => changeStatus(event.target.value)}>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
