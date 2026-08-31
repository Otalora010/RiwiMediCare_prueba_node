/**
 * Punto de entrada de la aplicación.
 * Conecta PostgreSQL, sincroniza los modelos y levanta el servidor HTTP.
 */
import app from './server';
import { sequelize } from './config/database';
import { env } from './config/env';

const start = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida');

    if (env.DB_SYNC) {
      await sequelize.sync();
      console.log('Modelos sincronizados');
    }

    app.listen(env.PORT, () => {
      console.log(`API: http://localhost:${env.PORT}${env.API_PREFIX}`);
      console.log(`Swagger: http://localhost:${env.PORT}/api/docs`);
    });
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
};

void start();
