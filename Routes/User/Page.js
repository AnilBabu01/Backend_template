const express = require("express");
const router = express.Router();

const { uploadFile, upload } = require("../../Helper/utils");
const {
  AddPageValidation,
  AddPageFAQValidation,
  AddAdsTypeValidation,
} = require("../../Middleware/Validate");
const {
  IntrestController,
  NicheController,
  PageController,
} = require("../../Controllers/Promotion");

router.get("/:pageId?", PageController.GetPages);
router.post(
  "/",
  uploadFile.fields([
    {
      name: "file",
      maxCount: 1,
    },
    {
      name: "insightImage",
      maxCount: 1,
    },
  ]),
  AddPageValidation,
  PageController.AddPage
);
router.put("/:id", uploadFile.fields([
  {
    name: "upload",
    maxCount: 1,
  },
  {
    name: "profileImage",
    maxCount: 1,
  },
  {
    name : "mostLikedImage",
    maxCount : 5
  }
]), PageController.UpdatePage);
router.delete("/:id", PageController.DeletePage);

// faq
router.get("/faq/:pageId", PageController.GetFaq);
router.post("/faq", AddPageFAQValidation, PageController.AddFAQ);
router.put("/faq/:id", AddPageFAQValidation, PageController.UpdateFAQ);
router.delete("/faq/:pageId/:id", PageController.DeleteFAQ);

// adstype
router.get("/adstype/:pageId", PageController.GetAdsType);
router.post("/adstype", AddAdsTypeValidation, PageController.AddAdsType);
router.put("/adstype/:id", AddAdsTypeValidation, PageController.UpdateAdsType);
router.delete("/adstype/:pageId/:id", PageController.DeleteAdsType);
router.get("/intrests", IntrestController.GetIntrest);
router.get("/niche", NicheController.GetNiche);

module.exports = router;
