const { DataTypes, STRING } = require("sequelize");
const sequelize = require("../Helper/Connect");

const Order = sequelize.define("orders", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  pageId: {
    type: DataTypes.INTEGER,
    references: {
      model: "pages",
      key: "id",
    },
  },
  advertiserUserId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
  },
  creatorUserId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
  },
  adsTypeId: {
    type: DataTypes.INTEGER,
    references: {
      model: "adstypes",
      key: "id",
    },
  },
  paymentGateway: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  productImages: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return this.getDataValue("productImages") != null
        ? JSON.parse(this.getDataValue("productImages"))
        : [];
    },
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      return this.getDataValue("videoUrl") != null
        ? this.getDataValue("videoUrl")
        : "";
    },
  },
  specificDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  sendProduct: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  creatorAddress: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  orderStep: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
  },
  proposal: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  orderStatus: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  postUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
    get() {
      return this.getDataValue("postUrl") != null
        ? this.getDataValue("postUrl")
        : "";
    },
  },
  postImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      return this.getDataValue("comment") != null
        ? this.getDataValue("comment")
        : "";
    },
  },
});

module.exports = Order;
