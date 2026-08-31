/**
 * API router.
 * Aggregates all domain routers under the main API prefix.
 */
import { Router } from 'express';
import { authRouter } from './auth.routes';
import { categoryRouter } from './category.routes';
import { clinicaRouter } from './clinica.routes';
import { resourceRouter } from './resource.routes';
import { userRouter } from './user.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/clinicas', clinicaRouter);
apiRouter.use('/resources', resourceRouter);
