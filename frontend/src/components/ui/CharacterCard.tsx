import type { Drawing } from "../../lib/api";
import { characterSheet } from "../../lib/characters";
import { ProductImage } from "./ProductImage";
import { RibbonBanner } from "./RibbonBanner";

type CharacterCardProps = {
  drawing: Drawing;
};

function Heart({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 29" aria-hidden>
      <path d="M16 27.1S3.4 18.7 3.4 10.8C3.4 6.7 6.6 3.6 10.6 3.6c2.3 0 4.3 1.15 5.4 3 1.1-1.85 3.1-3 5.4-3 4 0 7.2 3.1 7.2 7.2 0 7.9-12.6 16.3-12.6 16.3z" />
    </svg>
  );
}

function CornerMark({ kind }: { kind: "heart" | "hand" | "shield" }) {
  if (kind === "hand") {
    return (
      <span className="char-heart char-heart-tr char-corner-emoji" aria-hidden>
        ✋
      </span>
    );
  }

  if (kind === "shield") {
    return (
      <svg className="char-heart char-heart-tr" viewBox="0 0 32 32" aria-hidden>
        <path d="M16 3.4 26.4 7.2v8.6c0 6.4-4.4 11.2-10.4 13.2C10 27 5.6 22.2 5.6 15.8V7.2L16 3.4z" />
      </svg>
    );
  }

  return (
    <svg className="char-heart char-heart-tr" viewBox="0 0 32 29" aria-hidden>
      <path d="M16 27.1S3.4 18.7 3.4 10.8C3.4 6.7 6.6 3.6 10.6 3.6c2.3 0 4.3 1.15 5.4 3 1.1-1.85 3.1-3 5.4-3 4 0 7.2 3.1 7.2 7.2 0 7.9-12.6 16.3-12.6 16.3z" />
    </svg>
  );
}

export function CharacterCard({ drawing }: CharacterCardProps) {
  const character = characterSheet(drawing.key);

  return (
    <article className={`char-sheet char-${character.accent}`}>
      <CornerMark kind={character.corner} />

      <p className="char-number">
        <img src="/brand/number-badge.png" alt="" />
        <span>#{character.number}</span>
      </p>

      <RibbonBanner name={character.name} subtitle={character.subtitle} />

      <div className="char-body">
        <div className="char-art">
          <ProductImage
            url={drawing.url}
            alt={character.name}
            width={640}
            variant="drawing"
            className="char-art-frame"
          />
        </div>

        <section className="char-story">
          <p className="char-kicker">
            <Heart className="char-dot-heart" /> Historia <Heart className="char-dot-heart" />
          </p>
          <p>
            {character.story}
            <Heart className="char-box-heart" />
          </p>
        </section>

        <ul className="char-stats">
          <li>
            <i>♥</i>
            <p>
              <b>Nombre:</b> {character.name}
            </p>
          </li>
          <li>
            <i>★</i>
            <p>
              <b>Misión:</b> {character.mission}
            </p>
          </li>
          <li>
            <i>🛡</i>
            <p>
              <b>Poder:</b> {character.power}
            </p>
          </li>
          <li>
            <i>✚</i>
            <p>
              <b>Debilidad:</b> {character.weakness}
            </p>
          </li>
          <li>
            <i>{character.corner === "hand" ? "✋" : character.corner === "shield" ? "🛡" : "♥"}</i>
            <p>
              <b>Tipo:</b> {character.type}
            </p>
          </li>
        </ul>

        <section className="char-phrase">
          <p className="char-kicker">
            <Heart className="char-dot-heart" /> Frase especial <Heart className="char-dot-heart" />
          </p>
          <blockquote>
            <span>“</span>
            {character.quote}
            <span>”</span>
          </blockquote>
        </section>
      </div>

      <p className="char-collect">
        <Heart className="char-dot-heart" /> Coleccionable <Heart className="char-dot-heart" />
      </p>
    </article>
  );
}
