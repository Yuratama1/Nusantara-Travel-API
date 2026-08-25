const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ApiUsage = sequelize.define(
  "ApiUsage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    api_key_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "api_keys",
        key: "id",
      },
    },

    endpoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    requested_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "api_usage",
    timestamps: false,
    underscored: true,
  }
);

module.exports = ApiUsage;