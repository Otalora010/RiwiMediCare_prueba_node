/**
 * Database seeder.
 * Populates initial users and reference data.
 */
import { sequelize } from '../../config/database';
import { env } from '../../config/env';
import { Category, Resource, User } from '../../models';
import { ResourceStatus } from '../../models/Resource';
import { Role } from '../../models/User';
import { hashPassword } from '../../utils/password';

async function seed(): Promise<void> {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const [admin] = await User.scope('withPassword').findOrCreate({
      where: { email: env.ADMIN_EMAIL },
      defaults: {
        name: env.ADMIN_NAME,
        email: env.ADMIN_EMAIL,
        password: await hashPassword(env.ADMIN_PASSWORD),
        role: Role.ADMIN,
        isActive: true,
      },
    });

    const [user] = await User.scope('withPassword').findOrCreate({
      where: { email: 'user@example.com' },
      defaults: {
        name: 'Usuario de prueba',
        email: 'user@example.com',
        password: await hashPassword('User123*'),
        role: Role.GESTOR,
        isActive: true,
      },
    });

    const [general] = await Category.findOrCreate({
      where: { name: 'General' },
      defaults: { name: 'General', description: 'Generic category adaptable to test domain' },
    });
    const [premium] = await Category.findOrCreate({
      where: { name: 'Premium' },
      defaults: { name: 'Premium', description: 'Segunda categoría para probar relaciones' },
    });

    await Resource.findOrCreate({
      where: { title: 'Initial Resource', ownerId: user.id },
      defaults: {
        title: 'Initial Resource',
        description: 'Cambia este recurso por Producto, Libro, Espacio, Vehículo, etc.',
        price: 50000,
        status: ResourceStatus.ACTIVE,
        categoryId: general.id,
        ownerId: user.id,
      },
    });
    await Resource.findOrCreate({
      where: { title: 'Admin Resource', ownerId: admin.id },
      defaults: {
        title: 'Admin Resource',
        description: 'Test data created by admin',
        price: 100000,
        status: ResourceStatus.INACTIVE,
        categoryId: premium.id,
        ownerId: admin.id,
      },
    });

    console.log('Seed completado');
    console.log(`ADMIN: ${env.ADMIN_EMAIL} / ${env.ADMIN_PASSWORD}`);
    console.log('GESTOR: user@example.com / User123*');
  } catch (error) {
    console.error('Error ejecutando el seed:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

void seed();
