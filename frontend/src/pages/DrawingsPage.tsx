import { useEffect, useState } from "react";
import { DocumentMeta } from "../components/seo/DocumentMeta";
import { CharacterTeaser } from "../components/ui/CharacterTeaser";
import { api, type Drawing, type DrawingsPayload } from "../lib/api";

export function DrawingsPage() {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<DrawingsPayload>("/api/drawings")
      .then((data) => setDrawings(data.images))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <main className="page">
      <DocumentMeta
        title="Colección de Ari · Ari´s Bags"
        description="Cada dibujo de Ariana es un personaje coleccionable. Elegí uno y estampalo en tu bolsa."
      />
      <div className="container">
        <p className="eyebrow">Colección de Ariana</p>
        <h1 className="page-title">Elegí quién te acompaña</h1>
        <p className="muted hero-lead">
          Cada dibujo es un personaje coleccionable. Tocá uno, leé su ficha y
          después decile en qué bolsa se va a vivir.
        </p>
        {error && <p className="stock-out">{error}</p>}
        <div className="drawing-grid">
          {drawings.map((drawing) => (
            <CharacterTeaser key={drawing.publicId} drawing={drawing} />
          ))}
        </div>
      </div>
    </main>
  );
}
