import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { ResourceStatus } from '../models/Resource';
import { Role } from '../models/User';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const fail = (message: string): AppError =>
  new AppError(400, message, 'VALIDATION_ERROR');

export const validateId = (req: Request, _res: Response, next: NextFunction): void => {
  if (!uuidRegex.test(String(req.params.id))) {
    next(fail('El id debe ser un UUID válido'));
    return;
  }
  next();
};

export const validateRegister = (req: Request, _res: Response, next: NextFunction): void => {
  const { name, email, password } = req.body;
  if (typeof name !== 'string' || name.trim().length < 2) {
    next(fail('El nombre debe tener mínimo 2 caracteres'));
    return;
  }
  if (typeof email !== 'string' || !emailRegex.test(email)) {
    next(fail('El correo no es válido'));
    return;
  }
  if (
    typeof password !== 'string' ||
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    next(fail('La contraseña debe tener 8 caracteres, mayúscula, minúscula y número'));
    return;
  }
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  next();
};

export const validateLogin = (req: Request, _res: Response, next: NextFunction): void => {
  const { email, password } = req.body;
  if (typeof email !== 'string' || !emailRegex.test(email) || typeof password !== 'string') {
    next(fail('Correo y contraseña son obligatorios'));
    return;
  }
  req.body.email = email.trim().toLowerCase();
  next();
};

export const validateCategory = (req: Request, _res: Response, next: NextFunction): void => {
  const isUpdate = req.method === 'PATCH';
  const { name, description } = req.body;
  if (isUpdate && Object.keys(req.body).length === 0) {
    next(fail('Debes enviar al menos un campo'));
    return;
  }
  if ((!isUpdate || name !== undefined) && (typeof name !== 'string' || name.trim().length < 2)) {
    next(fail('El nombre debe tener mínimo 2 caracteres'));
    return;
  }
  if (description !== undefined && description !== null && typeof description !== 'string') {
    next(fail('La descripción debe ser texto'));
    return;
  }
  if (typeof name === 'string') req.body.name = name.trim();
  next();
};

export const validateResource = (req: Request, _res: Response, next: NextFunction): void => {
  const isUpdate = req.method === 'PATCH';
  const { title, price, status, categoryId } = req.body;
  if (isUpdate && Object.keys(req.body).length === 0) {
    next(fail('Debes enviar al menos un campo'));
    return;
  }
  if ((!isUpdate || title !== undefined) && (typeof title !== 'string' || title.trim().length < 2)) {
    next(fail('El título debe tener mínimo 2 caracteres'));
    return;
  }
  if ((!isUpdate || price !== undefined) && (!Number.isFinite(Number(price)) || Number(price) < 0)) {
    next(fail('El precio debe ser un número mayor o igual a cero'));
    return;
  }
  if ((!isUpdate || categoryId !== undefined) && !uuidRegex.test(categoryId)) {
    next(fail('categoryId debe ser un UUID válido'));
    return;
  }
  if (status !== undefined && !Object.values(ResourceStatus).includes(status)) {
    next(fail('El estado debe ser ACTIVE o INACTIVE'));
    return;
  }
  if (typeof title === 'string') req.body.title = title.trim();
  if (price !== undefined) req.body.price = Number(price);
  next();
};

export const validateRole = (req: Request, _res: Response, next: NextFunction): void => {
  if (!Object.values(Role).includes(req.body.role)) {
    next(fail('El rol debe ser ADMIN o GESTOR'));
    return;
  }
  next();
};

export const validateResourceQuery = (req: Request, _res: Response, next: NextFunction): void => {
  const { status, categoryId } = req.query;
  if (status && !Object.values(ResourceStatus).includes(status as ResourceStatus)) {
    next(fail('El filtro status debe ser ACTIVE o INACTIVE'));
    return;
  }
  if (categoryId && !uuidRegex.test(String(categoryId))) {
    next(fail('El filtro categoryId debe ser un UUID válido'));
    return;
  }
  next();
};
