const Order = require("../../Models/order.model");
const OrderFeedback = require("../../Models/orderfeedback.model");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const respHandler = require("../../Handlers");
const AdsType = require("../../Models/adstype.model");
const Page = require("../../Models/page.model");
const PageDetail = require("../../Models/pagedetail.model");
const { OrderStep, Status, OrderStatus, ProposalStatus } = require("../../Helper/Enum");
const {
  OrderDetailPage,
  CreatorProposal,
  Billing,
  AdAdded,
  AdsConfirmation,
  OrderFeedbackStatus,
} = OrderStep;
const { ACCEPT,IGNORE } = ProposalStatus

// Some Helper Function
const getQuery = (status) => {
  const { COMPLETED, ACTIVE, CANCEL } = Status
  const query = { }

  switch (Number(status)) {
    case COMPLETED: {
      query.orderStatus={
          [Op.eq]: 1
        }
      break;
    }
    case ACTIVE: {
      query.orderStatus={
        [Op.eq]:0
      }
      break;

    }
    case CANCEL: {
      query.orderStatus= {
        [Op.eq]: 2
      }
      break;
    }
    default:
      console.log("No Data Found")
      break;
  }

  return query
}

// ------END-----


const AddOrder = async (req, res) => {
  try {
    let orderId = uuidv4();
    const userId = req.user.id;
    if (!req.files || !req.files?.productImages) {
      return respHandler.error(res, {
        status: false,
        msg: "Error in file uploading",
      });
    }
    let getproductImages = req.files.productImages.map((file) => file.path);
    let productImages = JSON.stringify(getproductImages);
    let {
      pageId,
      companyName,
      creatorUserId,
      productName,
      description,
      videoUrl = "",
      specificDate,
      sendProduct,
      adsTypeId,
    } = req.body;
    if (creatorUserId == userId) {
      return respHandler.error(res, {
        msg: "You can't add order to himself!!",
        status: false,
      });
    }
    let newOrder = {
      orderId: orderId,
      advertiserUserId: userId,
      pageId,
      companyName,
      productName,
      description,
      videoUrl,
      specificDate,
      sendProduct,
      productImages,
      adsTypeId,
      creatorUserId,
    };
    const order = await Order.create(newOrder);
    return respHandler.success(res, {
      status: true,
      msg: "Order added successfully!!",
      data: [order],
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

const GetOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    let order = await Order.findOne({
      where: {
        orderId,
      },
      attributes: {
        exclude: ["updatedAt"],
      },
      include: [
        {
          model: AdsType,
        },
        {
          model: Page,
          attributes: [['accountName', "creatorName"]]
        }
      ],
    });
    if (!order) {
      return respHandler.error(res, { status: false, msg: "No data found!!" });
    }

    if (order.advertiserUserId != userId && order.creatorUserId != userId) {
      return respHandler.error(res, {
        msg: "You don't have right to see these detail!!",
        status: false,
      });
    }
    return respHandler.success(res, {
      status: true,
      msg: "Order fetch successfully!!",
      data: [order],
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

const UpdateOrderStatuses = async (req, res) => {
  try {
    const { orderId } = req.params;
    let payload = req.body;
    let orderData = {};

    let order = await Order.findOne({
      where: {
        orderId,
      },
    });
    if (!order) {
      return respHandler.error(res, { msg: "No data found!!", status: false });
    }

    if(order.orderStatus == OrderStatus.NOTDONE) return respHandler.error(res,{status : false , msg : "You have already rejected this order!!"})

    if (payload.proposal) {
      if (
        order.orderStep != OrderDetailPage &&
        order.orderStep != CreatorProposal
      ) {
        return respHandler.error(res, {
          msg: "You are not eligible for this step!!",
          status: false,
        });
      }
      if(payload.proposal == ACCEPT) orderData.orderStep = CreatorProposal;
      if(payload.proposal == IGNORE) orderData.orderStatus = OrderStatus.NOTDONE;
      orderData["proposal"] = payload.proposal;
      orderData["creatorAddress"] = payload.creatorAddress;
    }
    if (payload.orderStatus) {
      if (order.orderStep != AdAdded && order.orderStep != AdsConfirmation) {
        return respHandler.error(res, {
          msg: "You are not eligible for this step!!",
          status: false,
        });
      }
      orderData.orderStep = payload.orderStatus == 1 ? AdsConfirmation : payload.orderStatus == 3 ? Billing : AdAdded;
      if(payload.orderStatus == OrderStatus.NOTDONE) orderData.orderStatus = OrderStatus.NOTDONE;
      orderData.comment = payload.comment ? payload.comment : "";
      // orderData["orderStatus"] = payload.orderStatus;
    }
    await Order.update(orderData, {
      where: {
        orderId,
      },
    });
    return respHandler.success(res, {
      status: true,
      msg: "Order status changed Successfully!!",
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

const OrderConfirmation = async (req, res) => {
  try {
    const { orderId } = req.params;
    var payload = req.body;
    var orderData = {};
    console.log(req.files);
    if (!req.files && !req.files?.postImage) {
      return respHandler.error(res, {
        status: false,
        msg: "Error in file uploading",
      });
    }

    let order = await Order.findOne({
      where: {
        orderId,
      },
    });
    if (!order) {
      return respHandler.error(res, { msg: "No data found!!", status: false });
    }

    if(order.orderStatus == OrderStatus.NOTDONE) return respHandler.error(res,{status : false , msg : "You have already rejected this order!!"})

    if (order.orderStep != Billing && order.orderStep != AdAdded) {
      return respHandler.error(res, {
        msg: "You are not eligible for this step!!",
        status: false,
      });
    }

    orderData.orderStep = AdAdded;
    if (payload.postUrl) {
      orderData.postUrl = payload.postUrl;
    }

    if (req.files.postImage) {
      orderData.postImage = req.files.postImage[0].path;
    }

    await Order.update(orderData, {
      where: {
        orderId,
      },
    });
    return respHandler.success(res, {
      status: true,
      msg: "Order status changed successfully!!",
      data: [],
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

const AddOrderFeedback = async (req, res) => {
  try {
    let {
      orderId,
      engagementRate,
      leadResponseRating,
      targetAudienceRating,
      description,
    } = req.body;

    let newReview = {
      orderId,
      engagementRate,
      leadResponseRating,
      targetAudienceRating,
      description,
    };

    let order = await Order.findOne({
      where: {
        orderId,
      },
    });
    if (!order) {
      return respHandler.error(res, { msg: "No data found!!", status: false });
    }

    if (
      order.orderStep != AdsConfirmation &&
      order.orderStep != OrderFeedbackStatus
    ) {
      return respHandler.error(res, {
        msg: "You are not eligible for this step!!",
        status: false,
      });
    }
    let orderStep = OrderFeedbackStatus;
    await Order.update(
      { orderStep,orderStatus : OrderStatus.CONFIRM },
      {
        where: {
          orderId,
        },
      }
    );

    const review = await OrderFeedback.create(newReview);
    return respHandler.success(res, {
      status: true,
      msg: "Review added successfully!!",
      data: [review],
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

const GetPromotionOrders = async (req, res) => {
  try {
    let userId = req.user.id;
    let { limit = 10, offset = 0 } = req.query;
    let orders = await Order.findAll({
      where: {
        creatorUserId: userId,
        orderStep: OrderStep.OrderDetailPage
      },
      include: [
        {
          model: AdsType,
        },
      ],
      limit,
      offset,
    });

    return respHandler.success(res, {
      status: true,
      msg: "Orders data fetched successfully!!",
      data: orders,
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

const RelatedPages = async (req, res) => {
  try {
    let { niche, title, pageId } = req.query;
    let limit = 5;
    if (!niche || !title || !pageId) {
      return respHandler.error(res, {
        msg: "pageId,niche and title are required! ",
        status: false,
      });
    }
    let pages = await Page.findAll({
      where: {
        pageNiche: niche,
        id: {
          [Op.ne]: pageId,
        },
      },
      include: [
        {
          model: PageDetail
        }
      ],
      limit,
    });

    if (!pages.length) {
      let titleArr = title.split(" ");
      let filter = [];
      titleArr.forEach((element) => {
        let filterObj = {
          accountName: {
            [Op.like]: `%${element}%`,
          },
        };
        filter.push(filterObj);
      });
      pages = await Page.findAll({
        where: {
          [Op.or]: {
            [Op.or]: filter,
          },
          id: {
            [Op.ne]: pageId,
          },
        },
        include: [
          {
            model: PageDetail
          }
        ],
        limit,
      });
    }

    return respHandler.success(res, {
      msg: "Pages listed successfully!!",
      status: true,
      data: pages,
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

const Orders = async (req, res) => {
  const { status, userType } = req.params
  let stepQuery = getQuery(status)
  let currUserType = userType === "creator" ? "creatorUserId" : "advertiserUserId"

  try {
    let orders = await Order.findAll({
      where: {
        [Op.and]: [
          {
            [currUserType]: req.user.id,
          },
          stepQuery
        ]
      },
      include : [
        {
          model : Page,
          attributes : [["accountName","creatorName"]]
        },
        {
          model : AdsType
        }
      ]
    })

    return respHandler.success(res, {
      status: true,
      msg: 'all orders',
      data: orders
    })
  } catch (error) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
}

module.exports = {
  AddOrder,
  GetOrder,
  UpdateOrderStatuses,
  OrderConfirmation,
  AddOrderFeedback,
  GetPromotionOrders,
  RelatedPages,
  Orders
};
