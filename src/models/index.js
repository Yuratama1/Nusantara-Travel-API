const User = require("./User");
const Category = require("./Category");
const Destination = require("./Destination");
const ApiKey = require("./ApiKey");
const ApiUsage = require("./ApiUsage");

// User → ApiKey
User.hasMany(ApiKey, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

ApiKey.belongsTo(User, {
  foreignKey: "user_id",
});

// Category → Destination
Category.hasMany(Destination, {
  foreignKey: "category_id",
  onDelete: "CASCADE",
});

Destination.belongsTo(Category, {
  foreignKey: "category_id",
});

// ApiKey → ApiUsage
ApiKey.hasMany(ApiUsage, {
  foreignKey: "api_key_id",
  onDelete: "CASCADE",
});

ApiUsage.belongsTo(ApiKey, {
  foreignKey: "api_key_id",
});

module.exports = {
  User,
  Category,
  Destination,
  ApiKey,
  ApiUsage,
};