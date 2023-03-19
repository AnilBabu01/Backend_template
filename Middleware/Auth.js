const { config } = require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("../Models/user.model");
const respHandler = require("../Handlers");
config();

const SECRET_KEY = process.env.SECRET;

const verifyToken = async (req, res, next) => {
  console.log(req.headers["authorization"]);

  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];

  if (!token) {
    return respHandler.error(res, {
      status: false,
      msg: "A token is required for authentication",
      statuscode: 499,
    });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["updatedAt", "password", "verify_Otp"] },
    });
    req.user = user;
    next();
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Invalid Token",
      error: [err.message],
      statuscode: 401,
    });
  }
};

module.exports = verifyToken;
