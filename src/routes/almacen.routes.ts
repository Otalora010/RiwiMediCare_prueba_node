/**
 * Almacen routes.
 * Defines warehouse endpoints and OpenAPI documentation.
 */
import { Router } from 'express';
import { AlmacenController } from '../controllers/almacen.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validateAlmacen, validateId } from '../middlewares/validation.middleware';
import { Role } from '../models/User';

export const almacenRouter = Router();

/**
 * @openapi
 * /almacenes:
 *   get:
 *     tags: [Almacenes]
 *     summary: Lista almacenes activos
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Almacenes activos }
 *   post:
 *     tags: [Almacenes]
 *     summary: Crea un almacén (solo ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AlmacenInput' }
 *     responses:
 *       201: { description: Almacén creado }
 */
almacenRouter
  .route('/')
  .get(authenticate, AlmacenController.list)
  .post(authenticate, authorize(Role.ADMIN), validateAlmacen, AlmacenController.create);

/**
 * @openapi
 * /almacenes/{id}:
 *   get:
 *     tags: [Almacenes]
 *     summary: Obtiene un almacén por id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Almacén encontrado }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Almacenes]
 *     summary: Actualiza un almacén (solo ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AlmacenInput' }
 *     responses:
 *       200: { description: Almacén actualizado }
 *   delete:
 *     tags: [Almacenes]
 *     summary: Elimina lógicamente un almacén (solo ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Almacén eliminado }
 */
almacenRouter
  .route('/:id')
  .get(authenticate, validateId, AlmacenController.getById)
  .patch(authenticate, authorize(Role.ADMIN), validateId, validateAlmacen, AlmacenController.update)
  .delete(authenticate, authorize(Role.ADMIN), validateId, AlmacenController.delete);
