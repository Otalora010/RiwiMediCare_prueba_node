import { sequelize } from '../../config/database';
import { env } from '../../config/env';
import { Category, Resource, User } from '../../models';
import { ResourceStatus } from '../../models/Resource';
import { Role } from '../../models/User';
import { hashPassword } from '../../utils/password';

// Executes the database seed process.
async function seed(): Promise<void> {
  try {
    // Authenticate the connection to the database.
    await sequelize.authenticate();
    // Synchronize the database models with the database structure.
    await sequelize.sync();

    // Find an existing administrator or create a new one if it does not exist.
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
    // Find an existing test user or create a new one if it does not exist.
    const [user] = await User.scope('withPassword').findOrCreate({
      where: { email: 'user@example.com' },
      defaults: {
        name: 'Test User',
        email: 'user@example.com',
        password: await hashPassword('User123*'),
        role: Role.GESTOR,
        isActive: true,
      },
    });
    // Create the general category if it does not already exist.
    const [general] = await Category.findOrCreate({
      where: { name: 'General' },
      defaults: {
        name: 'General',
        description: 'Category adaptable to the test domain',
      },
    });
    // Create the premium category if it does not already exist.
    const [premium] = await Category.findOrCreate({
      where: { name: 'Premium' },
      defaults: {
        name: 'Premium',
        description: 'Second category used to test relationships',
      },
    });
    // Create an initial resource owned by the test user.
    await Resource.findOrCreate({
      where: { title: 'Initial Resource', ownerId: user.id },
      defaults: {
        title: 'Initial Resource',
        description: 'Change this resource to Product, Book, Space, Vehicle, etc.',
        price: 50000,
        status: ResourceStatus.ACTIVE,
        categoryId: general.id,
        ownerId: user.id,
      },
    });
    // Create an administrative resource owned by the administrator.
    await Resource.findOrCreate({
      where: { title: 'Administrative Resource', ownerId: admin.id },
      defaults: {
        title: 'Administrative Resource',
        description: 'Test data created by the administrator',
        price: 100000,
        status: ResourceStatus.INACTIVE,
        categoryId: premium.id,
        ownerId: admin.id,
      },
    });

    // Display the seed completion message and test credentials.
    console.log('Seed completed');
    console.log(`ADMIN: ${env.ADMIN_EMAIL} / ${env.ADMIN_PASSWORD}`);
    console.log('MANAGER: user@example.com / User123*');
  } catch (error) {
    // Display the error if the seed process fails.
    console.error('Error executing the seed:', error);
    process.exitCode = 1;
  } finally {
    // Close the database connection after the process finishes.
    await sequelize.close();
  }
}

// Start the seed process.
void seed();