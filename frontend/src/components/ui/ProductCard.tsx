import { Link } from "react-router-dom";
import type { Product } from "../../lib/api";
import { formatPrice } from "../../lib/format";
import { ProductImage } from "./ProductImage";

type ProductCardProps = {
  product: Product;
  drawingKey?: string;
};

export function ProductCard({ product, drawingKey }: ProductCardProps) {
  const image = product.images[0];
  const href = drawingKey
    ? `/producto/${product.slug}?dibujo=${encodeURIComponent(drawingKey)}`
    : `/producto/${product.slug}`;

  return (
    <article className="product-card">
      <Link to={href} className="product-card-media">
        {image ? (
          <ProductImage url={image.url} alt={image.alt} width={480} />
        ) : (
          <div className="media-frame empty-media">Sin imagen</div>
        )}
      </Link>
      <div className="product-card-body">
        <p className="eyebrow">{product.category.name}</p>
        <h3>
          <Link to={href}>{product.name}</Link>
        </h3>
        <p className="muted">{formatPrice(product.price)}</p>
        <p className={product.available ? "stock-ok" : "stock-out"}>
          {product.available ? "Disponible" : "Sin stock"}
        </p>
      </div>
    </article>
  );
}
