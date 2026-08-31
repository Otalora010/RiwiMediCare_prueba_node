import { Almacen } from './Almacen';
import { Category } from './Category';
import { Clinica } from './Clinica';
import { Medicamento } from './Medicamento';
import { Resource } from './Resource';
import { User } from './User';

User.hasMany(Resource, { foreignKey: 'ownerId', as: 'resources' });
Resource.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Category.hasMany(Resource, { foreignKey: 'categoryId', as: 'resources' });
Resource.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Almacen.hasMany(Medicamento, { foreignKey: 'almacenId', as: 'medicamentos' });
Medicamento.belongsTo(Almacen, { foreignKey: 'almacenId', as: 'almacen' });

export { Almacen, Category, Clinica, Medicamento, Resource, User };
