# Backend Exam Template

Base reutilizable para una prueba de desempeño backend. Incluye autenticación JWT, roles, CRUD, relaciones, validaciones, arquitectura por capas, PostgreSQL/Sequelize, Swagger, JSDoc, Docker y seeders.

## Stack

- Node.js 20, Express 5 y TypeScript estricto
- PostgreSQL 15 y Sequelize 6
- JWT, bcrypt y validaciones directas
- Swagger/OpenAPI documentado con JSDoc
- Docker y Docker Compose

## Arquitectura

```text
Request → Routes → Middlewares → Controllers → Services → Repositories → Sequelize → PostgreSQL
```

- `routes`: endpoints y documentación OpenAPI/JSDoc.
- `middlewares`: autenticación, roles, validación y errores.
- `controllers`: traduce HTTP; no contiene reglas de negocio.
- `services`: reglas del problema y permisos por propietario.
- `repositories`: única capa que consulta Sequelize.
- `models`: entidades y relaciones.
- `dto`: interfaces TypeScript para los datos de entrada.
- `middlewares/validation.middleware.ts`: validaciones sencillas y fáciles de modificar.
- `server.ts`: configura Express, middlewares, rutas y Swagger.
- `index.ts`: conecta PostgreSQL, sincroniza modelos y arranca el servidor.

## Inicio rápido local

Requisitos: Node.js 20+ y PostgreSQL.

```bash
cp .env.example .env
npm install
npm run dev
```

La API queda en `http://localhost:3000/api`, el health check en `http://localhost:3000/health` y Swagger en `http://localhost:3000/api/docs`.

Para cargar datos iniciales:

```bash
npm run db:seed
```

Credenciales del seed:

| Rol | Correo | Contraseña |
| --- | --- | --- |
| ADMIN | `admin@example.com` | `Admin123*` |
| USER | `user@example.com` | `User123*` |

## Inicio con Docker

```bash
cp .env.example .env
docker compose up --build -d
docker compose exec api node dist/src/database/seeders/seed.js
```

Para detenerlo sin borrar la base de datos:

```bash
docker compose down
```

## Scripts

| Comando | Uso |
| --- | --- |
| `npm run dev` | Desarrollo con recarga automática |
| `npm run build` | Compila TypeScript |
| `npm start` | Ejecuta el código compilado |
| `npm run typecheck` | Verifica tipos sin generar archivos |
| `npm run db:seed` | Carga usuarios, categorías y recursos |

## Módulos incluidos

### Auth y usuarios

- Registro y login con contraseñas cifradas.
- JWT Bearer y endpoint `/auth/me`.
- Roles `ADMIN` y `USER`.
- La contraseña nunca aparece en las consultas normales.
- Solo `ADMIN` lista usuarios, cambia roles y elimina cuentas.

### Category y Resource

Son entidades deliberadamente genéricas. `Category` tiene muchos `Resource`; cada `Resource` pertenece a una categoría y a un usuario propietario.

- Lectura pública.
- Categorías administradas por `ADMIN`.
- Recursos creados por usuarios autenticados.
- Solo el propietario o un `ADMIN` puede modificar/eliminar un recurso.
- Paginación, búsqueda y filtros.

## Endpoints principales

| Método | Ruta | Acceso |
| --- | --- | --- |
| POST | `/api/auth/register` | Público |
| POST | `/api/auth/login` | Público |
| GET | `/api/auth/me` | Autenticado |
| GET | `/api/users` | ADMIN |
| PATCH | `/api/users/:id/role` | ADMIN |
| DELETE | `/api/users/:id` | ADMIN |
| GET | `/api/categories` | Público |
| POST | `/api/categories` | ADMIN |
| GET | `/api/categories/:id` | Público |
| PATCH/DELETE | `/api/categories/:id` | ADMIN |
| GET | `/api/resources` | Público |
| POST | `/api/resources` | Autenticado |
| GET | `/api/resources/:id` | Público |
| PATCH/DELETE | `/api/resources/:id` | Propietario o ADMIN |

## Respuestas consistentes

Éxito:

```json
{ "success": true, "data": {} }
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación",
    "details": {}
  }
}
```

## Cómo adaptarla el día de la prueba

Lee primero [docs/ADAPTATION_GUIDE.md](docs/ADAPTATION_GUIDE.md). Allí está el orden exacto para convertir `Category` y `Resource` en las entidades del enunciado sin romper las capas. Los diagramas están en [docs/DIAGRAMS.md](docs/DIAGRAMS.md), la estrategia de Git en [docs/GIT_GUIDE.md](docs/GIT_GUIDE.md) y el prompt para que Codex adapte la plantilla en [PROMPT_CODEX.md](PROMPT_CODEX.md).

> Para una prueba se deja `DB_SYNC=true` por velocidad. En un proyecto de producción debe cambiarse por migraciones versionadas.
