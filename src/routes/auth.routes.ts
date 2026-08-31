/**
 * Auth routes.
 * Defines authentication endpoints and OpenAPI documentation.
 */
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
 *       201: { description: User created and token issued }
 *       400: { description: Datos inválidos }
 *       409: { description: Email already exists }
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
 *       401: { description: Invalid credentials }
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
