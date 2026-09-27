# Ari´s Bags

Tienda online de bolsas y productos con diseños de Ariana.

Identidad visual provisional, pensada para reemplazar más adelante el material gráfico oficial y las fotos reales. El nombre de la marca es **Ari´s Bags**.

## Descripción

Primera versión mantenible: catálogo público, carrito, checkout sin pasarela de pago, pedidos, autenticación administrativa y panel para productos, categorías y pedidos.

## Arquitectura

```
                ARI´S BAGS
                     │
                     ▼
                CLOUDFLARE
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
    FRONTEND                    API
   React + Vite              Express
                                 │
                                 ▼
                          PostgreSQL
                            (Neon)
                                 │
                                 ▼
                            Cloudinary
```

Detalle en `docs/ARCHITECTURE.md`. Notas de Cloudflare en `docs/CLOUDFLARE.md`.

## Tecnologías

| Capa | Tecnología |
| --- | --- |
| Frontend | React, TypeScript, Vite, React Router, CSS propio |
| API | Node.js, Express, TypeScript |
| Base de datos | PostgreSQL + Prisma |
| Imágenes | Cloudinary (preparado; placeholders en local) |
| Auth | JWT en cookie httpOnly + Bearer, contraseñas con bcrypt |

## Estructura

```
arisbag/
├── frontend/     Tienda y panel admin
├── backend/      API REST + Prisma
├── database/     Notas del modelo
├── docs/
├── docker-compose.yml   PostgreSQL opcional
├── .env.example
├── package.json
└── README.md
```

Prisma vive en `backend/prisma/` porque corre con la API. `database/` documenta el modelo.

## Requisitos

- Node.js 20+
- npm 10+
- PostgreSQL 16 (instalado en el sistema, Docker o Neon)

En esta máquina de desarrollo no había PostgreSQL ni Docker. El código, las migraciones y el seed están listos; hay que crear la base antes de usar catálogo, carrito y admin.

## Instalación

```bash
npm install
```

## Configuración

1. Copiá `backend/.env.example` a `backend/.env`.
2. Copiá `frontend/.env.example` a `frontend/.env`.
3. Completá al menos `DATABASE_URL` y `JWT_SECRET`.

No subas archivos `.env` al repositorio.

## Variables de entorno

Ver `.env.example`.

- `DATABASE_URL` — PostgreSQL local o Neon
- `JWT_SECRET` — secreto largo y aleatorio
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
- `VITE_API_URL` — URL pública de la API (`http://localhost:4000` en local)

## Dibujos de Ari

Si volvés a tener originales locales en `drawings/`, se suben todos juntos a Cloudinary. Esa carpeta está en `.gitignore` y no debe quedar en el deploy:

```bash
npm run drawings:upload
```

Quedan en `aris-bags/drawings`. El admin los muestra en **Dibujos** y cada producto puede elegir de esa biblioteca.

## Base de datos

Creá la base `aris_bags` y aplicá migraciones:

```bash
npm run db:migrate
npm run db:seed
```

Si preferís Docker y lo tenés instalado:

```bash
docker compose up -d
npm run db:deploy
npm run db:seed
```

El seed es **de demostración**. Crea productos ficticios y un admin de prueba:

- Email: `admin@arisbags.local`
- Contraseña: `AdminDemo123!`

Cambiá esa clave antes de cualquier entorno real.

## Ejecución local

Terminal 1:

```bash
npm run dev:backend
```

Terminal 2:

```bash
npm run dev:frontend
```

- Tienda: http://localhost:5173
- API: http://localhost:4000/api/health
- Admin: http://localhost:5173/admin/login

## Testing

```bash
npm test
```

Cubre autenticación de rutas admin, consulta y creación de productos (con mocks), carrito, stock y pedidos.

## Despliegue

Guía paso a paso: **`docs/DEPLOY.md`**.

- Frontend → Render Static Site o Cloudflare Pages
- API → Render (Docker, ver `render.yaml`)
- Base → Neon
- Imágenes → Cloudinary

Express **no** se asume ejecutable en Cloudflare Workers. Ver `docs/CLOUDFLARE.md`.
