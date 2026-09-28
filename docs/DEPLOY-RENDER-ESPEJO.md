# Render con otra cuenta de GitHub (espejo)

Render está con **euge-dotnet**, el repo principal está en **Eugecom/aris-bags**.  
No hace falta mover el proyecto: un **espejo** en `euge-dotnet/aris-bags` alimenta Render; seguís trabajando en Eugecom.

## Qué queda dónde

| Lugar | Rol |
|--------|-----|
| **Eugecom/aris-bags** | Repo principal (push desde tu PC) |
| **euge-dotnet/aris-bags** | Copia solo para Render |
| **Render** | Sigue conectado a **euge-dotnet** (como ya tenés) |

El repo en Eugecom **no se borra ni se mueve**.

---

## Paso 1 — Repo vacío en euge-dotnet

1. Entrá a GitHub como **euge-dotnet**.
2. **New repository** → nombre `aris-bags` → **Private** → sin README.
3. Anotá: `euge-dotnet/aris-bags`.

---

## Paso 2 — Token para el espejo

1. GitHub **euge-dotnet** → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained** (o classic con scope `repo`).
2. Permiso de escritura solo en `euge-dotnet/aris-bags`.
3. Si **euge-dotnet** es una organización: en la lista de tokens, **Authorize SSO** para esa org.
4. El token lo creás estando logueado como **euge-dotnet**, no como Eugecom.
3. Copiá el token (solo se muestra una vez).

---

## Paso 3 — Secrets en Eugecom/aris-bags

1. GitHub **Eugecom** → repo **aris-bags** → **Settings** → **Secrets and variables** → **Actions**.
2. **New repository secret**
   - Name: `RENDER_MIRROR_TOKEN`
   - Value: el token del paso 2.
3. **Variables** → **New repository variable**
   - Name: `RENDER_MIRROR_REPO`
   - Value: el repo que usa Render, ej. `eugenio-ctrl/aris-bags` o `euge-dotnet/aris-bags` (usuario/nombre exacto en la URL de GitHub)

---

## Paso 4 — Primera copia del código

En GitHub **Eugecom/aris-bags** → **Actions** → workflow **Mirror for Render** → **Run workflow** (branch `main`).

O desde tu PC (una vez), si tenés acceso a euge-dotnet:

```powershell
cd d:\projects\arisbag
git remote add render https://github.com/euge-dotnet/aris-bags.git
git push render main
```

---

## Paso 5 — Render Blueprint

1. Render → **New** → **Blueprint**.
2. Repo: **euge-dotnet/aris-bags** (ya debería aparecer).
3. Variables: `DATABASE_URL`, Cloudinary, etc. (ver `docs/DEPLOY.md`).
4. Tras el deploy de la API, en **aris-bags-web**: `VITE_API_URL` = URL de la API.
5. En la API: `CORS_ORIGIN` = URL de la tienda en Render.

---

## Si la API falló en Render (“Failed deploy”)

1. Servicio **aris-bags-api** → **Logs** (el error suele ser build o `DATABASE_URL` vacía).
2. **Environment** → confirmá **DATABASE_URL** (Neon) y Cloudinary.
3. Asegurate de tener el último `render.yaml` (API en **Node**, no Docker): hacé push a Eugecom y corré el mirror o **Manual Sync** en Render.
4. **Blueprint** → **Manual sync** o borrá el servicio API fallido y volvé a aplicar el blueprint.

## Día a día

```powershell
git push origin main
```

Eso dispara el Action y actualiza el espejo → Render redeploya (si tenés auto-deploy activado).

---

## Espejo manual (sin Actions)

```powershell
git push origin main
git push render main
```

(`render` = remote a `euge-dotnet/aris-bags`.)

---

## Login Methods vs Git Deployment Credentials

En Render:

- **Login Methods** = cómo entrás al dashboard (puede quedar euge-dotnet).
- **Git Deployment Credentials** = qué repos lee Render → **euge-dotnet** está bien si el Blueprint apunta a **euge-dotnet/aris-bags**.

No hace falta conectar Eugecom en Render si usás el espejo.
