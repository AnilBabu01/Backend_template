const { config } = require("dotenv");
var bcrypt = require("bcrypt");
const axios = require("axios");
const User = require("../Models/user.model");
var jwt = require("jsonwebtoken");
const respHandler = require("../Handlers");
config();
const SECRET = process.env.SECRET;

const Register = async (req, res) => {
  const { name, email, wnumber, password } = req.body;
  const genSalt = 10;
  const hash = await bcrypt.hash(password, genSalt);
  var val = Math.floor(1000 + Math.random() * 9000);
  let mess = `Hello ${name} \n Thankyou for registering in anil.com \n Your OTP is: ${val}`;
  const MsgUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=CgS6KLa6FZIWC4rGhHqjXUuBqaxaPbHxxgM8NItmRKFtJx1ncwGkmM1NqPEV&route=v3&sender_id=Cghpet&message=${mess}&language=english&flash=0&numbers=${wnumber}`;

  if (name != "" || email != "" || wnumber != "" || password != "") {
    try {
      let user = await User.findOne({ where: { email: email } });
      if (user != null) {
        return respHandler.error(res, {
          status: false,
          msg: "Email or Mobile Number already exist",
        });
      }
      let newUser = {
        name: name,
        mnumber: wnumber,
        email: email,
        verify_Otp: val,
        password: hash,
      };

      let createdUser = await User.create(newUser);
      if (createdUser) {
        axios
          .get(MsgUrl)
          .then(function (response) {
            // handle success
            return respHandler.success(res, {
              status: true,
              msg: "OTP send successfully!!",
            });
          })
          .catch(function (error) {
            // handle error
            console.log(error);
            return respHandler.error(res, {
              status: false,
              msg: error.message,
              error: [error.message],
            });
          });
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Something Went Wrong!!",
          error: [error.message],
        });
      }
    } catch (err) {
      return respHandler.error(res, {
        status: false,
        msg: "Something Went Wrong!!",
        error: [err.message],
      });
    }
  } else {
    return respHandler.error(res, {
      status: false,
      msg: "All fields are required!!",
    });
  }
};

//For resending the OTP
const ResendOtp = async (req, res) => {
  //console.log(req.params.id);
  let { wnumber } = req.body;
  var val = Math.floor(1000 + Math.random() * 9000);
  let message = `Ooh You not got the Otp \n Here is the new OTP : ${val}`;
  const MsgUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=CgS6KLa6FZIWC4rGhHqjXUuBqaxaPbHxxgM8NItmRKFtJx1ncwGkmM1NqPEV&route=v3&sender_id=Cghpet&message=${message}&language=english&flash=0&numbers=${wnumber}`;

  try {
    let user = await User.findOne({ where: { mnumber: wnumber } });
    if (user) {
      user.verify_Otp = val;
      await user.save();
      axios
        .get(MsgUrl)
        .then(function (response) {
          // handle success
          return respHandler.success(res, {
            status: true,
            msg: response.data.message[0],
          });
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          return respHandler.error(res, {
            status: false,
            msg: "Something went wrong!!",
            error: [error.message],
          });
        });
      return respHandler.success(res, {
        status: true,
        msg: "OTP send successfully!!",
      });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "User not found with this mobile no",
        statuscode: 404,
      });
    }
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: err.message,
      error: [err.message],
    });
  }
};

const Login = async (req, res) => {
  const { wnumber, password } = req.body;
  if (wnumber.length > 10) {
    return respHandler.error(res, {
      status: false,
      msg: "Enter Valid Number!!",
    });
  }
  try {
    let user = await User.findOne({
      where: { mnumber: wnumber },
      attributes: { exclude: ["updatedAt", "verify_Otp"] },
    });
    if (user == null) {
      return respHandler.error(res, {
        status: false,
        msg: "Please Enter Valid Credential!!",
      });
    }
    if (user.verified == 0) {
      return respHandler.error(res, {
        status: false,
        msg: "You are not verified",
      });
    }
    const working = await bcrypt.compare(password, user.password);
    if (working) {
      var token = jwt.sign(
        {
          id: user.id,
        },
        SECRET
      );
      user.password = undefined;
      return respHandler.success(res, {
        status: true,
        msg: "User loggedin successfully!!",
        data: [{ token: token, user: user }],
      });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Please Enter Valid Credential!!",
      });
    }
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const VerifyOtp = async (req, res) => {
  const { wnumber, otp } = req.body;
  try {
    let user = await User.findOne({
      where: { mnumber: wnumber, verify_Otp: otp },
    });
    if (user) {
      user.verified = 1;
      await user.save();
      return respHandler.success(res, {
        status: true,
        msg: "OTP Verified Successfully!!",
      });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Enter Valid OTP!!",
      });
    }
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: err.message,
      error: [err.message],
    });
  }
};

const forgotPasswordsendOTP = async (req, res) => {
  const { wnumber } = req.body;
  var val = Math.floor(1000 + Math.random() * 9000);
  let mess = `Ooh Please verify your number to update your password \n Here is the new OTP : ${val}`;
  const MsgUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=CgS6KLa6FZIWC4rGhHqjXUuBqaxaPbHxxgM8NItmRKFtJx1ncwGkmM1NqPEV&route=v3&sender_id=Cghpet&message=${mess}&language=english&flash=0&numbers=${wnumber}`;

  if (!wnumber) {
    return respHandler.error(res, {
      status: false,
      msg: "Mobile Number is required",
    });
  }
  try {
    let user = await User.findOne({ where: { mnumber: wnumber } });
    if (user) {
      user.verify_Otp = val;
      await user.save();
      axios
        .get(MsgUrl)
        .then(function (response) {
          // handle success
          return respHandler.success(res, {
            status: true,
            msg: response.data.message[0],
          });
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          return respHandler.error({
            status: false,
            msg: error.message,
            error: [error.message],
          });
        });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Your are not registered with this number",
      });
    }
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: err.message,
      error: [err.message],
    });
  }
};

const UpdateForgotPassword = async (req, res) => {
  const { reOtp, repassword, wnumber } = req.body;
  const genSalt = 10;
  const hash = await bcrypt.hash(repassword, genSalt);
  if (reOtp != "" || repassword != "" || wnumber != "") {
    try {
      let user = await User.findOne({ where: { mnumber: wnumber } });
      if (user) {
        if (user.verify_Otp == reOtp) {
          user.password = hash;
          await user.save();
          return respHandler.success(res, {
            status: true,
            msg: "Password updated please login",
          });
        } else {
          return respHandler.error(res, {
            status: false,
            msg: "Entered wrong OTP",
          });
        }
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Your are not registered with this number",
        });
      }
    } catch (err) {
      return respHandler.error(res, {
        status: false,
        msg: err.message,
        error: [err.message],
      });
    }
  }
};

const GetUser = async (req, res) => {
  try {
    let { id } = req.user;
    if (!id) {
      return respHandler.error(res, {
        status: false,
        msg: "Something went wrong!!",
      });
    }
    let user = await User.findByPk(id, {
      attributes: {
        exclude: ["updatedAt", "password", "verify_Otp"],
      },
    });
    if (!user) {
      return respHandler.error(res, {
        status: false,
        msg: "No data found!!",
      });
    }
    return respHandler.success(res, {
      status: true,
      msg: "user details returned successfully!!",
      data: [user],
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: err.message,
      error: [err.message],
    });
  }
};

module.exports = {
  Register,
  ResendOtp,
  Login,
  VerifyOtp,
  forgotPasswordsendOTP,
  UpdateForgotPassword,
  GetUser,
};
