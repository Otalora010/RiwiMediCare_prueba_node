/**
 * Express type augmentations.
 * Extends Request with authenticated user info.
 */
import type { Role } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      auth?: {
        id: string;
        email: string;
        role: Role;
      };
    }
  }
}

export {};
