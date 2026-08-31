/**
 * Resource routes.
 * Defines resource endpoints and OpenAPI documentation.
 */
import { Router } from 'express';
import { ResourceController } from '../controllers/resource.controller';
import { authenticate } from '../middlewares/auth.middleware';
import {
  validateId,
  validateResource,
  validateResourceQuery,
} from '../middlewares/validation.middleware';

export const resourceRouter = Router();

/**
 * @openapi
 * /resources:
 *   get:
 *     tags: [Resources]
 *     summary: Lista recursos con filtros y paginación
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10 } }
 *       - { in: query, name: status, schema: { type: string, enum: [ACTIVE, INACTIVE] } }
 *       - { in: query, name: categoryId, schema: { type: string, format: uuid } }
 *       - { in: query, name: search, schema: { type: string } }
 *     responses:
 *       200: { description: Lista paginada }
 *   post:
 *     tags: [Resources]
 *     summary: Crea un recurso para el usuario autenticado
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ResourceInput' }
 *     responses:
 *       201: { description: Resource created }
 */
resourceRouter
  .route('/')
  .get(validateResourceQuery, ResourceController.list)
  .post(authenticate, validateResource, ResourceController.create);

/**
 * @openapi
 * /resources/{id}:
 *   get:
 *     tags: [Resources]
 *     summary: Obtiene un recurso con su categoría y propietario
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Resource found }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Resources]
 *     summary: Actualiza un recurso (propietario o ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ResourceInput' }
 *     responses:
 *       200: { description: Resource updated }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   delete:
 *     tags: [Resources]
 *     summary: Elimina un recurso (propietario o ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Resource deleted }
 */
resourceRouter
  .route('/:id')
  .get(validateId, ResourceController.getById)
  .patch(
    authenticate,
    validateId,
    validateResource,
    ResourceController.update,
  )
  .delete(authenticate, validateId, ResourceController.delete);
