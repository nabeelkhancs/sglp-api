import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../database/sequelize';
import { IUserTitles } from './interfaces';

const sequelize = SequelizeClass.getInstance().sequelize;

class UserTitles extends Model<IUserTitles>{} 

UserTitles.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    userTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
   
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   model: 'users',
      //   key: 'id'
      // }
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   model: 'users',
      //   key: 'id'
      // }
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deletedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   model: 'users',
      //   key: 'id'
      // }
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  { sequelize,
    tableName: 'userTiltes'
  }
);

export default UserTitles;