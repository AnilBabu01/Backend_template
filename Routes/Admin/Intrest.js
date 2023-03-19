const express = require("express");
const router = express.Router();
const { IntrestController } = require("../../Controllers/Promotion");
const { ValidateName } = require("../../Middleware/Validate");

router.get("/", IntrestController.GetIntrest); // get intrest
router.post("/", ValidateName, IntrestController.AddIntrest); // add Intrest
router.put("/:id", ValidateName, IntrestController.UpdateIntrest); // update Intrest
router.delete("/:id", IntrestController.DeleteIntrest); // update Intrest

module.exports = router;
