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
import type { Clinica } from './Clinica';
import type { Medicamento } from './Medicamento';
import type { User } from './User';

export enum SolicitudEstado {
  PENDIENTE = 'PENDIENTE',
  APROBADA = 'APROBADA',
  RECHAZADA = 'RECHAZADA',
  DESPACHADA = 'DESPACHADA',
  CANCELADA = 'CANCELADA',
  ELIMINADA = 'ELIMINADA',
}

export class Solicitud extends Model<InferAttributes<Solicitud>, InferCreationAttributes<Solicitud>> {
  declare id: CreationOptional<string>;
  declare clinicaId: ForeignKey<Clinica['id']>;
  declare medicamentoId: ForeignKey<Medicamento['id']>;
  declare almacenId: ForeignKey<Almacen['id']>;
  declare cantidadSolicitada: number;
  declare estado: CreationOptional<SolicitudEstado>;
  declare userId: ForeignKey<User['id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare clinica?: NonAttribute<Clinica>;
  declare medicamento?: NonAttribute<Medicamento>;
  declare almacen?: NonAttribute<Almacen>;
  declare user?: NonAttribute<User>;
}

Solicitud.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clinicaId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'clinicas', key: 'id' },
    },
    medicamentoId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'medicamentos', key: 'id' },
    },
    almacenId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'almacenes', key: 'id' },
    },
    cantidadSolicitada: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    estado: {
      type: DataTypes.ENUM(...Object.values(SolicitudEstado)),
      allowNull: false,
      defaultValue: SolicitudEstado.PENDIENTE,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'solicitudes',
    modelName: 'Solicitud',
    indexes: [
      { fields: ['clinica_id'] },
      { fields: ['medicamento_id'] },
      { fields: ['almacen_id'] },
      { fields: ['user_id'] },
      { fields: ['estado'] },
    ],
  },
);
