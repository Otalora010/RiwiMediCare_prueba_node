# RiwiMediCare Plus API

**Coder:** Santiago Otalora — **Clan:** node_nest  
**Repositorio:** https://github.com/Otalora010/RiwiMediCare_prueba_node (público)

API REST para gestionar solicitudes de abastecimiento de medicamentos e insumos médicos. Reemplaza el proceso manual (correos y hojas de cálculo) de RiwiMediCare Plus, que distribuye a clínicas y centros de atención.

## Stack

- Node.js 20, Express 5, TypeScript estricto
- PostgreSQL 15, Sequelize 6
- JWT (jsonwebtoken), bcryptjs
- Validaciones directas (sin librerías externas)
- Swagger/OpenAPI con swagger-jsdoc + swagger-ui-express
- Multer para carga de seed vía archivo
- Docker y Docker Compose
- GitFlow (main / develop / feature/*)

## Arquitectura

```
Request → Routes → Middlewares → Controllers → Services → Repositories → Sequelize → PostgreSQL
```

- `routes`: endpoints y JSDoc OpenAPI.
- `middlewares`: `authenticate`, `authorize`, validaciones nombradas, `errorMiddleware`.
- `controllers`: delgados, solo traducen HTTP.
- `services`: reglas de negocio (existencia, stock, NIT único, estados).
- `repositories`: única capa que toca Sequelize.
- `models`: entidades y asociaciones en ambos sentidos.
- `dto`: interfaces de entrada.
- `docs/swagger.ts`: spec OpenAPI 3.0.3.

## Entidades

| Entidad | Campos clave |
|---|---|
| **User** | id UUID, name, email único, password hash, role `ADMIN` \| `GESTOR`, isActive |
| **Clinica** | id, name, nit único, responsable, estado `ACTIVA` \| `ELIMINADA`, timestamps |
| **Almacen** | id, name, location, estado `ACTIVO` \| `ELIMINADO` |
| **Medicamento** | id, name, stock ≥0, almacenId FK, estado `ACTIVO` \| `ELIMINADO` |
| **Solicitud** | id, clinicaId FK, medicamentoId FK, almacenId FK, cantidadSolicitada >0, estado `PENDIENTE` \| `APROBADA` \| `RECHAZADA` \| `DESPACHADA` \| `CANCELADA` \| `ELIMINADA`, userId FK |

**Relaciones (belongsTo/hasMany en ambos sentidos):**
- Almacen 1:N Medicamento
- Clinica 1:N Solicitud, Medicamento 1:N Solicitud, Almacen 1:N Solicitud, User 1:N Solicitud

**Borrado lógico:** DELETE no borra, cambia `estado` a `ELIMINADA`/`ELIMINADO`.

## Roles y permisos

| Acción | ADMIN | GESTOR | Autenticado |
|---|---:|---:|---:|
| CRUD Clínica (POST/PATCH/DELETE) | ✓ | ✗ | — |
| GET Clínicas | ✓ | ✓ | ✓ |
| CRUD Almacén | ✓ | ✗ | — |
| CRUD Medicamento | ✓ | ✗ | — |
| POST Solicitud | ✓ | ✓ | — |
| PUT estado Solicitud | ✓ | ✓ | — |
| GET activas / historial / por clínica / por id | ✓ | ✓ | ✓ |
| DELETE Solicitud (lógico) | ✓ | ✗ | — |
| POST /api/seed/upload | ✓ | ✗ | — |

Registro `POST /api/auth/register` es público y el usuario elige su rol (`ADMIN` o `GESTOR`). Login público. El resto requiere JWT `Bearer`.

## Endpoints

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/auth/register` | Público |
| POST | `/api/auth/login` | Público |
| GET | `/api/auth/me` | JWT |
| GET | `/api/users` | ADMIN |
| PATCH | `/api/users/:id/role` | ADMIN |
| DELETE | `/api/users/:id` | ADMIN |
| GET | `/api/clinicas` | JWT |
| POST | `/api/clinicas` | ADMIN |
| GET | `/api/clinicas/:id` | JWT |
| PATCH | `/api/clinicas/:id` | ADMIN |
| DELETE | `/api/clinicas/:id` | ADMIN |
| GET | `/api/clinicas/:id/solicitudes` | JWT |
| GET | `/api/almacenes` | JWT |
| POST | `/api/almacenes` | ADMIN |
| GET | `/api/almacenes/:id` | JWT |
| PATCH | `/api/almacenes/:id` | ADMIN |
| DELETE | `/api/almacenes/:id` | ADMIN |
| GET | `/api/medicamentos` | JWT |
| POST | `/api/medicamentos` | ADMIN |
| GET | `/api/medicamentos/:id` | JWT |
| PATCH | `/api/medicamentos/:id` | ADMIN |
| DELETE | `/api/medicamentos/:id` | ADMIN |
| POST | `/api/solicitudes` | ADMIN, GESTOR |
| GET | `/api/solicitudes/activas` | JWT |
| GET | `/api/solicitudes/historial` | JWT |
| GET | `/api/solicitudes` | JWT (alias historial) |
| GET | `/api/solicitudes/:id` | JWT |
| PUT | `/api/solicitudes/:id/estado` | ADMIN, GESTOR |
| DELETE | `/api/solicitudes/:id` | ADMIN |
| POST | `/api/seed/upload` | ADMIN (multipart) |

Swagger UI: `http://localhost:3000/api/docs` — probables manualmente desde ahí.

## Variables de entorno

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

Contenido de `.env.example`:

```
NODE_ENV=development
PORT=3000
API_PREFIX=/api

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=desempeño
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DB_LOGGING=false
DB_SYNC=true

JWT_SECRET=replace-with-a-long-random-secret-of-at-least-32-characters
JWT_EXPIRES_IN=4h
BCRYPT_ROUNDS=10
CORS_ORIGIN=*

ADMIN_NAME=Administrador
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123*
```

## Instalación local

Requisitos: Node.js 20+, PostgreSQL 15+.

```bash
npm install
cp .env.example .env
# ajusta POSTGRES_* y JWT_SECRET
npm run dev
```

API en `http://localhost:3000/api`, health `http://localhost:3000/health`, Swagger `http://localhost:3000/api/docs`.

Build y verificación:

```bash
npm run typecheck
npm run build
npm start
```

## Docker

```bash
cp .env.example .env
docker compose up --build -d
# la API espera a que postgres esté healthy (db:5432 interno, 5436 en host)
docker compose logs -f api
```

Detener sin borrar datos:

```bash
docker compose down
```

Borrar todo (incluida base):

```bash
docker compose down -v
```

## Seed

### Opción 1 — script clásico (sigue disponible)

```bash
npm run db:seed
```

Crea:
- ADMIN `admin@example.com` / `Admin123*`
- GESTOR `user@example.com` / `User123*`

### Opción 2 — endpoint con multer (requisito del enunciado)

`POST /api/seed/upload` — solo ADMIN, `multipart/form-data`, campo `file` con JSON.

Ejemplo `seed.json`:

```json
{
  "usuarios": [
    { "name": "Admin Demo", "email": "admin.demo@example.com", "password": "Admin123*", "role": "ADMIN" },
    { "name": "Gestor Demo", "email": "gestor@example.com", "password": "Gestor123*", "role": "GESTOR" }
  ],
  "clinicas": [
    { "name": "Clínica Norte", "nit": "900123456-1", "responsable": "Dra. Laura Gómez" },
    { "name": "Centro Sur", "nit": "900123456-2", "responsable": "Dr. Carlos Ruiz" }
  ],
  "almacenes": [
    {
      "name": "Almacén Central",
      "location": "Bogotá - Sede Norte",
      "medicamentos": [
        { "name": "Acetaminofén 500mg", "stock": 200 },
        { "name": "Ibuprofeno 400mg", "stock": 150 }
      ]
    },
    { "name": "Almacén Sur", "location": "Cali" }
  ],
  "medicamentos": [
    { "name": "Amoxicilina 500mg", "stock": 100, "almacenName": "Almacén Sur" }
  ]
}
```

Uso con curl:

```bash
# login como admin para obtener token
TOKEN=$(curl -s http://localhost:3000/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123*"}' | jq -r .data.token)

curl -X POST http://localhost:3000/api/seed/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F file=@seed.json
```

Respuesta:

```json
{ "success": true, "data": { "usuarios": 2, "clinicas": 2, "almacenes": 2, "medicamentos": 3 } }
```

Desde Swagger UI: abre `POST /api/seed/upload`, click “Try it out”, elige el `.json` en el campo file y ejecuta con el token de un ADMIN en “Authorize”.

## Validaciones y errores

Middlewares nombrados: `validateRegister`, `validateLogin`, `validateClinica`, `validateAlmacen`, `validateMedicamento`, `validateSolicitud`, `validateSolicitudEstado`, `validateId`, `validateRole`.

Reglas:
- NIT único (409)
- Clínica/medicamento/almacén deben existir y no estar eliminados
- `cantidadSolicitada > 0` y ≤ stock
- Medicamento debe pertenecer al almacén indicado
- Estado inicial siempre `PENDIENTE`
- `PUT /:id/estado` solo acepta `PENDIENTE|APROBADA|RECHAZADA|DESPACHADA|CANCELADA`
- DELETE = borrado lógico

Códigos: 400 VALIDATION, 401 UNAUTH, 403 FORBIDDEN, 404 NOT_FOUND, 409 DUPLICATE, 500 INTERNAL.

## Backup de BD

No se genera automáticamente. Para crear el dump:

```bash
pg_dump -h localhost -p 5432 -U postgres desempeño > backup.sql
# o dentro de Docker:
docker compose exec db pg_dump -U postgres exam_db > backup.sql
```

## Diagramas

Modelo ER y flujo de solicitudes en `docs/` (si aplica) y en el Swagger. El contenedor `db` usa `postgres:15-alpine` y `api` es `node:20-alpine` multi-stage.

## Scripts

| Comando | Uso |
|---|---|
| `npm run dev` | Desarrollo con recarga (tsx watch) |
| `npm run build` | Compila TypeScript |
| `npm start` | Ejecuta compilado |
| `npm run typecheck` | Verifica tipos |
| `npm run db:seed` | Seed clásico |

> `DB_SYNC=true` por velocidad en la prueba. En producción usar migraciones versionadas.
