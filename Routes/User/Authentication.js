const express = require("express");
const router = express.Router();
const AuthController = require("../../Controllers/AuthController");
const verifyToken = require("../../Middleware/Auth");

const {
  Validation,
  LoginValidation,
  ResendOtpValidation,
} = require("../../Middleware/Validate");

router.post("/resend", ResendOtpValidation, AuthController.ResendOtp); // resend otp when user resgiter or forgot password
router.post("/register", Validation, AuthController.Register); // user registeration
router.post("/login", LoginValidation, AuthController.Login); // user login
router.post("/verify", AuthController.VerifyOtp); //verify the otp
router.post("/verifyMOtp", AuthController.forgotPasswordsendOTP);
router.put("/verifyMOtp", AuthController.UpdateForgotPassword);
router.get("/user", verifyToken, AuthController.GetUser);

module.exports = router;
