/**
 * Authentication middleware.
 * Validates Bearer JWT and populates req.auth, otherwise throws UNAUTHENTICATED.
 */
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { verifyAccessToken } from '../utils/jwt';

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    next(new AppError(401, 'Token de acceso requerido', 'UNAUTHENTICATED'));
    return;
  }

  try {
    const payload = verifyAccessToken(authorization.slice(7));
    req.auth = { id: payload.id, email: payload.email, role: payload.role };
    next();
  } catch {
    next(new AppError(401, 'Token inválido o expirado', 'INVALID_TOKEN'));
  }
};
