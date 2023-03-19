const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const User = require("./user.model");

const UserInformation = sequelize.define("userinformations", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId : {
    type : DataTypes.INTEGER,
    references : {
        model : "users",
        key: "id",
    }
  },
  language : {
    type : DataTypes.STRING,
    defaultValue : "English",
    allowNull : true
  },
  country : {
    type : DataTypes.STRING,
    defaultValue : "India",
    allowNull : true
  },
  profileImage : {
    type : DataTypes.TEXT,
    allowNull : true
  },
  DOB : {
    type : DataTypes.DATE,
    allowNull : true
  },
  gender : {
    type : DataTypes.STRING,
    allowNull : true
  },
  accountType : {
    type : DataTypes.STRING,
    allowNull : true
  },
  description : {
    type : DataTypes.TEXT,
    allowNull : true
  },
  facebookProfileLink : {
    type : DataTypes.TEXT,
    allowNull : true
  },
  instagramProfileLink : {
    type : DataTypes.TEXT,
    allowNull : true
  },
  twitterProfileLink : {
    type : DataTypes.TEXT,
    allowNull : true
  }
});

User.hasOne(UserInformation,{foreignKey : "userId"});
UserInformation.belongsTo(User,{foreignKey : "userId"});

module.exports = UserInformation;
