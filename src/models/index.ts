/**
 * Model registry.
 * Initializes associations between User, Clinica, Almacen, Category and Resource.
 */
import { Almacen } from './Almacen';
import { Category } from './Category';
import { Clinica } from './Clinica';
import { Resource } from './Resource';
import { User } from './User';

User.hasMany(Resource, { foreignKey: 'ownerId', as: 'resources' });
Resource.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Category.hasMany(Resource, { foreignKey: 'categoryId', as: 'resources' });
Resource.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

export { Almacen, Category, Clinica, Resource, User };
