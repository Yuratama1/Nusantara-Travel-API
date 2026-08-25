const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Destination = sequelize.define(
  "Destination",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },

    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },

    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      },
    },

    review_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    ticket_price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    opening_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },

    closing_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "active",
    },
  },
  {
    tableName: "destinations",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Destination;