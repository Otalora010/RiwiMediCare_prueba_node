import path from 'node:path';
import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../config/env';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'RiwiMediCare Plus API',
      version: '1.0.0',
      description: 'API para gestión de solicitudes de abastecimiento de medicamentos e insumos médicos.',
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
            role: { type: 'string', enum: ['ADMIN', 'GESTOR'], example: 'GESTOR' },
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
        ClinicaInput: {
          type: 'object',
          required: ['name', 'nit', 'responsable'],
          properties: {
            name: { type: 'string', example: 'Clínica Central' },
            nit: { type: 'string', example: '900123456-1' },
            responsable: { type: 'string', example: 'Dra. Laura Gómez' },
            estado: { type: 'string', enum: ['ACTIVA', 'ELIMINADA'] },
          },
        },
        AlmacenInput: {
          type: 'object',
          required: ['name', 'location'],
          properties: {
            name: { type: 'string', example: 'Almacén Central' },
            location: { type: 'string', example: 'Bogotá - Sede Norte' },
            estado: { type: 'string', enum: ['ACTIVO', 'ELIMINADO'] },
          },
        },
        MedicamentoInput: {
          type: 'object',
          required: ['name', 'stock', 'almacenId'],
          properties: {
            name: { type: 'string', example: 'Acetaminofén 500mg' },
            stock: { type: 'number', minimum: 0, example: 150 },
            almacenId: { type: 'string', format: 'uuid' },
            estado: { type: 'string', enum: ['ACTIVO', 'ELIMINADO'] },
          },
        },
        SolicitudInput: {
          type: 'object',
          required: ['clinicaId', 'medicamentoId', 'almacenId', 'cantidadSolicitada'],
          properties: {
            clinicaId: { type: 'string', format: 'uuid' },
            medicamentoId: { type: 'string', format: 'uuid' },
            almacenId: { type: 'string', format: 'uuid' },
            cantidadSolicitada: { type: 'number', minimum: 1, example: 10 },
            estado: { type: 'string', enum: ['PENDIENTE'], example: 'PENDIENTE' },
          },
        },
        SolicitudEstadoInput: {
          type: 'object',
          required: ['estado'],
          properties: {
            estado: { type: 'string', enum: ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'DESPACHADA', 'CANCELADA'] },
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
