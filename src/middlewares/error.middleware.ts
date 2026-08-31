import { ErrorRequestHandler, RequestHandler } from 'express';
import {
  BaseError,
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError,
} from 'sequelize';
import { env } from '../config/env';
import { AppError } from '../errors/AppError';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Ruta ${req.method} ${req.originalUrl} no encontrada`, 'ROUTE_NOT_FOUND'));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: { code: error.code, message: error.message, details: error.details },
    });
    return;
  }

  if (error instanceof UniqueConstraintError) {
    res.status(409).json({
      success: false,
      error: { code: 'DUPLICATE_VALUE', message: 'Ya existe un registro con ese valor' },
    });
    return;
  }

  if (error instanceof ForeignKeyConstraintError) {
    res.status(409).json({
      success: false,
      error: { code: 'RELATION_CONFLICT', message: 'La operación viola una relación existente' },
    });
    return;
  }

  if (error instanceof ValidationError) {
    res.status(400).json({
      success: false,
      error: { code: 'DATABASE_VALIDATION', message: error.message },
    });
    return;
  }

  if (error instanceof BaseError) {
    console.error('Error de base de datos:', error);
  } else {
    console.error('Error no controlado:', error);
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Error interno del servidor',
      ...(env.NODE_ENV === 'development' && { details: String(error) }),
    },
  });
};
