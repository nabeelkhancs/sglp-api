import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../database/sequelize';
import { ICommittee } from './interfaces';

const sequelize = SequelizeClass.getInstance().sequelize;

class Committee extends Model<ICommittee> {}

Committee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cpNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    court: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    compositionHeadedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tors: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    report: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploadedFiles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
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
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'committees',
    indexes: [
      // {
      //   unique: true,
      //   fields: ['cpNumber'],
      // },
    ],
  }
);

export default Committee; 