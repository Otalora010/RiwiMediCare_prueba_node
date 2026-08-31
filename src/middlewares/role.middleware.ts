/**
 * Role-based authorization middleware.
 * Allows only specified roles to access the route.
 */
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { Role } from '../models/User';

export const authorize = (...allowedRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      next(new AppError(401, 'You must be logged in', 'UNAUTHENTICATED'));
      return;
    }

    if (!allowedRoles.includes(req.auth.role)) {
      next(new AppError(403, 'You do not have permission for this action', 'FORBIDDEN'));
      return;
    }

    next();
  };
