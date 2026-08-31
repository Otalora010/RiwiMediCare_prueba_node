/**
 * Medicamento model.
 * Represents medications linked to a warehouse with stock management.
 */
import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { sequelize } from '../config/database';
import type { Almacen } from './Almacen';

export enum MedicamentoEstado {
  ACTIVO = 'ACTIVO',
  ELIMINADO = 'ELIMINADO',
}

export class Medicamento extends Model<InferAttributes<Medicamento>, InferCreationAttributes<Medicamento>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare stock: number;
  declare almacenId: ForeignKey<Almacen['id']>;
  declare estado: CreationOptional<MedicamentoEstado>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare almacen?: NonAttribute<Almacen>;
  declare solicitudes?: NonAttribute<unknown[]>;
}

Medicamento.init(
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
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 },
    },
    almacenId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'almacenes', key: 'id' },
    },
    estado: {
      type: DataTypes.ENUM(...Object.values(MedicamentoEstado)),
      allowNull: false,
      defaultValue: MedicamentoEstado.ACTIVO,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'medicamentos',
    modelName: 'Medicamento',
    indexes: [
      { fields: ['almacen_id'] },
      { fields: ['estado'] },
    ],
  },
);
