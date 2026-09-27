import { Link } from "react-router-dom";
import { ProductImage } from "../components/ui/ProductImage";
import { useCart } from "../context/CartContext";
import { bagById, bagSrc, styleForProduct } from "../lib/bagColors";
import { characterSheet } from "../lib/characters";
import { formatPrice } from "../lib/format";

export function CartPage() {
  const { quote, error, loading, setQuantity, remove } = useCart();

  return (
    <main className="page">
      <div className="container narrow">
        <p className="eyebrow">Compra</p>
        <h1 className="page-title">Carrito</h1>
        {loading && <p className="muted">Actualizando precios…</p>}
        {error && <p className="stock-out">{error}</p>}
        {!quote && !loading && !error && <p className="muted">El carrito está vacío.</p>}
        {quote && (
          <>
            <ul className="cart-list">
              {quote.items.map((item) => {
                const character = characterSheet(item.drawing.key);
                return (
                <li key={`${item.productId}-${item.drawing.publicId}-${item.bagColor}`} className="cart-row">
                  <div className="cart-media">
                    <img
                      src={bagSrc(styleForProduct(item.slug), item.bagColor)}
                      alt={bagById(item.bagColor).label}
                    />
                    <ProductImage
                      url={item.drawing.url}
                      alt={character.name}
                      width={160}
                      variant="drawing"
                    />
                  </div>
                  <div>
                    <Link to={`/producto/${item.slug}?dibujo=${item.drawing.key}`}>{item.name}</Link>
                    <p className="muted">
                      {character.name} #{character.number} · lona {bagById(item.bagColor).label}
                    </p>
                    <p className="muted">{formatPrice(item.unitPrice)}</p>
                    <label className="field">
                      <span>Cantidad</span>
                      <input
                        type="number"
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        onChange={(event) =>
                          setQuantity(
                            item.productId,
                            item.drawing.publicId,
                            item.bagColor,
                            Number(event.target.value),
                          )
                        }
                      />
                    </label>
                    <button
                      type="button"
                      className="text-btn"
                      onClick={() =>
                        remove(item.productId, item.drawing.publicId, item.bagColor)
                      }
                    >
                      Quitar
                    </button>
                  </div>
                  <strong>{formatPrice(item.subtotal)}</strong>
                </li>
                );
              })}
            </ul>
            <p className="price">Total {formatPrice(quote.total)}</p>
            <Link className="btn btn-primary" to="/checkout">
              Continuar
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
