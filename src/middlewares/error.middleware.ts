/**
 * Error handling middlewares.
 * Handles 404 and maps AppError / Sequelize errors to HTTP responses.
 */
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
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} not found`, 'ROUTE_NOT_FOUND'));
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
      error: { code: 'DUPLICATE_VALUE', message: 'Record with this value already exists' },
    });
    return;
  }

  if (error instanceof ForeignKeyConstraintError) {
    res.status(409).json({
      success: false,
      error: { code: 'RELATION_CONFLICT', message: 'Operation violates an existing relation' },
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
    console.error('Database error:', error);
  } else {
    console.error('Unhandled error:', error);
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
      ...(env.NODE_ENV === 'development' && { details: String(error) }),
    },
  });
};
