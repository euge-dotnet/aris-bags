import { useEffect, useState } from "react";
import { ProductImage } from "../../components/ui/ProductImage";
import { api } from "../../lib/api";

type Drawing = {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
};

type DrawingsPayload = {
  folder: string;
  count: number;
  images: Drawing[];
};

export function AdminDrawingsPage() {
  const [data, setData] = useState<DrawingsPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<DrawingsPayload>("/api/admin/drawings")
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div>
      <p className="eyebrow">Biblioteca</p>
      <h1 className="page-title">Dibujos de Ari</h1>
      <p className="muted">
        Biblioteca en Cloudinary. Para el primer lote, desde la raíz del
        proyecto: <code>npm run drawings:upload</code>
      </p>
      {error && <p className="stock-out">{error}</p>}
      {data && (
        <>
          <p>
            {data.count} dibujos en <code>{data.folder}</code>
          </p>
          <ul className="admin-image-grid">
            {data.images.map((image) => (
              <li key={image.publicId}>
                <ProductImage url={image.url} alt="Dibujo de Ariana" width={320} variant="drawing" />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
