# Arquitectura — Ari´s Bags

## Visión

```
                ARI´S BAGS
                     │
                     ▼
                CLOUDFLARE
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
    FRONTEND                    API
      React                  Express
                                 │
                                 ▼
                          PostgreSQL
                            (Neon)
                                 │
                                 ▼
                            Cloudinary
```

## Decisiones

### Monorepo con npm workspaces

`frontend/` y `backend/` son paquetes independientes. El `package.json` raíz orquesta scripts. La API queda separada del frontend.

### Prisma en `backend/prisma`

El ORM corre con la API. `database/` solo documenta el modelo.

### Precios y stock

El carrito del navegador guarda únicamente `productId` y `quantity`. El backend recalcula precios y valida stock en `/api/cart/quote` y al crear el pedido. El cliente no es fuente de verdad.

### Pedidos

`OrderItem` guarda copia de `productName` y `unitPrice` al momento de la compra.

### Autenticación

JWT firmado, cookie httpOnly `aris_session` y header `Authorization: Bearer`. Las rutas `/api/admin/*` se validan en el servidor. El frontend solo oculta la UI.

### Imágenes

PostgreSQL guarda `url`, `public_id`, `alt` y metadatos. No se almacenan binarios. Cloudinary queda preparado; sin credenciales se usan placeholders o URLs pegadas a mano.

### Cloudflare

El frontend estático encaja en Pages. Express es Node. Si más adelante se elige Workers, la API se adapta de forma explícita. No se convierte automáticamente.

## Modelo

- `User`
- `Category`
- `Product`
- `ProductImage`
- `Order`
- `OrderItem`

## API pública

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:slug`
- `GET /api/categories`
- `POST /api/cart/quote`
- `POST /api/orders`
- `GET /api/orders/:id?email=`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## API administrativa (JWT)

- `GET /api/admin/dashboard`
- `GET|POST /api/admin/products`
- `PUT|DELETE /api/admin/products/:id`
- `POST /api/admin/products/:id/images`
- `DELETE /api/admin/products/:id/images/:imageId`
- `GET|POST /api/admin/categories`
- `PUT /api/admin/categories/:id`
- `GET /api/admin/orders`
- `GET /api/admin/orders/:id`
- `PUT /api/admin/orders/:id/status`

## Seguridad

- Helmet, CORS acotado, rate limit en login y pedidos
- Validación Zod
- Prisma (consultas parametrizadas)
- Hash bcrypt
- Secretos solo por entorno
- Errores estructurados, sin stack traces en producción
- Logger que oculta password, token y secret
