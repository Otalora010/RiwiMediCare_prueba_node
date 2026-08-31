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
 *     summary: Lista medicamentos activos
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Medicamentos activos }
 *   post:
 *     tags: [Medicamentos]
 *     summary: Crea un medicamento (solo ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MedicamentoInput' }
 *     responses:
 *       201: { description: Medicamento creado }
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
 *     summary: Obtiene un medicamento por id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Medicamento encontrado }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Medicamentos]
 *     summary: Actualiza un medicamento (solo ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MedicamentoInput' }
 *     responses:
 *       200: { description: Medicamento actualizado }
 *   delete:
 *     tags: [Medicamentos]
 *     summary: Elimina lógicamente un medicamento (solo ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Medicamento eliminado }
 */
medicamentoRouter
  .route('/:id')
  .get(authenticate, validateId, MedicamentoController.getById)
  .patch(authenticate, authorize(Role.ADMIN), validateId, validateMedicamento, MedicamentoController.update)
  .delete(authenticate, authorize(Role.ADMIN), validateId, MedicamentoController.delete);
