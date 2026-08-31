import { Router } from 'express';
import multer from 'multer';
import { SeedController } from '../controllers/seed.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { Role } from '../models/User';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const seedRouter = Router();

/**
 * @openapi
 * /seed/upload:
 *   post:
 *     tags: [Seed]
 *     summary: Carga datos base desde un archivo JSON (solo ADMIN, multer campo file)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo JSON con usuarios, clínicas, almacenes y medicamentos
 *     responses:
 *       201: { description: Datos insertados }
 *       400: { description: JSON inválido o archivo faltante }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */
seedRouter.post(
  '/upload',
  authenticate,
  authorize(Role.ADMIN),
  upload.single('file'),
  SeedController.upload,
);
