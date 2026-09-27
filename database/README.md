# Base de datos — Ari´s Bags

El esquema y las migraciones viven en `backend/prisma/` porque Prisma se ejecuta junto a la API.

Esta carpeta documenta el modelo y el flujo de datos para desarrollo local.

## Motor

PostgreSQL. En local se usa una instancia propia. Más adelante se puede apuntar `DATABASE_URL` a Neon sin cambiar el esquema.

## Tablas previstas

- `User` — administradores
- `Category` — categorías de producto
- `Product` — catálogo
- `ProductImage` — metadatos de imagen (URL, public_id)
- `Order` — pedidos
- `OrderItem` — ítems con copia de nombre y precio al momento de la compra

## Comandos (desde la raíz)

```bash
npm run db:migrate
npm run db:seed
npm run db:studio
```

Los datos del seed son **de demostración** y no representan productos reales.
