import { Sequelize } from 'sequelize';
import { env } from './env';
// Create a Sequelize instance to connect to the PostgreSQL database.
export const sequelize = new Sequelize(

  env.POSTGRES_DB,
  env.POSTGRES_USER,
  env.POSTGRES_PASSWORD,
  {
    // Database connection configuration.
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    dialect: 'postgres',
    // Enable database logs when DB_LOGGING is set to true.
    logging: env.DB_LOGGING ? console.log : false,
    define: {
      // Use snake_case for database column names.
      underscored: true,
      // Automatically manage createdAt and updatedAt timestamps.
      timestamps: true,

    },

  },

);