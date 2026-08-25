const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ApiKey = sequelize.define(
  "ApiKey",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "api_keys",
    timestamps: true,
    underscored: true,
  }
);

module.exports = ApiKey;