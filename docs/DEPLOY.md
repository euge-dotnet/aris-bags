# Poner Ari´s Bags en línea

## Resumen

| Pieza | Dónde |
|--------|--------|
| Tienda (React) | Render Static Site **o** Cloudflare Pages |
| API (Express) | Render Web Service (Docker) |
| Base de datos | Neon (PostgreSQL) |
| Imágenes | Cloudinary |

## 1. Subir el código a GitHub

El repo debe estar en GitHub (o GitLab) para conectar Render / Cloudflare.

## 2. API en Render

1. [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**.
2. Conectá el repositorio y elegí `render.yaml`.
3. Completá variables **sync: false**:
   - `DATABASE_URL` — connection string de Neon (misma que en local).
   - `CORS_ORIGIN` — URL pública de la tienda, ej. `https://aris-bags-web.onrender.com` (varias URLs separadas por coma).
   - Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
4. Esperá el deploy de **aris-bags-api**. Anotá la URL, ej. `https://aris-bags-api.onrender.com`.

La API corre migraciones al arrancar (`prisma migrate deploy`).

## 3. Tienda en Render (mismo blueprint)

1. En **aris-bags-web**, variable de build:
   - `VITE_API_URL` = URL de la API **sin** barra final, ej. `https://aris-bags-api.onrender.com`
2. Redeploy del sitio estático.

## 4. CORS (importante)

Después de conocer la URL final de la tienda, actualizá en la API:

```env
CORS_ORIGIN=https://aris-bags-web.onrender.com
```

Si usás Cloudflare Pages en lugar de Render para el front, agregá esa URL también, separada por coma.

## 5. Admin en producción

- Entrada: `https://tu-tienda/admin/login` (no hay enlace en el header público).
- Cambiá la contraseña del admin de demo antes de abrir al público (`db:seed` solo para desarrollo).

## 6. Alternativa: frontend en Cloudflare Pages

Build:

- **Root directory:** repo raíz (o `frontend` si configurás comandos relativos).
- **Build command:** `npm ci && npm run build:frontend`
- **Output:** `frontend/dist`
- **Variable:** `VITE_API_URL` = URL de la API en Render.

SPA: el archivo `frontend/public/_redirects` ya incluye la regla para Pages.

## 7. Comprobar

- `GET https://tu-api.onrender.com/api/health`
- Tienda carga productos y dibujos.
- Login admin con Bearer (token en sessionStorage tras login).

## Local vs producción

| Variable | Backend | Frontend (build) |
|----------|---------|------------------|
| `DATABASE_URL` | Neon | — |
| `JWT_SECRET` | largo y aleatorio | — |
| `CORS_ORIGIN` | URL(s) de la tienda | — |
| `VITE_API_URL` | — | URL de la API |

Nunca subas `.env` al repositorio.
