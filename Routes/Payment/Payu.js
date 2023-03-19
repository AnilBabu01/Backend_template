const express = require("express");
const router = express.Router();
const { PayuPaymentController } = require("../../Controllers/Payment");

// /payment/payu/
router.post("/webhookSuccessResponse", PayuPaymentController.PayuWebHookSuccessResponse);
router.post("/webhookRefundResponse", PayuPaymentController.PayuWebHookRefundResponse);

module.exports = router;
