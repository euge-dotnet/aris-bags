import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { DocumentMeta } from "../components/seo/DocumentMeta";
import { ProductImage } from "../components/ui/ProductImage";
import { StampPreview } from "../components/ui/StampPreview";
import { useCart } from "../context/CartContext";
import { api, type Drawing, type DrawingsPayload, type Product } from "../lib/api";
import { bagColors, styleForProduct, type BagColorId } from "../lib/bagColors";
import { formatPrice } from "../lib/format";
import { characterSheet } from "../lib/characters";
import { stampRotation } from "../lib/images";

export function ProductPage() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const { add } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [missing, setMissing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [drawingKey, setDrawingKey] = useState(params.get("dibujo") ?? "");
  const [bagColor, setBagColor] = useState<BagColorId>("natural");
  const [rotation, setRotation] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!slug) return;
    api<Product>(`/api/products/${slug}`)
      .then((data) => {
        setProduct(data);
        setMissing(false);
      })
      .catch(() => setMissing(true));
    api<DrawingsPayload>("/api/drawings")
      .then((data) => setDrawings(data.images))
      .catch(() => setDrawings([]));
  }, [slug]);

  const drawing = drawings.find((item) => item.key === drawingKey);
  const character = drawing ? characterSheet(drawing.key) : null;

  useEffect(() => {
    setRotation(stampRotation(drawing?.key));
  }, [drawing?.key]);

  if (missing) {
    return (
      <main className="page">
        <div className="container">
          <h1 className="page-title">Producto no encontrado</h1>
          <Link to="/catalogo">Volver al catálogo</Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="page">
        <div className="container muted">Cargando…</div>
      </main>
    );
  }

  return (
    <main className="page">
      <DocumentMeta
        title={`${product.name} · Ari´s Bags`}
        description={product.description}
      />
      <div className="container product-layout">
        <div className="gallery">
          <StampPreview
            productName={product.name}
            bagColor={bagColor}
            bagStyle={styleForProduct(product.slug)}
            drawingUrl={drawing?.url}
            drawingAlt={drawing ? `Dibujo estampado en ${product.name}` : undefined}
            rotation={rotation}
          />
          {drawing && (
            <button
              type="button"
              className="text-btn"
              onClick={() =>
                setRotation((current) => {
                  const next = [0, -90, 180, 90];
                  const index = next.indexOf(current);
                  return next[(index + 1) % next.length];
                })
              }
            >
              Girar dibujo
            </button>
          )}
        </div>
        <div>
          <p className="eyebrow">{product.category.name}</p>
          <h1 className="page-title">{product.name}</h1>
          <p className="muted">{product.description}</p>
          <p className="price">{formatPrice(product.price)}</p>
          <p className={product.available ? "stock-ok" : "stock-out"}>
            {product.available ? `${product.stock} disponibles` : "Sin stock"}
          </p>
          <p className="eyebrow">Color de la lona</p>
          <div className="color-swatches">
            {bagColors.map((color) => (
              <button
                key={color.id}
                type="button"
                className={color.id === bagColor ? "color-swatch active" : "color-swatch"}
                onClick={() => setBagColor(color.id)}
              >
                <i className={`swatch-${color.id}`} />
                {color.label}
              </button>
            ))}
          </div>
          <p className="eyebrow">Personaje para estampar</p>
          {character && drawing ? (
            <p className="muted">
              Vas a estampar a {character.name} #{character.number}.{" "}
              <Link to={`/dibujos/${drawing.key}`}>Ver su ficha</Link>
            </p>
          ) : (
            <p className="muted">
              Elegí un personaje. También podés empezar por{" "}
              <Link to="/dibujos">toda la colección</Link>.
            </p>
          )}
          <div className="drawing-picker">
            {drawings.map((item) => {
              const sheet = characterSheet(item.key);
              return (
                <button
                  key={item.publicId}
                  type="button"
                  className={item.key === drawingKey ? "thumb active" : "thumb"}
                  onClick={() => setDrawingKey(item.key)}
                >
                  <ProductImage url={item.url} alt={sheet.name} width={160} variant="drawing" />
                  <span className="thumb-number">#{sheet.number}</span>
                </button>
              );
            })}
          </div>
          <label className="field quantity-field">
            <span>Cantidad</span>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            />
          </label>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!product.available || !drawing}
            onClick={() => {
              if (!drawing) return;
              add(product.id, drawing.publicId, bagColor, quantity);
              setMessage("Agregado al carrito");
            }}
          >
            Agregar al carrito
          </button>
          {message && <p className="stock-ok">{message}</p>}
        </div>
      </div>
    </main>
  );
}
