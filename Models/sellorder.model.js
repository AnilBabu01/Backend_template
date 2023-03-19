const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");

const SellOrder = sequelize.define("sellorders", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  buyerUserId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
  },
  sellerUserId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  accountId: {
    type: DataTypes.INTEGER,
    references: {
      model: "tradeaccounts",
      key: "id",
    },
  },
  orderStatus: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  orderStep: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  accountUserName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accountPassword: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  paymentGateway: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = SellOrder;
