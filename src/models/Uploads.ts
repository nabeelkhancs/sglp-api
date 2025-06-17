import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../database/sequelize';

const sequelize = SequelizeClass.getInstance().sequelize;

class Uploads extends Model {
  public id!: number;
  public fileHash!: string;
  public originalName!: string;
  public filePath!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

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
  },
  {
    sequelize,
    tableName: 'uploads',
    timestamps: true,
  }
);

export default Uploads;
