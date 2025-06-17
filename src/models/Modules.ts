import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../database/sequelize';
import { IModules } from './interfaces';

const sequelize = SequelizeClass.getInstance().sequelize;

class Modules extends Model<IModules> { }

Modules.init(
  {
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hasChild: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deletedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },

  {
    sequelize,
    tableName: 'modules',
    indexes: [
      {
        unique: true,
        fields: ['url'],
      }
    ]
  }
);

export default Modules;