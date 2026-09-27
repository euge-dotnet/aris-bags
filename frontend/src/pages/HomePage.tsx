import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DocumentMeta } from "../components/seo/DocumentMeta";
import { CharacterTeaser } from "../components/ui/CharacterTeaser";
import { ProductCard } from "../components/ui/ProductCard";
import { api, type Category, type Drawing, type DrawingsPayload, type Product } from "../lib/api";
import { brandDescription } from "../lib/brand";

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [drawings, setDrawings] = useState<Drawing[]>([]);

  useEffect(() => {
    api<Product[]>("/api/products?featured=true").then(setFeatured).catch(() => setFeatured([]));
    api<Category[]>("/api/categories").then(setCategories).catch(() => setCategories([]));
    api<DrawingsPayload>("/api/drawings")
      .then((data) => setDrawings(data.images.slice(0, 8)))
      .catch(() => setDrawings([]));
  }, []);

  return (
    <main>
      <DocumentMeta
        title="Ari´s Bags"
        description={brandDescription}
      />
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Bolsas que te acompañan</p>
            <h1>El mundo de Ariana, para llevar puesto.</h1>
            <p className="muted hero-lead">
              Ariana tiene 12 años. Es autista, le encanta la música y
              dibuja con un pulso que no se parece al de nadie. Acá sus
              dibujos dejan el cuaderno: los estampamos en bolsas y otras
              piezas, con esa impronta viva que solo su arte puede dar.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/dibujos">
                Ver los dibujos
              </Link>
              <Link className="btn btn-ghost" to="/catalogo">
                Ver bolsas
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <img src="/brand/logo.png" alt="Ari´s Bags, bolsas que te acompañan" />
          </div>
        </div>
      </section>

      {drawings.length > 0 && (
        <section className="section">
          <div className="container">
            <p className="eyebrow">Colección de Ari</p>
            <h2 className="section-title">Personajes que se quieren ir de paseo</h2>
            <div className="drawing-grid">
              {drawings.map((drawing) => (
                <CharacterTeaser key={drawing.publicId} drawing={drawing} />
              ))}
            </div>
            <Link className="btn btn-primary" to="/dibujos">
              Ver todos
            </Link>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <p className="eyebrow">Destacados</p>
          <h2 className="section-title">Piezas para empezar a mirar</h2>
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section categories-band">
        <div className="container">
          <p className="eyebrow">Categorías</p>
          <h2 className="section-title">Elegí por tipo de pieza</h2>
          <div className="category-grid">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/catalogo?categoria=${category.slug}`}
                className="category-card"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container brand-story">
          <div>
            <p className="eyebrow">Ariana</p>
            <h2 className="section-title">Un cuaderno que se hizo tienda.</h2>
            <p className="muted">
              Ella dibuja, nosotros estampamos. Vos elegís el personaje que
              te mira de reojo y te lo llevás en una bolsa que se usa, se
              arruga y se quiere.
            </p>
          </div>
          <Link className="btn btn-primary" to="/nosotros">
            Leer su historia
          </Link>
        </div>
      </section>
    </main>
  );
}
