# Sistema de Reparaciones (ES6+ + HTTP) — Versión "bonita"

## ¿Por qué te salía HTTP 404 y 405?
- **404**: el servidor donde abriste la página **no** tiene los endpoints `/api/...`.
- **405**: típicamente ocurre si abres el frontend con un servidor estático (p. ej., Live Server),
  porque ese servidor suele permitir solo GET/HEAD y rechaza POST.

**Solución recomendada:** abrir el proyecto desde el servidor Express:
- http://localhost:3000

**Solución alternativa (si usas Live Server):**
- Mantén corriendo el backend en 3000.
- Este frontend detecta que no está en 3000 y llamará a `http://localhost:3000/api/...` automáticamente.

## Requisitos
- Node.js 18+ (Windows/Mac/Linux).
- npm.

## Ejecución (VSCode)
1) Abre la carpeta del proyecto.
2) Terminal integrada (PowerShell o CMD):
```bash
npm install
npm run start
```
3) Abre:
- http://localhost:3000

## Flujo del reto (casos de uso)
1) **IMEI y serial no reportados**: `GET /api/devices/reported`
2) **Primera revisión + diagnóstico**: `POST /api/repairs/:id/initial-diagnosis`
3) **Autorización escrita + abono >= 50%**: `POST /api/repairs/:id/authorize`
4) **Asignación de técnico por skills (marca)**: `POST /api/repairs/:id/assign-technician`
5) **Agregar repuestos**: `POST /api/repairs/:id/parts`
6) **Estaciones / estados**: `POST /api/repairs/:id/advance` y `GET /api/repairs/:id`

## Persistencia
- En memoria (demo): al reiniciar el servidor, se pierde el contenido.
