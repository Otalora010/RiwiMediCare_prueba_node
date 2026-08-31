/**
 * Application entry point.
 * Connects to PostgreSQL, syncs models and starts the HTTP server.
 */
import app from './server';
import { sequelize } from './config/database';
import { env } from './config/env';

const start = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection established');

    if (env.DB_SYNC) {
      await sequelize.sync();
      console.log('Models synchronized');
    }

    app.listen(env.PORT, () => {
      console.log(`API: http://localhost:${env.PORT}${env.API_PREFIX}`);
      console.log(`Swagger: http://localhost:${env.PORT}/api/docs`);
    });
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
};

void start();
