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
      allowNull: true,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    relativeDepartment: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    subjectOfApplication: {
      type: DataTypes.STRING,
      allowNull: true,
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
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    caseRemarks: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    isCsCalledInPerson: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    uploadedFiles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    committeeApprovalFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cpNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    caseType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    registry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },

  {
    sequelize,
    tableName: 'cases',
    indexes: [
      {
        unique: true,
        fields: ['cpNumber'],
      }
    ]
  }
);

export default Cases;