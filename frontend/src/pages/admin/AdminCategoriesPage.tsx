import { FormEvent, useEffect, useState } from "react";
import { api, type Category } from "../../lib/api";

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  async function load() {
    setCategories(await api<Category[]>("/api/admin/categories"));
  }

  useEffect(() => {
    load().catch(() => setCategories([]));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await api("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify({
        name: data.get("name"),
        description: data.get("description") || undefined,
      }),
    });
    event.currentTarget.reset();
    await load();
  }

  async function toggle(category: Category) {
    await api(`/api/admin/categories/${category.id}`, {
      method: "PUT",
      body: JSON.stringify({ isActive: !category.isActive }),
    });
    await load();
  }

  return (
    <div>
      <p className="eyebrow">Catálogo</p>
      <h1 className="page-title">Categorías</h1>
      <form className="stack-form admin-panel" onSubmit={onSubmit}>
        <label className="field">
          <span>Nombre</span>
          <input name="name" required />
        </label>
        <label className="field">
          <span>Descripción</span>
          <input name="description" />
        </label>
        <button className="btn btn-primary" type="submit">
          Crear
        </button>
      </form>
      <ul className="admin-list">
        {categories.map((category) => (
          <li className="admin-panel" key={category.id}>
            <span>
              {category.name}
              <span className={category.isActive ? "admin-pill ok" : "admin-pill"}>
                {category.isActive ? "activa" : "inactiva"}
              </span>
            </span>
            <button type="button" className="text-btn" onClick={() => toggle(category)}>
              {category.isActive ? "Desactivar" : "Activar"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
