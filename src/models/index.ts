/**
 * Model registry.
 * Initializes associations between all entities.
 */
import { Almacen } from './Almacen';
import { Category } from './Category';
import { Clinica } from './Clinica';
import { Medicamento } from './Medicamento';
import { Resource } from './Resource';
import { Solicitud } from './Solicitud';
import { User } from './User';

User.hasMany(Resource, { foreignKey: 'ownerId', as: 'resources' });
Resource.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Category.hasMany(Resource, { foreignKey: 'categoryId', as: 'resources' });
Resource.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Almacen.hasMany(Medicamento, { foreignKey: 'almacenId', as: 'medicamentos' });
Medicamento.belongsTo(Almacen, { foreignKey: 'almacenId', as: 'almacen' });

Clinica.hasMany(Solicitud, { foreignKey: 'clinicaId', as: 'solicitudes' });
Solicitud.belongsTo(Clinica, { foreignKey: 'clinicaId', as: 'clinica' });

Medicamento.hasMany(Solicitud, { foreignKey: 'medicamentoId', as: 'solicitudes' });
Solicitud.belongsTo(Medicamento, { foreignKey: 'medicamentoId', as: 'medicamento' });

Almacen.hasMany(Solicitud, { foreignKey: 'almacenId', as: 'solicitudes' });
Solicitud.belongsTo(Almacen, { foreignKey: 'almacenId', as: 'almacen' });

User.hasMany(Solicitud, { foreignKey: 'userId', as: 'solicitudes' });
Solicitud.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { Almacen, Category, Clinica, Medicamento, Resource, Solicitud, User };
