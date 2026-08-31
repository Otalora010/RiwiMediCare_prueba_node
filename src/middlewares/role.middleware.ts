import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { Role } from '../models/User';
// Middleware that checks whether the authenticated user has an allowed role.
export const authorize = (...allowedRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    // Check whether the user is authenticated.
    if (!req.auth) {
      next(new AppError(401, 'You must log in', 'UNAUTHENTICATED'));
      return;
    }
    // Check whether the user's role is included in the allowed roles.
    if (!allowedRoles.includes(req.auth.role)) {
      next(new AppError(403, 'You do not have permission for this action', 'FORBIDDEN'));
      return;
    }
    // Continue to the next middleware or controller.
    next();
  };