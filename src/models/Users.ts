import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../database/sequelize';
import { UsersAttributes } from './interfaces';

const sequelize = SequelizeClass.getInstance().sequelize;

class User extends Model<UsersAttributes> { }

User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('ADMIN', 'OPERATOR_REVIEWER'),
    allowNull: false
  },
  cnic: {
    type: DataTypes.STRING,
    allowNull: true
  },
  govtID: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deptID: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profilePic: {
    type: DataTypes.STRING,
  },
  dptIdDoc: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  designation: {
    type: DataTypes.STRING,
  },
  roleType: {
    type: DataTypes.ENUM('ADMIN', 'OPERATOR', 'REVIEWER'),
    allowNull: true
  },
  firstPageVisited: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'dashboard',
  },
  status: {
    type: DataTypes.ENUM('Approved', 'Rejected', 'Pending'),
    defaultValue: 'Pending',
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  isEmailVerify: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
  tableName: 'users',
  indexes: [
    {
      unique: true,
      fields: ['email'],
    }
  ]
});

export default User;