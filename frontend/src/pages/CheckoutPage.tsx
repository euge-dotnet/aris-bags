import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { api, type Order } from "../lib/api";
import { bagById } from "../lib/bagColors";
import { formatPrice } from "../lib/format";

export function CheckoutPage() {
  const { lines, quote, error, clear } = useCart();
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitting(true);
    setFormError("");
    try {
      const order = await api<Order>("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          customerName: data.get("customerName"),
          customerEmail: data.get("customerEmail"),
          customerPhone: data.get("customerPhone"),
          shippingAddress: `${data.get("address")}, ${data.get("city")}`,
          deliveryMethod: data.get("deliveryMethod"),
          paymentMethod: data.get("paymentMethod"),
          notes: data.get("notes") || undefined,
          items: lines,
        }),
      });
      clear();
      navigate(`/pedido/${order.id}?email=${encodeURIComponent(order.customerEmail)}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo crear el pedido");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page">
      <div className="container checkout-grid">
        <form className="stack-form" onSubmit={onSubmit}>
          <p className="eyebrow">Checkout</p>
          <h1 className="page-title">Datos para el pedido</h1>
          <p className="muted">
            Todavía no hay pasarela de pago. El pedido queda registrado para
            coordinar transferencia, efectivo o un medio futuro.
          </p>
          <label className="field">
            <span>Nombre</span>
            <input name="customerName" required />
          </label>
          <label className="field">
            <span>Email</span>
            <input name="customerEmail" type="email" required />
          </label>
          <label className="field">
            <span>Teléfono</span>
            <input name="customerPhone" required />
          </label>
          <label className="field">
            <span>Dirección</span>
            <input name="address" required />
          </label>
          <label className="field">
            <span>Ciudad</span>
            <input name="city" required />
          </label>
          <label className="field">
            <span>Entrega</span>
            <select name="deliveryMethod" defaultValue="pickup">
              <option value="pickup">Retiro</option>
              <option value="shipping">Envío</option>
            </select>
          </label>
          <label className="field">
            <span>Pago</span>
            <select name="paymentMethod" defaultValue="transfer">
              <option value="transfer">Transferencia</option>
              <option value="cash">Efectivo</option>
              <option value="pending_gateway">Pago online (próximamente)</option>
            </select>
          </label>
          <label className="field">
            <span>Notas</span>
            <textarea name="notes" rows={3} />
          </label>
          {(formError || error) && <p className="stock-out">{formError || error}</p>}
          <button className="btn btn-primary" type="submit" disabled={!quote || submitting}>
            Confirmar pedido
          </button>
        </form>
        <aside className="summary-card">
          <h2>Resumen</h2>
          {!quote && <p className="muted">Agregá productos para continuar.</p>}
          {quote && (
            <>
              {quote.items.map((item) => (
                <p key={`${item.productId}-${item.drawing.publicId}-${item.bagColor}`}>
                  {item.name} · {bagById(item.bagColor).label} × {item.quantity}
                  <span>{formatPrice(item.subtotal)}</span>
                </p>
              ))}
              <p>
                Subtotal <span>{formatPrice(quote.subtotal)}</span>
              </p>
              <strong>
                Total tentativo <span>{formatPrice(quote.total)}</span>
              </strong>
              <small className="muted">El envío se suma al confirmar, si corresponde.</small>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
