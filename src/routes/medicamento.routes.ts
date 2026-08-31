import { Router } from 'express';
import { MedicamentoController } from '../controllers/medicamento.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validateId, validateMedicamento } from '../middlewares/validation.middleware';
import { Role } from '../models/User';
export const medicamentoRouter = Router();

/**
 * @openapi
 * /medicamentos:
 *   get:
 *     tags: [Medicamentos]
 *     summary: Lists active medicines
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Active medicines }
 *   post:
 *     tags: [Medicamentos]
 *     summary: Creates a medicine (ADMIN only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MedicamentoInput' }
 *     responses:
 *       201: { description: Medicine created }
 */
medicamentoRouter
  .route('/')
  .get(authenticate, MedicamentoController.list)
  .post(authenticate, authorize(Role.ADMIN), validateMedicamento, MedicamentoController.create);

/**
 * @openapi
 * /medicamentos/{id}:
 *   get:
 *     tags: [Medicamentos]
 *     summary: Gets a medicine by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Medicine found }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Medicamentos]
 *     summary: Updates a medicine (ADMIN only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MedicamentoInput' }
 *     responses:
 *       200: { description: Medicine updated }
 *   delete:
 *     tags: [Medicamentos]
 *     summary: Soft deletes a medicine (ADMIN only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Medicine deleted }
 */
medicamentoRouter
  .route('/:id')
  .get(authenticate, validateId, MedicamentoController.getById)
  .patch(authenticate, authorize(Role.ADMIN), validateId, validateMedicamento, MedicamentoController.update)
  .delete(authenticate, authorize(Role.ADMIN), validateId, MedicamentoController.delete);