/**
 * Category routes.
 * Defines category endpoints and OpenAPI documentation.
 */
import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validateCategory, validateId } from '../middlewares/validation.middleware';
import { Role } from '../models/User';

export const categoryRouter = Router();

/**
 * @openapi
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Lista categorías
 *     responses:
 *       200: { description: Categories with resource count }
 *   post:
 *     tags: [Categories]
 *     summary: Crea una categoría (solo ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CategoryInput' }
 *     responses:
 *       201: { description: Category created }
 */
categoryRouter
  .route('/')
  .get(CategoryController.list)
  .post(authenticate, authorize(Role.ADMIN), validateCategory, CategoryController.create);

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Obtiene una categoría
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Category found }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Categories]
 *     summary: Actualiza una categoría (solo ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CategoryInput' }
 *     responses:
 *       200: { description: Category updated }
 *   delete:
 *     tags: [Categories]
 *     summary: Elimina una categoría vacía (solo ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Category deleted }
 *       409: { description: La categoría contiene recursos }
 */
categoryRouter
  .route('/:id')
  .get(validateId, CategoryController.getById)
  .patch(
    authenticate,
    authorize(Role.ADMIN),
    validateId,
    validateCategory,
    CategoryController.update,
  )
  .delete(
    authenticate,
    authorize(Role.ADMIN),
    validateId,
    CategoryController.delete,
  );
