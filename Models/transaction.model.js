const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const { PaymentStatus } = require("../Helper/Enum");

const Transaction = sequelize.define("transactions", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  transactionId : {
    type : DataTypes.STRING,
    allowNull : false,
    unique: true,
  },
  orderId : {
    type : DataTypes.STRING,
    allowNull : false,
  },
  type : {
    type : DataTypes.STRING,
    allowNull : false,
    defaultValue : "promotion"
  },
  payuId : {
    type : DataTypes.STRING,
    allowNull : true,
  },
  amount : {
    type : DataTypes.INTEGER,
    allowNull : false,
  },
  status : {
    type : DataTypes.INTEGER,
    allowNull : false,
    defaultValue : PaymentStatus.PENDING
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
  },
});

module.exports = Transaction;
