# Prompt para adaptar esta plantilla al enunciado

Copia este texto en Codex y pega al final el enunciado completo de la prueba:

```text
Actúa como un desarrollador backend senior. Trabaja sobre la plantilla existente sin reconstruirla desde cero.

Stack obligatorio: Node.js 20, Express 5, TypeScript estricto, PostgreSQL, Sequelize 6, JWT, validaciones directas, Swagger/JSDoc, Docker y Git. No agregues Zod, Jest, Supertest ni pruebas automatizadas.

Arquitectura obligatoria:
Routes → Middlewares → Controllers → Services → Repositories → Sequelize → PostgreSQL.

Objetivo:
Adapta los módulos genéricos Category y Resource al dominio del enunciado. Conserva User, autenticación, manejo de errores y estructura por capas cuando sean compatibles. Si hace falta una entidad transaccional adicional, impleméntala en todas las capas.

Reglas de trabajo:
1. Lee primero todo el repositorio y el enunciado.
2. Antes de editar, entrega un mapa breve: entidades, campos, relaciones, roles, endpoints y reglas de negocio.
3. No inventes requisitos que contradigan el enunciado.
4. Modela PK/FK, nulabilidad, índices y asociaciones Sequelize en ambos sentidos.
5. Valida body, params y query con middlewares nombrados y fáciles de entender.
6. Mantén controllers delgados; coloca reglas en services y consultas en repositories.
7. Implementa JWT, roles y autorización por propiedad donde aplique.
8. Usa errores uniformes con status 400, 401, 403, 404 y 409.
9. Documenta todas las rutas en Swagger con JSDoc y actualiza los schemas de OpenAPI.
10. Actualiza seed, README, .env.example, Docker y diagramas.
11. Permite comprobar manualmente la API desde Swagger UI.
12. Ejecuta npm run typecheck y npm run build; corrige todos los errores.
13. No borres funcionalidades útiles ni expongas contraseñas o secretos.
14. Al terminar resume archivos cambiados, endpoints, credenciales seed y comandos exactos.

ENUNCIADO DE LA PRUEBA:
[PEGAR AQUÍ]
```
