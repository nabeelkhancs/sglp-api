import { DataTypes, Model } from 'sequelize';
import SequelizeClass from '../../database/sequelize';
import { IPages } from './interfaces';

const sequelize = SequelizeClass.getInstance().sequelize;

class Pages extends Model<IPages> { }

Pages.init(
  {
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    moduleId: {
      type: DataTypes.INTEGER,
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
  },

  {
    sequelize,
    tableName: 'pages',
    indexes: [
      {
        unique: true,
        fields: ['url'],
      },
      {
        unique: true,
        fields: ['order'],
      },
    ]
  }
);

export default Pages;