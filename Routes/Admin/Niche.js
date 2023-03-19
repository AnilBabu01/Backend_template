const express = require("express");
const router = express.Router();

const { ValidateName } = require("../../Middleware/Validate");
const { NicheController } = require("../../Controllers/Promotion");

router.get("/", NicheController.GetNiche);
router.post("/", ValidateName, NicheController.AddNiche);
router.put("/:id", ValidateName, NicheController.UpdateNiche);
router.delete("/:id", NicheController.DeleteNiche);

module.exports = router;
