/**
 * Model registry.
 * Initializes associations between all entities.
 */
import { Category } from './Category';
import { Clinica } from './Clinica';
import { Resource } from './Resource';
import { User } from './User';

User.hasMany(Resource, { foreignKey: 'ownerId', as: 'resources' });
Resource.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Category.hasMany(Resource, { foreignKey: 'categoryId', as: 'resources' });
Resource.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

export { Category, Clinica, Resource, User };
