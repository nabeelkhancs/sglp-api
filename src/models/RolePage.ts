import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../database/sequelize';
import { IRolePage } from './interfaces';


const sequelize = SequelizeClass.getInstance().sequelize;

class RolePages extends Model<IRolePage> { }
RolePages.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    roleId: {
      type: DataTypes.INTEGER

    },
    pageId: {
      type: DataTypes.INTEGER
    }

  },
  {
    sequelize,
    tableName: 'rolePage',
    indexes: [
      {
        unique: true,
        fields: ['roleId', 'pageId'],
        name: 'Already created roleId and permissionId'
      }
    ]
  },
)

export default RolePages;