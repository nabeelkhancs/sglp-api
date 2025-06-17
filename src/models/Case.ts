import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../database/sequelize';
import { ICases } from './interfaces';

const sequelize = SequelizeClass.getInstance().sequelize;

class Cases extends Model<ICases> { }

Cases.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    caseNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    caseTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    court: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    relativeDepartment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateReceived: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateOfHearing: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    caseStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    caseRemarks: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isUrgent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isCallToAttention: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
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
      allowNull: true,
    },
    deletedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    uploadedFiles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
  },

  {
    sequelize,
    tableName: 'cases',
    // indexes: [
    //   {
    //     unique: true,
    //     fields: [''],
    //   }
    // ]
  }
);

export default Cases;