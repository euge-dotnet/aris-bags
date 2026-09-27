import { DocumentMeta } from "../components/seo/DocumentMeta";
import { brandDescription, brandName, brandTagline } from "../lib/brand";

export function AboutPage() {
  return (
    <main className="page">
      <DocumentMeta title={`La marca · ${brandName}`} description={brandDescription} />
      <div className="container narrow story-copy">
        <p className="eyebrow">{brandTagline}</p>
        <h1 className="page-title">Ariana, y el mundo que dibuja</h1>
        <p>
          Ariana tiene 12 años y una manera muy suya de estar en el mundo. Es
          autista. Cuando suena la música, algo se acomoda. Cuando agarra un
          lápiz, aparecen bichos, colores, ojos enormes y personajes que
          parecen salidos de un tema que solo ella escucha.
        </p>
        <p>
          Dibuja porque le gusta, no porque le pidan. Hay días de manchas
          fuertes y días de un trazo finito, casi un susurro. En todos queda
          esa marca: un pulso que no se parece al de nadie.
        </p>
        <p>
          Ari´s Bags nació para que esos dibujos no se queden en el cuaderno.
          Los estampamos en bolsas, mochilas y otras piezas que se usan de
          verdad: para el cole, para el super, para salir. El arte de Ariana
          viaja, se mancha un poco y se vuelve parte de la vida de alguien.
        </p>
        <p>
          No vendemos “un diseño lindo”. Llevamos la impronta de una nena que
          canta y dibuja a su manera. Si elegís una pieza, te llevás un pedazo
          de ese mundo.
        </p>
      </div>
    </main>
  );
}
