const express = require("express");
const app = express();

const Authentication = require("./Authentication");
const VerifyToken = require("../../Middleware/Auth");
const UserInformation = require("../User/UserInformation");

app.use("/", Authentication);
app.use(VerifyToken);
app.use("/", UserInformation);

module.exports = app;
