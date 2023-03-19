const { config } = require("dotenv");
const { Sequelize } = require("sequelize");
config();
let DATABASE = process.env.DATABASE;
let USER = process.env.USER;
let HOST = process.env.HOST;
let PASSWORD = process.env.PASSWORD;
let PORT = process.env.PORT;
const SERVER = process.env.SERVER;

switch (SERVER) {
  case "dev":
    DATABASE = process.env.DEV_DATABASE;
    USER = process.env.DEV_USER;
    HOST = process.env.DEV_HOST;
    PASSWORD = process.env.DEV_PASSWORD;
    PORT = process.env.DEV_PORT;
    break;
  case "prod":
    DATABASE = process.env.PROD_DATABASE;
    USER = process.env.PROD_USER;
    HOST = process.env.PROD_HOST;
    PASSWORD = process.env.PROD_PASSWORD;
    PORT = process.env.PROD_PORT;
    break;
  default:
    break;
}

console.log("DATABASE--------->", DATABASE);
console.log("USER--------->", USER);
console.log("PASSWORD--------->", PASSWORD);
console.log("PORT--------->", PORT);
const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  host: HOST,
  dialect: "mysql",
  port: PORT,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

module.exports = sequelize;
