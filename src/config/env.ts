import 'dotenv/config';

const numberValue = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: numberValue(process.env.PORT, 3002),
  API_PREFIX: process.env.API_PREFIX || '/api',
  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  POSTGRES_PORT: numberValue(process.env.POSTGRES_PORT, 5432),
  POSTGRES_DB: process.env.POSTGRES_DB || 'exam_db',
  POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'postgres',
  DB_LOGGING: process.env.DB_LOGGING === 'true',
  DB_SYNC: process.env.DB_SYNC !== 'false',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret-before-production-123456',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '4h',
  BCRYPT_ROUNDS: numberValue(process.env.BCRYPT_ROUNDS, 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Administrador',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@example.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin123*',
};
