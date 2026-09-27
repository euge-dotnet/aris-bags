import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DocumentMeta } from "../components/seo/DocumentMeta";
import { ProductCard } from "../components/ui/ProductCard";
import { api, type Category, type Product } from "../lib/api";

export function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState(params.get("orden") ?? "featured");
  const selected = params.get("categoria") ?? "todas";
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (selected !== "todas") search.set("category", selected);
    if (sort) search.set("sort", sort);
    api<Product[]>(`/api/products?${search.toString()}`)
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [query, selected, sort]);

  useEffect(() => {
    api<Category[]>("/api/categories").then(setCategories).catch(() => setCategories([]));
  }, []);

  return (
    <main className="page">
      <DocumentMeta
        title="Catálogo · Ari´s Bags"
        description="Explorá el catálogo de Ari´s Bags: totes, shoppers, mochilas y piezas ilustradas."
      />
      <div className="container">
        <p className="eyebrow">Tienda</p>
        <h1 className="page-title">Catálogo</h1>
        <div className="catalog-toolbar">
          <label className="field">
            <span>Buscar</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nombre del producto"
            />
          </label>
          <label className="field">
            <span>Categoría</span>
            <select
              value={selected}
              onChange={(event) => {
                const next = new URLSearchParams(params);
                if (event.target.value === "todas") next.delete("categoria");
                else next.set("categoria", event.target.value);
                setParams(next, { replace: true });
              }}
            >
              <option value="todas">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Ordenar</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Destacados</option>
              <option value="newest">Más nuevos</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </label>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
