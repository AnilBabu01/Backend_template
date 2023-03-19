const express = require("express");
const app = express();
const router = express.Router();

const Intrest = require("./Intrest");
const Niche = require("./Niche");
const Page = require("./Page");
const SellAccount = require("./SellAccount");
const VerifyToken = require("../../Middleware/Auth");

app.use(VerifyToken);
app.use("/intrest", Intrest);
app.use("/niche", Niche);
app.use("/page", Page);
app.use("/sell", SellAccount);

module.exports = app;
