import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../database/sequelize';
import { INotifications } from './interfaces';

const sequelize = SequelizeClass.getInstance().sequelize;
class Notifications extends Model<INotifications> { }

Notifications.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  to: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cc: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bcc: {
    type: DataTypes.STRING,
    allowNull: true
  },
  success: {
    type: DataTypes.STRING,
    allowNull: true
  },
  error: {
    type: DataTypes.STRING,
    allowNull: true
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
}, {
  sequelize,
  tableName: 'notifications'
})

export default Notifications;