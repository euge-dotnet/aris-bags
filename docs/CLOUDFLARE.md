# Cloudflare — notas de compatibilidad

Este documento se ampliará antes del despliegue real. No se asume una modalidad concreta de Cloudflare.

## Lo que ya es compatible

El frontend Vite genera archivos estáticos. Eso encaja con Cloudflare Pages.

## Lo que no se asume

Express corre sobre Node.js. **No** se convierte automáticamente a Cloudflare Workers.

Si más adelante se elige Workers, habrá que adaptar la API de forma explícita (por ejemplo Hono + Prisma adapter compatible). Esa decisión se toma cuando se confirme la modalidad disponible.

## Mientras tanto

La API se desarrolla y se prueba como servidor Node local. El host de producción de la API se define en la etapa de despliegue.
