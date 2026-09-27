import { Link } from "react-router-dom";
import { brandTagline } from "../../lib/brand";
import { BrandMark } from "./BrandMark";
import { InstagramLink } from "./InstagramLink";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <BrandMark />
          <p className="muted footer-text">
            {brandTagline}. Los dibujos de Ariana, saliendo del cuaderno para
            irse de paseo en una bolsa.
          </p>
        </div>
        <div>
          <p className="footer-title">Tienda</p>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/dibujos">Dibujos</Link>
          <Link to="/carrito">Carrito</Link>
          <Link to="/checkout">Checkout</Link>
        </div>
        <div>
          <p className="footer-title">Ari´s Bags</p>
          <Link to="/nosotros">La marca</Link>
          <InstagramLink className="social-link social-link-footer" />
        </div>
      </div>
      <p className="container footer-copy">© {new Date().getFullYear()} Ari´s Bags. {brandTagline}.</p>
    </footer>
  );
}
