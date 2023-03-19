const express = require("express");
const router = express.Router();
const {
  IntrestController,
  NicheController,
} = require("../../Controllers/Promotion");

router.get("/intrests", IntrestController.GetIntrest);
router.get("/niche", NicheController.GetNiche);

module.exports = router;
