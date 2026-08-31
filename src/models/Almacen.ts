/**
 * Almacen model.
 * Represents warehouses with location and soft delete.
 */
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { sequelize } from '../config/database';

export enum AlmacenEstado {
  ACTIVO = 'ACTIVO',
  ELIMINADO = 'ELIMINADO',
}

export class Almacen extends Model<InferAttributes<Almacen>, InferCreationAttributes<Almacen>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare location: string;
  declare estado: CreationOptional<AlmacenEstado>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare medicamentos?: NonAttribute<unknown[]>;
}

Almacen.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM(...Object.values(AlmacenEstado)),
      allowNull: false,
      defaultValue: AlmacenEstado.ACTIVO,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'almacenes',
    modelName: 'Almacen',
    indexes: [{ fields: ['estado'] }],
  },
);
