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
  to: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
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
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  auditLogId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'auditLogs',
      key: 'id',
    },
  },
}, {
  sequelize,
  tableName: 'notifications'
})

export default Notifications;