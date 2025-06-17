import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../database/sequelize';
import { IPermissions } from './interfaces';


const sequelize = SequelizeClass.getInstance().sequelize;

class Permissions extends Model<IPermissions> { }
Permissions.init(
  {
    rolePageId: {
      type: DataTypes.INTEGER
    },
    actionId: {
      type: DataTypes.INTEGER
    }
  },
  {
    sequelize,
    tableName: 'permissions'
  }
);

export default Permissions;