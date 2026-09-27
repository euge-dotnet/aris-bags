# Imágenes — Ari´s Bags

Las fotos y dibujos viven en Cloudinary. PostgreSQL solo guarda `url`, `publicId`, `alt` y tamaños.

## Claves

Completá en `backend/.env` (no las pegues en el chat ni en Git):

```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=aris-bags
```

## Dibujos de Ari (lote)

Los JPG locales de `drawings/` se suben **todos juntos** a Cloudinary. Después de esa carga, la carpeta local se borra para que no viaje en el deploy. La fuente queda en Cloudinary.

```bash
npm run drawings:upload
```

Quedan en `aris-bags/drawings`. El comando se puede repetir: los que ya están no se vuelven a subir.

En la tienda se ven en `/dibujos`. Se elige un dibujo, después la bolsa, y ese dibujo queda en el carrito y en el pedido para estamparlo.

Si quitás un dibujo de un producto, la biblioteca en Cloudinary no se borra.

## Fotos de un producto

Carpeta automática: `aris-bags/products/{slug}`

- Subir varias desde el admin
- O cargarlas en esa carpeta de Cloudinary e importar
