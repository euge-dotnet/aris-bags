import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Product } from "../../lib/api";
import { formatPrice } from "../../lib/format";

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  async function load() {
    setProducts(await api<Product[]>("/api/admin/products"));
  }

  useEffect(() => {
    load().catch(() => setProducts([]));
  }, []);

  return (
    <div>
      <div className="admin-header">
        <div>
          <p className="eyebrow">Catálogo</p>
          <h1 className="page-title">Productos</h1>
        </div>
        <Link className="btn btn-primary" to="/admin/productos/nuevo">
          Nuevo
        </Link>
      </div>
      <div className="table-wrap admin-panel">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{formatPrice(product.price)}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={product.isActive ? "admin-pill ok" : "admin-pill"}>
                    {product.isActive ? "Activo" : "Oculto"}
                  </span>
                </td>
                <td>
                  <Link className="admin-row-link" to={`/admin/productos/${product.id}`}>
                    Editar
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
