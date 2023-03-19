const express = require("express");
const router = express.Router();

//Middleware
const Userlogin = require("../Middleware/Userlogin");
const { Addaccountdata } = require("../Middleware/Validate");

const DashController = require("../Controllers/DashController");

module.exports = router;
