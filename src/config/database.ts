import { Sequelize } from 'sequelize';
import { env } from './env';

export const sequelize = new Sequelize(
  env.POSTGRES_DB,
  env.POSTGRES_USER,
  env.POSTGRES_PASSWORD,
  {
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    dialect: 'postgres',
    logging: env.DB_LOGGING ? console.log : false,
    define: {
      underscored: true,
      timestamps: true,
    },
  },
);
