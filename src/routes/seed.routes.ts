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
 *     summary: Uploads base data from a JSON file (ADMIN only, multer file field)
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
 *                 description: JSON file containing users, clinics, warehouses, and medicines
 *     responses:
 *       201: { description: Data inserted }
 *       400: { description: Invalid JSON or missing file }
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