import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Order } from "../../lib/api";
import { formatPrice } from "../../lib/format";

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api<Order[]>("/api/admin/orders").then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <div>
      <p className="eyebrow">Tienda</p>
      <h1 className="page-title">Pedidos</h1>
      <div className="table-wrap admin-panel">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.customerName}</td>
                <td>
                  <span className="admin-pill">{order.status}</span>
                </td>
                <td>{formatPrice(order.total)}</td>
                <td>
                  <Link className="admin-row-link" to={`/admin/pedidos/${order.id}`}>
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
