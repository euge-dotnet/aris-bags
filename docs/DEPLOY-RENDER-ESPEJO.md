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

## Paso 2 — Deploy key (escritura en euge-dotnet/aris-bags)

Los PAT suelen fallar con 403; usamos **deploy key**.

1. En PowerShell (una vez):

```powershell
ssh-keygen -t ed25519 -f $env:USERPROFILE\.ssh\arisbag-mirror -N '""'
Get-Content $env:USERPROFILE\.ssh\arisbag-mirror.pub
```

2. Copiá la línea que empieza con `ssh-ed25519`.

3. GitHub como **euge-dotnet** → repo **aris-bags** → **Settings** → **Deploy keys** → **Add deploy key**.
   - Title: `eugecom-mirror`
   - Key: pegá la clave pública
   - Marcá **Allow write access** (importante)

4. Copiá la clave **privada** (no la subas al repo):

```powershell
Get-Content $env:USERPROFILE\.ssh\arisbag-mirror
```

---

## Paso 3 — Secrets en Eugecom/aris-bags

1. GitHub **Eugecom** → repo **aris-bags** → **Settings** → **Secrets and variables** → **Actions**.
2. **New repository secret**
   - Name: `MIRROR_DEPLOY_KEY`
   - Value: contenido completo de la clave privada (`-----BEGIN ...`)
3. Podés borrar el secret viejo `RENDER_MIRROR_TOKEN` (ya no se usa).
4. **Variables** → `RENDER_MIRROR_REPO` = `euge-dotnet/aris-bags`

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
