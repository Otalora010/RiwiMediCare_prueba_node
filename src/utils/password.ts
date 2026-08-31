/**
 * Password utilities.
 * Hashing and comparison using bcryptjs.
 */
import bcrypt from 'bcryptjs';
import { env } from '../config/env';

export const hashPassword = (plainPassword: string): Promise<string> =>
  bcrypt.hash(plainPassword, env.BCRYPT_ROUNDS);

export const comparePassword = (plainPassword: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plainPassword, hash);
