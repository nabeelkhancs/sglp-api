import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../database/sequelize';
import { IActions } from './interfaces';
import Data from '../common/config';


const sequelize = SequelizeClass.getInstance().sequelize;

class Action extends Model<IActions> { }

Action.init(
  {
    name: {
      type: DataTypes.ENUM(...Data.actions),
      allowNull: false,
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
    tableName: 'actions',
    indexes: [
      {
        unique: true,
        fields: ['name'],
      }
    ]
  }
);

export default Action;