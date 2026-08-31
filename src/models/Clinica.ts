/**
 * Clinica model.
 * Represents clinics with unique NIT and soft delete via estado.
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

export enum ClinicaEstado {
  ACTIVA = 'ACTIVA',
  ELIMINADA = 'ELIMINADA',
}

export class Clinica extends Model<InferAttributes<Clinica>, InferCreationAttributes<Clinica>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare nit: string;
  declare responsable: string;
  declare estado: CreationOptional<ClinicaEstado>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare solicitudes?: NonAttribute<unknown[]>;
}

Clinica.init(
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
    nit: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    responsable: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM(...Object.values(ClinicaEstado)),
      allowNull: false,
      defaultValue: ClinicaEstado.ACTIVA,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'clinicas',
    modelName: 'Clinica',
    indexes: [
      { unique: true, fields: ['nit'] },
      { fields: ['estado'] },
    ],
  },
);
