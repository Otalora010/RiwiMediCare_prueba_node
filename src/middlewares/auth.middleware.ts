import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { verifyAccessToken } from '../utils/jwt';
// Middleware that verifies whether the request contains a valid access token.
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  // Get the authorization header from the request.
  const authorization = req.headers.authorization;
  // Check whether the authorization header contains a Bearer token.
  if (!authorization?.startsWith('Bearer ')) {
    next(new AppError(401, 'Access token required', 'UNAUTHENTICATED'));
    return;
  }
  try {
    // Verify the access token and retrieve its payload.
    const payload = verifyAccessToken(authorization.slice(7));
    // Store the authenticated user's information in the request.
    req.auth = { id: payload.id, email: payload.email, role: payload.role };
    // Continue to the next middleware or controller.
    next();
  } catch {
    // Return an error when the token is invalid or has expired.
    next(new AppError(401, 'Invalid or expired token', 'INVALID_TOKEN'));
  }

};