const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Page = require("./page.model");
const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mnumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verify_Otp: {
    type: DataTypes.INTEGER,
  },
  password: {
    type: DataTypes.TEXT,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  amount: {
    type: DataTypes.DECIMAL,
    defaultValue: 0,
  },
});
User.hasMany(Page, { foreignKey: "userId" });
Page.belongsTo(User, { foreignKey: "userId" });
module.exports = User;
