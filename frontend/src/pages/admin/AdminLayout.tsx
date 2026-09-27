import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/admin", label: "Dashboard", end: true, icon: "grid" },
  { to: "/admin/productos", label: "Productos", icon: "bag" },
  { to: "/admin/categorias", label: "Categorías", icon: "tag" },
  { to: "/admin/pedidos", label: "Pedidos", icon: "list" },
  { to: "/admin/dibujos", label: "Dibujos", icon: "draw" },
] as const;

function NavIcon({ name }: { name: (typeof links)[number]["icon"] }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {name === "grid" && (
        <>
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" />
        </>
      )}
      {name === "bag" && (
        <path d="M8 8V7a4 4 0 1 1 8 0v1M6 8h12l-1 12H7L6 8z" />
      )}
      {name === "tag" && (
        <path d="M4 5h8l8 8-7 7-8-8V5zm4 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
      )}
      {name === "list" && (
        <path d="M8 7h12M8 12h12M8 17h8M4 7h.01M4 12h.01M4 17h.01" />
      )}
      {name === "draw" && (
        <path d="m5 16 9.5-9.5 3 3L8 19H5v-3z" />
      )}
    </svg>
  );
}

export function AdminLayout() {
  const { user, ready, logout } = useAuth();

  if (!ready) {
    return <main className="page container">Cargando…</main>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-nav">
        <div className="admin-brand">
          <img className="admin-brand-logo" src="/brand/logo.png" alt="" />
          <div>
            <p className="eyebrow">Ari´s Bags</p>
            <strong>Estudio</strong>
          </div>
        </div>
        <nav className="admin-nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={"end" in link ? link.end : undefined}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <NavIcon name={link.icon} />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-nav-foot">
          <p className="admin-user">{user.name}</p>
          <p className="admin-user-mail">{user.email}</p>
          <button type="button" className="admin-logout" onClick={() => logout()}>
            Salir
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
