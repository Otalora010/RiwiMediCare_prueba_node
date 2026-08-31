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
 *     summary: Lists active clinics
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Active clinics }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Clinicas]
 *     summary: Creates a clinic (ADMIN only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ClinicaInput' }
 *     responses:
 *       201: { description: Clinic created }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       409: { description: Duplicate NIT }
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
 *     summary: Gets a clinic by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Clinic found }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Clinicas]
 *     summary: Updates a clinic (ADMIN only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ClinicaInput' }
 *     responses:
 *       200: { description: Clinic updated }
 *       409: { description: Duplicate NIT }
 *   delete:
 *     tags: [Clinicas]
 *     summary: Soft deletes a clinic (ADMIN only, ELIMINADA status)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Clinic deleted }
 */
 
/**
 * @openapi
 * /clinicas/{id}/solicitudes:
 *   get:
 *     tags: [Clinicas]
 *     summary: Request history by clinic
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Request history by clinic }
 *       404: { $ref: '#/components/responses/NotFound' }
 */

clinicaRouter.get('/\:id/solicitudes', authenticate, validateId, SolicitudController.listByClinica);
clinicaRouter
  .route('/\:id')
  .get(authenticate, validateId, ClinicaController.getById)
  .patch(authenticate, authorize(Role.ADMIN), validateId, validateClinica, ClinicaController.update)
  .delete(authenticate, authorize(Role.ADMIN), validateId, ClinicaController.delete);