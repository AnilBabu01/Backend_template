const express = require("express");
const app = express();
const common = require("./common");

app.use("/", common);

module.exports = app;
