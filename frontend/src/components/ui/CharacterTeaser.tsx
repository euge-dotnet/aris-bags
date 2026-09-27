import { Link } from "react-router-dom";
import type { Drawing } from "../../lib/api";
import { characterSheet } from "../../lib/characters";
import { ProductImage } from "./ProductImage";
import { RibbonBanner } from "./RibbonBanner";

type CharacterTeaserProps = {
  drawing: Drawing;
};

export function CharacterTeaser({ drawing }: CharacterTeaserProps) {
  const character = characterSheet(drawing.key);

  return (
    <Link to={`/dibujos/${drawing.key}`} className={`char-teaser char-${character.accent}`}>
      <span className="char-teaser-number">#{character.number}</span>
      <RibbonBanner name={character.name} as="strong" />
      <ProductImage
        url={drawing.url}
        alt={character.name}
        width={420}
        variant="drawing"
        className="char-teaser-art"
      />
      <p className="char-teaser-foot">
        <i>♥</i> Coleccionable
      </p>
    </Link>
  );
}
