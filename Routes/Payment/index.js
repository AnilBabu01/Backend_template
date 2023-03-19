const express = require("express");
const app = express();

const Payu = require("./Payu");

app.use("/payu", Payu);
module.exports = app;