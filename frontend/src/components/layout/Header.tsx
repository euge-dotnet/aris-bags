import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { cartCount } from "../../lib/cartStorage";
import { BrandMark } from "./BrandMark";
import { InstagramLink } from "./InstagramLink";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/dibujos", label: "Dibujos" },
  { to: "/nosotros", label: "La marca" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { lines } = useCart();
  const count = cartCount(lines);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" aria-label="Ari´s Bags, ir al inicio" onClick={() => setOpen(false)}>
          <BrandMark />
        </Link>

        <nav className={open ? "nav nav-open" : "nav"} aria-label="Principal">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <InstagramLink className="social-link" withLabel={false} />
          <Link to="/carrito" className="cart-link" aria-label={`Ver carrito, ${count} productos`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 7h15l-1.4 9.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.6L5 4H3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1.3" fill="currentColor" />
              <circle cx="17" cy="20" r="1.3" fill="currentColor" />
            </svg>
            <span>Carrito{count > 0 ? ` (${count})` : ""}</span>
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
