import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../database/sequelize';
import { IUploads } from './interfaces';

const sequelize = SequelizeClass.getInstance().sequelize;

class Uploads extends Model<IUploads> {}

Uploads.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fileHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'uploads',
    timestamps: true,
  }
);

export default Uploads;
