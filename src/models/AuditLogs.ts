import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../database/sequelize';
import { IAuditLogs } from './interfaces';



const sequelize = SequelizeClass.getInstance().sequelize;
class AuditLogs extends Model<IAuditLogs> { }


AuditLogs.init({

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  action: {
    type: DataTypes.STRING,
    allowNull: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },

  cpNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payload: {
    type: DataTypes.TEXT,
    allowNull: true,
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

}, {
  sequelize,
  tableName: 'auditLogs'
})

export default AuditLogs;