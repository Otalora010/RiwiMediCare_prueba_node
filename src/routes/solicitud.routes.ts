import { Router } from 'express';
import { SolicitudController } from '../controllers/solicitud.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validateId, validateSolicitud, validateSolicitudEstado } from '../middlewares/validation.middleware';
import { Role } from '../models/User';
export const solicitudRouter = Router();

/**
 * @openapi
 * /solicitudes/activas:
 *   get:
 *     tags: [Solicitudes]
 *     summary: Lists active requests (PENDIENTE and APROBADA)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Active requests }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
solicitudRouter.get('/activas', authenticate, SolicitudController.listActivas);

/**
 * @openapi
 * /solicitudes/historial:
 *   get:
 *     tags: [Solicitudes]
 *     summary: Complete request history (all except ELIMINADA)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Complete history }
 */
solicitudRouter.get('/historial', authenticate, SolicitudController.listHistorial);

/**
 * @openapi
 * /solicitudes:
 *   get:
 *     tags: [Solicitudes]
 *     summary: History alias (compatibility)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Request list }
 *   post:
 *     tags: [Solicitudes]
 *     summary: Creates a request (GESTOR and ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SolicitudInput' }
 *     responses:
 *       201: { description: Request created }
 *       400: { description: Invalid data or insufficient stock }
 *       404: { description: Clinic, medicine, or warehouse not found }
 */
solicitudRouter
  .route('/')
  .get(authenticate, SolicitudController.listHistorial)
  .post(authenticate, authorize(Role.ADMIN, Role.GESTOR), validateSolicitud, SolicitudController.create);

/**
 * @openapi
 * /solicitudes/{id}:
 *   get:
 *     tags: [Solicitudes]
 *     summary: Gets a request by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Request found }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   delete:
 *     tags: [Solicitudes]
 *     summary: Soft deletes a request (ADMIN only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Request deleted }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */
solicitudRouter
  .route('/:id')
  .get(authenticate, validateId, SolicitudController.getById)
  .delete(authenticate, authorize(Role.ADMIN), validateId, SolicitudController.delete);

/**
 * @openapi
 * /solicitudes/{id}/estado:
 *   put:
 *     tags: [Solicitudes]
 *     summary: Updates the status of a request (GESTOR and ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [estado]
 *             properties:
 *               estado: { type: string, enum: [PENDIENTE, APROBADA, RECHAZADA, DESPACHADA, CANCELADA] }
 *     responses:
 *       200: { description: Status updated }
 *       400: { description: Invalid status }
 */
solicitudRouter.put(
  '/:id/estado',
  authenticate,
  authorize(Role.ADMIN, Role.GESTOR),
  validateId,
  validateSolicitudEstado,
  SolicitudController.updateEstado,
);