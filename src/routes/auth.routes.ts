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
 *     summary: Registers a user with the USER role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Register' }
 *     responses:
 *       201: { description: User created and token issued }
 *       400: { description: Invalid data }
 *       409: { description: Email already exists }
 */
authRouter.post('/register', validateRegister, AuthController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Logs in and returns a JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Login' }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
authRouter.post('/login', validateLogin, AuthController.login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Returns the authenticated user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Current profile }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
authRouter.get('/me', authenticate, AuthController.me);