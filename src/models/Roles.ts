import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../database/sequelize';
import { IRoles } from './interfaces';

const sequelize = SequelizeClass.getInstance().sequelize;

class Roles extends Model<IRoles> { }
Roles.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('ADMIN', 'OPERATOR', 'REVIEWER'),
      allowNull: false
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
    tableName: 'roles',
    indexes: [
      {
        unique: true,
        fields: ['name'],
      },
    ]
  }
);

export default Roles;