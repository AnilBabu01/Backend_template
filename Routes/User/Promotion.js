const express = require("express");
const { uploadFile, upload } = require("../../Helper/utils");
const {
  AddOrderValidation,
  AddOrderReviewValidation,
} = require("../../Middleware/Validate");
const router = express.Router();
const {
  PageController,
  OrderController,
} = require("../../Controllers/Promotion");

// /api/promotion

router.post("/", PageController.FilterPage);
router.get("/getPromotionOrders", OrderController.GetPromotionOrders);
router.get("/relatedPages", OrderController.RelatedPages);

//getOrder
router.get("/order/:status/:userType", OrderController.Orders);


router.post(
  "/addOrder",
  uploadFile.fields([
    {
      name: "productImages",
      maxCount: 5,
    },
  ]),
  AddOrderValidation,
  OrderController.AddOrder
  );
  
  router.get("/getOrderDetail/:orderId", OrderController.GetOrder);
  router.put("/orderStatus/:orderId", OrderController.UpdateOrderStatuses);
  
  router.put(
    "/orderConfirmation/:orderId",
    uploadFile.fields([
      {
        name: "postImage",
      maxCount: 1,
    },
  ]),
  OrderController.OrderConfirmation
  );

  router.post(
    "/orderFeedback",
    AddOrderReviewValidation,
    OrderController.AddOrderFeedback
    );
    
router.get("/:pageId", PageController.GetCreaterProfile);

module.exports = router;
