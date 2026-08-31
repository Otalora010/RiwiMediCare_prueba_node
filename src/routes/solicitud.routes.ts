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
 *     summary: Lista solicitudes activas (PENDIENTE y APROBADA)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Solicitudes activas }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
solicitudRouter.get('/activas', authenticate, SolicitudController.listActivas);

/**
 * @openapi
 * /solicitudes/historial:
 *   get:
 *     tags: [Solicitudes]
 *     summary: Historial completo de solicitudes (todas menos ELIMINADA)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Historial completo }
 */
solicitudRouter.get('/historial', authenticate, SolicitudController.listHistorial);

/**
 * @openapi
 * /solicitudes:
 *   get:
 *     tags: [Solicitudes]
 *     summary: Alias de historial (compatibilidad)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de solicitudes }
 *   post:
 *     tags: [Solicitudes]
 *     summary: Crea una solicitud (GESTOR y ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SolicitudInput' }
 *     responses:
 *       201: { description: Solicitud creada }
 *       400: { description: Datos inválidos o stock insuficiente }
 *       404: { description: Clínica, medicamento o almacén no encontrado }
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
 *     summary: Obtiene una solicitud por id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Solicitud encontrada }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   delete:
 *     tags: [Solicitudes]
 *     summary: Elimina lógicamente una solicitud (solo ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204: { description: Solicitud eliminada }
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
 *     summary: Actualiza el estado de una solicitud (GESTOR y ADMIN)
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
 *       200: { description: Estado actualizado }
 *       400: { description: Estado inválido }
 */
solicitudRouter.put(
  '/:id/estado',
  authenticate,
  authorize(Role.ADMIN, Role.GESTOR),
  validateId,
  validateSolicitudEstado,
  SolicitudController.updateEstado,
);
