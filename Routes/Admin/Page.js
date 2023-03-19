const express = require("express");
const router = express.Router();

const {
  ApproveRejectPageValidation,
  UpdatePageValidation,
} = require("../../Middleware/Validate");
const PageController = require("../../Controllers/Promotion/PageController");

router.get("/", PageController.GetPages);
router.put(
  "/updatePageInsight/:id",
  UpdatePageValidation,
  PageController.UpdatePageInsight
);
module.exports = router;
