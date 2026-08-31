import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validateId, validateRole } from '../middlewares/validation.middleware';
import { Role } from '../models/User';

export const userRouter = Router();
userRouter.use(authenticate, authorize(Role.ADMIN));

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Lista usuarios (solo ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10 } }
 *     responses:
 *       200: { description: Lista paginada }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */
userRouter.get('/', UserController.list);

/**
 * @openapi
 * /users/{id}/role:
 *   patch:
 *     tags: [Users]
 *     summary: Cambia el rol de un usuario (solo ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties: { role: { type: string, enum: [ADMIN, USER] } }
 *     responses:
 *       200: { description: Rol actualizado }
 */
userRouter.patch(
  '/:id/role',
  validateId,
  validateRole,
  UserController.updateRole,
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Elimina un usuario (solo ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Usuario eliminado }
 */
userRouter.delete('/:id', validateId, UserController.delete);
