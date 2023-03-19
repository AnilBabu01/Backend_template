const express = require("express");
const { BillingDetailValidation } = require("../../Middleware/Validate");
const router = express.Router();
const { BillingController } = require("../../Controllers/Promotion");

router.post("/", BillingDetailValidation, BillingController.AddBillingDetails);
router.get("/:type", BillingController.GetBillingDetails);
router.put("/:type",BillingDetailValidation, BillingController.UpdateBillingDetails);
module.exports = router;
