import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DocumentMeta } from "../components/seo/DocumentMeta";
import { CharacterCard } from "../components/ui/CharacterCard";
import { ProductCard } from "../components/ui/ProductCard";
import { api, type Drawing, type Product } from "../lib/api";
import { characterSheet } from "../lib/characters";

export function DrawingPage() {
  const { key } = useParams();
  const [drawing, setDrawing] = useState<Drawing | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!key) return;
    api<Drawing>(`/api/drawings/${key}`)
      .then((data) => {
        setDrawing(data);
        setMissing(false);
      })
      .catch(() => setMissing(true));
    api<Product[]>("/api/products").then(setProducts).catch(() => setProducts([]));
  }, [key]);

  if (missing) {
    return (
      <main className="page">
        <div className="container">
          <h1 className="page-title">Personaje no encontrado</h1>
          <Link to="/dibujos">Volver a la colección</Link>
        </div>
      </main>
    );
  }

  if (!drawing) {
    return (
      <main className="page">
        <div className="container muted">Cargando…</div>
      </main>
    );
  }

  const character = characterSheet(drawing.key);

  return (
    <main className="page">
      <DocumentMeta
        title={`${character.name} · Ari´s Bags`}
        description={character.story}
      />
      <div className="container char-page">
        <p className="eyebrow">Colección de Ariana</p>
        <CharacterCard drawing={drawing} />
        <p className="muted char-stamp-note">
          Este personaje se estampa en la pieza que elijas. El dibujo queda en el pedido.
        </p>
        <Link className="btn btn-ghost" to="/dibujos">
          Ver toda la colección
        </Link>
      </div>
      <section className="section">
        <div className="container">
          <h2 className="section-title">Elegí dónde vive</h2>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} drawingKey={drawing.key} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
