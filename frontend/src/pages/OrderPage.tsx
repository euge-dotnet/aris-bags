import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { api, type Order } from "../lib/api";
import { bagById } from "../lib/bagColors";
import { formatPrice } from "../lib/format";

export function OrderPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;
    const email = params.get("email") ?? "";
    api<Order>(`/api/orders/${id}?email=${encodeURIComponent(email)}`)
      .then(setOrder)
      .catch(() => setOrder(null));
  }, [id, params]);

  if (!order) {
    return (
      <main className="page">
        <div className="container">
          <h1 className="page-title">Pedido</h1>
          <p className="muted">No encontramos ese pedido con el email indicado.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container narrow">
        <p className="eyebrow">Pedido {order.status}</p>
        <h1 className="page-title">Gracias, {order.customerName}</h1>
        <p className="muted">Guardamos el pedido {order.id}. Te vamos a contactar para coordinar.</p>
        <ul className="cart-list">
          {order.items.map((item) => (
            <li key={item.id}>
              {item.productName} × {item.quantity}
              {item.bagColor ? ` · ${bagById(item.bagColor).label}` : ""}
              {item.drawingUrl ? " · con dibujo" : ""} — {formatPrice(item.subtotal)}
            </li>
          ))}
        </ul>
        <p>Envío {formatPrice(order.shippingCost)}</p>
        <p className="price">Total {formatPrice(order.total)}</p>
      </div>
    </main>
  );
}
