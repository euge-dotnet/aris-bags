import {
  bagById,
  bagSrc,
  type BagColorId,
  type BagStyleId,
} from "../../lib/bagColors";
import { stampSrc } from "../../lib/images";

type StampPreviewProps = {
  drawingUrl?: string;
  drawingAlt?: string;
  productName: string;
  bagColor: BagColorId;
  bagStyle: BagStyleId;
  rotation?: number;
};

export function StampPreview({
  drawingUrl,
  drawingAlt,
  productName,
  bagColor,
  bagStyle,
  rotation = 0,
}: StampPreviewProps) {
  const color = bagById(bagColor);

  return (
    <figure className="tote-preview">
      <div className="tote-scene">
        <img
          className="tote-photo"
          src={bagSrc(bagStyle, bagColor)}
          alt={`${productName} ${color.label}`}
        />
        <div className={`tote-face tote-face-${bagStyle}`}>
          {drawingUrl ? (
            <img
              src={stampSrc(drawingUrl, 720, rotation)}
              alt={drawingAlt ?? `Dibujo estampado en ${productName} ${color.label}`}
              className="tote-art"
            />
          ) : (
            <p>Elegí un dibujo para verlo en la bolsa</p>
          )}
        </div>
      </div>
      <figcaption>
        Ejemplo de la bolsa en lona {color.label.toLowerCase()}. El estampado real se hace sobre la tela.
      </figcaption>
    </figure>
  );
}
