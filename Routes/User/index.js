const express = require("express");
const app = express();

const Authentication = require("./Authentication");
const Page = require("./Page");
const Promotion = require("./Promotion");
const SellAccount = require("./SellAccount");
const Billing = require("./Billing");
const BuyAccount = require("./BuyAccount");
const VerifyToken = require("../../Middleware/Auth");
const UserInformation = require("../User/UserInformation");

app.use("/", Authentication);
app.use(VerifyToken);
app.use("/page", Page);
app.use("/promotion", Promotion);
app.use("/sell", SellAccount);
app.use("/billing", Billing);
app.use("/buy", BuyAccount);
app.use("/",UserInformation);

module.exports = app;
