const express = require("express");
const router = express.Router();
const { uploadFile } = require("../../Helper/utils");
const UserController = require("../../Controllers/UserController");
const { UpdateUserProfileValidation } = require("../../Middleware/Validate");

router.put(
  "/user",
  uploadFile.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
  ]),
  UpdateUserProfileValidation,
  UserController.UpdateUserInfo
);
router.get("/userDetail",UserController.GetUserInformation);

module.exports = router;
