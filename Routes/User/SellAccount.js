const express = require("express");
const { uploadFile, upload } = require("../../Helper/utils");
const { AddTradeValidation } = require("../../Middleware/Validate");
const { TradeController } = require("../../Controllers/Promotion");
const router = express.Router();

router.get("/relatedAccounts", TradeController.RelatedAccount);
router.post(
  "/",
  uploadFile.fields([
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  AddTradeValidation,
  TradeController.AddTradeAccount
);

router.get("/:accountId?", TradeController.GetTradeAccount);
router.delete("/:id", TradeController.DeleteTradeAccount);
router.put(
  "/:id",
  uploadFile.fields([
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  TradeController.UpdateTradeAccount
);
router.post("/accounts", TradeController.Accounts);

module.exports = router;
