import { drawingSrc, imageSrc } from "../../lib/images";

type ProductImageProps = {
  url: string;
  alt: string;
  width?: number;
  className?: string;
  variant?: "photo" | "drawing";
};

export function ProductImage({
  url,
  alt,
  width = 720,
  className,
  variant = "photo",
}: ProductImageProps) {
  const src = variant === "drawing" ? drawingSrc(url, width) : imageSrc(url, width);
  const frame = className ?? (variant === "drawing" ? "media-frame media-frame-drawing" : "media-frame");

  return (
    <div className={frame}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}
