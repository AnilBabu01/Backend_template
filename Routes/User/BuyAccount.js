const express = require("express");
const router = express.Router();
const { TradeController } = require("../../Controllers/Promotion");
const {
  AddSellOrderValidation,
  UpdateSellOrderValidation,
  VerifyAccountLoginCredentialValidation,
} = require("../../Middleware/Validate");
router.post("/addOrder", AddSellOrderValidation, TradeController.AddSellOrder);
router.put(
  "/updateAccountLoginDetail/:orderId",
  UpdateSellOrderValidation,
  TradeController.UpdateAccountCredential
);
router.put(
  "/verifyAccountLoginCredential/:orderId",
  VerifyAccountLoginCredentialValidation,
  TradeController.VerifyAccountLoginCredential
);
router.put(
  "/buyerConfirmLoginCredential/:orderId",
  TradeController.BuyerConfirmLoginCredential
);
router.get("/getOrderDetail/:orderId", TradeController.GetOrderDetailByOrderId);
module.exports = router;
