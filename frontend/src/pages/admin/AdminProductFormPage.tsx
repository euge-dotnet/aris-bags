import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductImage } from "../../components/ui/ProductImage";
import { api, type Category, type Product } from "../../lib/api";

type MediaStatus = {
  configured: boolean;
  folder: string;
};

export function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "nuevo";
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [media, setMedia] = useState<MediaStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [library, setLibrary] = useState<Array<{ publicId: string; url: string }>>([]);
  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    api<Category[]>("/api/admin/categories").then(setCategories).catch(() => setCategories([]));
    api<MediaStatus>("/api/admin/media/status").then(setMedia).catch(() => setMedia(null));
  }, []);

  useEffect(() => {
    if (isNew) return;
    api<Product>(`/api/admin/products/${id}`)
      .then(setProduct)
      .catch(() => setProduct(null));
  }, [id, isNew]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name")),
      description: String(data.get("description")),
      price: Number(data.get("price")),
      stock: Number(data.get("stock")),
      categoryId: String(data.get("categoryId")),
      isActive: data.get("isActive") === "on",
      isFeatured: data.get("isFeatured") === "on",
    };
    try {
      if (isNew) {
        const created = await api<Product>("/api/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        navigate(`/admin/productos/${created.id}`);
        return;
      }
      if (id) {
        setProduct(
          await api<Product>(`/api/admin/products/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          }),
        );
        setNote("Producto guardado. Ya podés subir las fotos.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    }
  }

  async function uploadFiles(fileList: FileList | null) {
    if (!id || isNew || !fileList?.length) return;
    const body = new FormData();
    Array.from(fileList).forEach((file) => body.append("images", file));
    setBusy(true);
    setError("");
    try {
      const result = await api<{ uploaded: number; folder: string }>(
        `/api/admin/products/${id}/images/upload`,
        { method: "POST", body },
      );
      setProduct(await api<Product>(`/api/admin/products/${id}`));
      setNote(`${result.uploaded} imagen(es) subidas a ${result.folder}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron subir las imágenes");
    } finally {
      setBusy(false);
    }
  }

  async function loadLibrary() {
    const data = await api<{ images: Array<{ publicId: string; url: string }> }>(
      "/api/admin/drawings",
    );
    setLibrary(data.images);
    setShowLibrary(true);
  }

  async function attachDrawing(publicId: string) {
    if (!id || isNew) return;
    setBusy(true);
    setError("");
    try {
      await api(`/api/admin/products/${id}/images/from-drawing`, {
        method: "POST",
        body: JSON.stringify({ publicId }),
      });
      setProduct(await api<Product>(`/api/admin/products/${id}`));
      setNote("Dibujo agregado al producto");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo agregar el dibujo");
    } finally {
      setBusy(false);
    }
  }

  async function importFromCloudinary() {
    if (!id || isNew) return;
    setBusy(true);
    setError("");
    try {
      const result = await api<{ imported: number; skipped: number; folder: string }>(
        `/api/admin/products/${id}/images/import`,
        { method: "POST" },
      );
      setProduct(await api<Product>(`/api/admin/products/${id}`));
      setNote(
        result.imported
          ? `Se importaron ${result.imported} desde ${result.folder}`
          : `No había imágenes nuevas en ${result.folder}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo importar");
    } finally {
      setBusy(false);
    }
  }

  async function removeImage(imageId: string) {
    if (!id) return;
    await api(`/api/admin/products/${id}/images/${imageId}`, { method: "DELETE" });
    setProduct(await api<Product>(`/api/admin/products/${id}`));
  }

  async function deactivate() {
    if (!id || isNew) return;
    await api(`/api/admin/products/${id}`, { method: "DELETE" });
    navigate("/admin/productos");
  }

  if (!isNew && !product) {
    return <p>Cargando producto…</p>;
  }

  const folder = product && media ? `${media.folder}/products/${product.slug}` : "";

  return (
    <div>
      <h1 className="page-title">{isNew ? "Nuevo producto" : "Editar producto"}</h1>
      <form className="stack-form" onSubmit={onSubmit} key={product?.id ?? "new"}>
        <label className="field">
          <span>Nombre</span>
          <input name="name" required defaultValue={product?.name} />
        </label>
        <label className="field">
          <span>Descripción</span>
          <textarea name="description" rows={4} required defaultValue={product?.description} />
        </label>
        <label className="field">
          <span>Precio</span>
          <input name="price" type="number" min={1} step="1" required defaultValue={product?.price} />
        </label>
        <label className="field">
          <span>Stock</span>
          <input name="stock" type="number" min={0} required defaultValue={product?.stock} />
        </label>
        <label className="field">
          <span>Categoría</span>
          <select name="categoryId" required defaultValue={product?.category.id}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <input name="isActive" type="checkbox" defaultChecked={product?.isActive ?? true} /> Activo
        </label>
        <label>
          <input name="isFeatured" type="checkbox" defaultChecked={product?.isFeatured} /> Destacado
        </label>
        {error && <p className="stock-out">{error}</p>}
        <button className="btn btn-primary" type="submit">
          {isNew ? "Crear y cargar fotos" : "Guardar"}
        </button>
      </form>
      {!isNew && product && (
        <section className="admin-block">
          <h2>Imágenes</h2>
          {media && !media.configured && (
            <p className="stock-out">
              Faltan las credenciales de Cloudinary en backend/.env.
            </p>
          )}
          {folder && (
            <p className="muted">
              Carpeta en Cloudinary: <code>{folder}</code>
            </p>
          )}
          <ul className="admin-image-grid">
            {product.images.map((image) => (
              <li key={image.id}>
                <ProductImage url={image.url} alt={image.alt} width={320} />
                <button type="button" className="text-btn" onClick={() => removeImage(image.id)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <label className={busy ? "dropzone dropzone-busy" : "dropzone"}>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={busy || media?.configured === false}
              onChange={(event) => {
                void uploadFiles(event.target.files);
                event.target.value = "";
              }}
            />
            <strong>Elegí varias fotos a la vez</strong>
            <span>Se suben a Cloudinary y el catálogo las toma de ahí.</span>
          </label>
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-ghost"
              disabled={busy || media?.configured === false}
              onClick={() => void loadLibrary()}
            >
              Elegir de los dibujos de Ari
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={busy || media?.configured === false}
              onClick={() => void importFromCloudinary()}
            >
              Importar las que ya están en esa carpeta
            </button>
          </div>
          {showLibrary && (
            <ul className="admin-image-grid">
              {library.map((image) => (
                <li key={image.publicId}>
                  <button
                    type="button"
                    className="thumb"
                    disabled={busy}
                    onClick={() => void attachDrawing(image.publicId)}
                  >
                    <ProductImage url={image.url} alt="Dibujo de Ariana" width={240} variant="drawing" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {note && <p className="stock-ok">{note}</p>}
          <p className="muted">
            Si preferís cargarlas desde la Media Library de Cloudinary, subilas
            a esa carpeta y usá importar. No hace falta pegar URLs.
          </p>
          <button type="button" className="text-btn" onClick={deactivate}>
            Desactivar producto
          </button>
        </section>
      )}
    </div>
  );
}
