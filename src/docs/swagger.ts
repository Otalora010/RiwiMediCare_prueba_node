import path from 'node:path';
import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../config/env';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Backend Exam Template API',
      version: '1.0.0',
      description: 'Plantilla adaptable: reemplaza Category y Resource por las entidades del enunciado.',
    },
    servers: [{ url: `http://localhost:${env.PORT}${env.API_PREFIX}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Register: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Ana Pérez' },
            email: { type: 'string', format: 'email', example: 'ana@example.com' },
            password: { type: 'string', format: 'password', example: 'Clave123*' },
          },
        },
        Login: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            password: { type: 'string', format: 'password', example: 'Admin123*' },
          },
        },
        CategoryInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Categoría principal' },
            description: { type: 'string', nullable: true },
          },
        },
        ResourceInput: {
          type: 'object',
          required: ['title', 'price', 'categoryId'],
          properties: {
            title: { type: 'string', example: 'Recurso de ejemplo' },
            description: { type: 'string', nullable: true },
            price: { type: 'number', minimum: 0, example: 25000 },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
            categoryId: { type: 'string', format: 'uuid' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string', example: 'Error de validación' },
              },
            },
          },
        },
      },
      responses: {
        Unauthorized: { description: 'Token ausente, inválido o expirado' },
        Forbidden: { description: 'El rol no tiene permisos para la operación' },
        NotFound: { description: 'Registro no encontrado' },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/*.{ts,js}')],
});
