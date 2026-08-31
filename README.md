# RiwiMediCare Plus API

**Coder:** Santiago Otalora — ** node_nest  
**Repository:** https://github.com/Otalora010/RiwiMediCare_prueba_node 

REST API to manage medication and medical-supply replenishment requests. It replaces the manual process (emails and spreadsheets) used by RiwiMediCare Plus, which distributes to clinics and care centers.

## Stack

- Node.js 20, Express 5, strict TypeScript
- PostgreSQL 15, Sequelize 6
- JWT (jsonwebtoken), bcryptjs
- Direct validations (no external validation libraries)
- Swagger/OpenAPI with swagger-jsdoc + swagger-ui-express
- Multer for seed file upload
- Docker and Docker Compose
- GitFlow (main / develop / feature/*)

## Architecture

```
Request → Routes → Middlewares → Controllers → Services → Repositories → Sequelize → PostgreSQL
```

- `routes`: endpoints and OpenAPI/JSDoc.
- `middlewares`: `authenticate`, `authorize`, named validations, `errorMiddleware`.
- `controllers`: thin, only translate HTTP.
- `services`: business rules (existence, stock, unique NIT, states).
- `repositories`: only layer that touches Sequelize.
- `models`: entities and bidirectional associations.
- `dto`: input interfaces.
- `docs/swagger.ts`: OpenAPI 3.0.3 spec.

## Entities

| Entity | Key fields |
|---|---|
| **User** | id UUID, name, unique email, hashed password, role `ADMIN` \| `GESTOR`, isActive |
| **Clinica** | id, name, unique nit, responsable, estado `ACTIVA` \| `ELIMINADA`, timestamps |
| **Almacen** | id, name, location, estado `ACTIVO` \| `ELIMINADO` |
| **Medicamento** | id, name, stock ≥0, almacenId FK, estado `ACTIVO` \| `ELIMINADO` |
| **Solicitud** | id, clinicaId FK, medicamentoId FK, almacenId FK, cantidadSolicitada >0, estado `PENDIENTE` \| `APROBADA` \| `RECHAZADA` \| `DESPACHADA` \| `CANCELADA` \| `ELIMINADA`, userId FK |

**Relations (belongsTo/hasMany both ways):**
- Almacen 1:N Medicamento
- Clinica 1:N Solicitud, Medicamento 1:N Solicitud, Almacen 1:N Solicitud, User 1:N Solicitud

**Logical delete:** DELETE does not remove the row; it changes `estado` to `ELIMINADA`/`ELIMINADO`.

## Roles and permissions

| Action | ADMIN | GESTOR | Authenticated |
|---|---:|---:|---:|
| CRUD Clinica (POST/PATCH/DELETE) |
| GET Clinicas | 
| CRUD Almacen |
| CRUD Medicamento |
| POST Solicitud | 
| PUT Solicitud estado 
| GET activas / historial / by clinica / by id
| DELETE Solicitud (logical) 
| POST /api/seed/upload 

`POST /api/auth/register` is public and the user chooses its own role (`ADMIN` or `GESTOR`). Login is public. Everything else requires a `Bearer` JWT.

> **Ports:** `3000` y `3002` suelen estar ocupados. Local (`npm run dev`) usa **`3002`** (`PORT=3002`). Docker escucha `3000` interno y mapea a host **`3003`** por defecto (`HOST_PORT=3003`). Deben ser distintos para correr dev y Docker a la vez. Usa `HOST_PORT=4000 docker compose up` o `npm run docker:up` (auto-detecta puerto libre) → Swagger en `http://localhost:3003/api/docs/`.

## Endpoints

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
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
| GET | `/api/solicitudes` | JWT (alias for historial) |
| GET | `/api/solicitudes/:id` | JWT |
| PUT | `/api/solicitudes/:id/estado` | ADMIN, GESTOR |
| DELETE | `/api/solicitudes/:id` | ADMIN |
| POST | `/api/seed/upload` | ADMIN (multipart) |

Swagger UI: `http://localhost:3003/api/docs/` (Docker) / `http://localhost:3002/api/docs/` (dev sin Docker) — use it to try the API manually. The trailing `/` is required; `/api/docs` redirects to `/api/docs/`. Si usas `HOST_PORT` distinto, cambia el puerto en la URL.

## Environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Current `.env.example`:

```
# RiwiMediCare Plus — copy to .env and adjust values
# Local dev (npm run dev) runs on PORT (default 3002) — 3000 suele estar ocupado
# Docker: api escucha 3000 interno, host es HOST_PORT (default 3003) -> http://localhost:3003/api/docs/
# IMPORTANTE: HOST_PORT debe ser distinto de PORT si quieres correr dev y Docker a la vez
NODE_ENV=development
PORT=3002
HOST_PORT=3003
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

## Local installation

Requirements: Node.js 20+, PostgreSQL 15+.

```bash
npm install
cp .env.example .env
# adjust POSTGRES_* and JWT_SECRET if needed
npm run dev
```

API at `http://localhost:3002/api` (dev) o `http://localhost:3003/api` (Docker), health en `/health`, Swagger en `http://localhost:3003/api/docs/` (Docker) / `http://localhost:3002/api/docs/` (dev).

Build and checks:

```bash
npm run typecheck
npm run build
npm start
```

## Docker

Docker escucha `3000` interno y expone `HOST_PORT` en el host (por defecto `3003` porque `3000` y `3002` suelen estar ocupados). Local sin Docker usa `PORT=3002`. Deben ser distintos para correr ambos a la vez.

**Opción A — automática (recomendada, a prueba de puertos ocupados):**
```bash
npm run docker:up
# o: bash scripts/docker-up.sh
# busca el primer puerto libre entre 3003,3001,3004... y levanta
# Swagger -> http://localhost:3003/api/docs/ (con / final)
# health   -> http://localhost:3003/health
```

**Opción B — manual:**
```bash
cp .env.example .env
docker compose up --build -d
# la API espera a que postgres esté healthy (db:5432 interno, 5436 en host)
docker compose logs -f api
# Swagger -> http://localhost:3003/api/docs/ (con / final)
# health   -> http://localhost:3003/health
```

O define `HOST_PORT=3003` en tu `.env`. Verifica puertos: `ss -tulpn | grep -E '3000|3001|3002|3003'`.

Stop without deleting data:

```bash
docker compose down
```

Delete everything (including DB):

```bash
docker compose down -v
```

## Seed

### Option 1 — classic script (still available)

```bash
npm run db:seed
```

Creates:
- ADMIN `admin@example.com` / `Admin123*`
- GESTOR `user@example.com` / `User123*`

### Option 2 — multer endpoint (required by the exercise)

`POST /api/seed/upload` — ADMIN only, `multipart/form-data`, field `file` with JSON.

Example `seed.json` (`seed.example.json` in the repo):

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

With curl (Docker usa 3003, dev usa 3002 — ajusta el puerto):

```bash
# login as admin to get a token (usa 3003 si estás en Docker, 3002 si es npm run dev)
TOKEN=$(curl -s http://localhost:3003/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123*"}' | jq -r .data.token)

curl -X POST http://localhost:3003/api/seed/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F file=@seed.json
```

Response:

```json
{ "success": true, "data": { "usuarios": 2, "clinicas": 2, "almacenes": 2, "medicamentos": 3 } }
```

From Swagger UI: open `POST /api/seed/upload`, click “Try it out”, choose the `.json` file in the `file` field and execute with an ADMIN token in “Authorize”.

## Validations and errors

Named middlewares: `validateRegister`, `validateLogin`, `validateClinica`, `validateAlmacen`, `validateMedicamento`, `validateSolicitud`, `validateSolicitudEstado`, `validateId`, `validateRole`.

Rules:
- Unique NIT (409)
- Clinica/medicamento/almacen must exist and not be logically deleted
- `cantidadSolicitada > 0` and ≤ stock
- Medicamento must belong to the given almacen
- Initial estado is always `PENDIENTE`
- `PUT /:id/estado` only accepts `PENDIENTE|APROBADA|RECHAZADA|DESPACHADA|CANCELADA`
- DELETE = logical delete

Codes: 400 VALIDATION, 401 UNAUTH, 403 FORBIDDEN, 404 NOT_FOUND, 409 DUPLICATE, 500 INTERNAL.

## DB backup

Not generated automatically. To create a dump:

```bash
pg_dump -h localhost -p 5432 -U postgres desempeño > backup.sql
# or inside Docker:
docker compose exec db pg_dump -U postgres exam_db > backup.sql
```

## Diagrams

ER model and request flow are in `docs/` (if applicable) and in Swagger. The `db` container uses `postgres:15-alpine` and `api` uses `node:20-alpine` multi-stage.

## Scripts

| Command | Usage |
|---|---|
| `npm run dev` | Development with reload (tsx watch) (`3002`) |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled code |
| `npm run typecheck` | Check types |
| `npm run db:seed` | Classic seed |
| `npm run docker:up` | Docker con auto-detección de puerto libre → `3003:/api/docs/` |
| `npm run docker:down` | `docker compose down` |
| `npm run docker:logs` | `docker compose logs -f api` |

> `DB_SYNC=true` for speed in the exam. In production use versioned migrations.
