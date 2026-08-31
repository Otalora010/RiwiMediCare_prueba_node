import { Router } from 'express';
import { ClinicaController } from '../controllers/clinica.controller';
import { SolicitudController } from '../controllers/solicitud.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validateClinica, validateId } from '../middlewares/validation.middleware';
import { Role } from '../models/User';

export const clinicaRouter = Router();

/**
 * @openapi
 * /clinicas:
 *   get:
 *     tags: [Clinicas]
 *     summary: Lista clínicas activas
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Clínicas activas }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Clinicas]
 *     summary: Crea una clínica (solo ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ClinicaInput' }
 *     responses:
 *       201: { description: Clínica creada }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       409: { description: NIT duplicado }
 */
clinicaRouter
  .route('/')
  .get(authenticate, ClinicaController.list)
  .post(authenticate, authorize(Role.ADMIN), validateClinica, ClinicaController.create);

/**
 * @openapi
 * /clinicas/{id}:
 *   get:
 *     tags: [Clinicas]
 *     summary: Obtiene una clínica por id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Clínica encontrada }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Clinicas]
 *     summary: Actualiza una clínica (solo ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ClinicaInput' }
 *     responses:
 *       200: { description: Clínica actualizada }
 *       409: { description: NIT duplicado }
 *   delete:
 *     tags: [Clinicas]
 *     summary: Elimina lógicamente una clínica (solo ADMIN, estado ELIMINADA)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Clínica eliminada }
 */
/**
 * @openapi
 * /clinicas/{id}/solicitudes:
 *   get:
 *     tags: [Clinicas]
 *     summary: Historial de solicitudes por clínica
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Historial por clínica }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
clinicaRouter.get('/:id/solicitudes', authenticate, validateId, SolicitudController.listByClinica);

clinicaRouter
  .route('/:id')
  .get(authenticate, validateId, ClinicaController.getById)
  .patch(authenticate, authorize(Role.ADMIN), validateId, validateClinica, ClinicaController.update)
  .delete(authenticate, authorize(Role.ADMIN), validateId, ClinicaController.delete);
