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
import type { Category } from './Category';
import type { User } from './User';

export enum ResourceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class Resource extends Model<InferAttributes<Resource>, InferCreationAttributes<Resource>> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare description: string | null;
  declare price: number;
  declare status: CreationOptional<ResourceStatus>;
  declare categoryId: ForeignKey<Category['id']>;
  declare ownerId: ForeignKey<User['id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare category?: NonAttribute<Category>;
  declare owner?: NonAttribute<User>;
}

Resource.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: 0 },
      get() {
        const value = this.getDataValue('price');
        return Number(value);
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ResourceStatus)),
      allowNull: false,
      defaultValue: ResourceStatus.ACTIVE,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'categories', key: 'id' },
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'resources',
    modelName: 'Resource',
    indexes: [
      { fields: ['category_id'] },
      { fields: ['owner_id'] },
      { fields: ['status'] },
    ],
  },
);
