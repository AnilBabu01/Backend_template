const { config } = require("dotenv");
const jwt = require("jsonwebtoken");
const respHandler = require("../Handlers");
config();
const SECRET = process.env.SECRET;

const Userlogin = (req, res, next) => {
  const data = req.header("Authorization");
  if (data) {
    const headerArray = data.split(" ");
    let getToken = headerArray[1];
    let decoded = jwt.verify(getToken, SECRET);
    req.userid = decoded.id;
    next();
  } else {
    return respHandler.error(res, {
      status: false,
      msg: "This is not a valid request",
    });
  }
};

module.exports = Userlogin;
