import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateLogin, validateRegister } from '../middlewares/validation.middleware';

export const authRouter = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registra un usuario con rol USER
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Register' }
 *     responses:
 *       201: { description: Usuario creado y token emitido }
 *       400: { description: Datos inválidos }
 *       409: { description: El correo ya existe }
 */
authRouter.post('/register', validateRegister, AuthController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Inicia sesión y devuelve un JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Login' }
 *     responses:
 *       200: { description: Sesión iniciada }
 *       401: { description: Credenciales incorrectas }
 */
authRouter.post('/login', validateLogin, AuthController.login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Devuelve el usuario autenticado
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Perfil actual }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
authRouter.get('/me', authenticate, AuthController.me);
