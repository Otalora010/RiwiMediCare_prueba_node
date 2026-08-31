import { Router } from 'express';
import { almacenRouter } from './almacen.routes';
import { authRouter } from './auth.routes';
import { categoryRouter } from './category.routes';
import { clinicaRouter } from './clinica.routes';
import { medicamentoRouter } from './medicamento.routes';
import { resourceRouter } from './resource.routes';
import { seedRouter } from './seed.routes';
import { solicitudRouter } from './solicitud.routes';
import { userRouter } from './user.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/clinicas', clinicaRouter);
apiRouter.use('/almacenes', almacenRouter);
apiRouter.use('/medicamentos', medicamentoRouter);
apiRouter.use('/solicitudes', solicitudRouter);
apiRouter.use('/seed', seedRouter);
apiRouter.use('/resources', resourceRouter);
