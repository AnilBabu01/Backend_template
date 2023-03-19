const express = require("express");
const router = express.Router();
const { TradeController } = require("../../Controllers/Promotion");
const {
  UpdateTradeAccountStatusValidation,
} = require("../../Middleware/Validate");

router.get("/", TradeController.GetNotVerifiedAccount);
router.put(
  "/:id",
  UpdateTradeAccountStatusValidation,
  TradeController.UpdateStatus
);
module.exports = router;
