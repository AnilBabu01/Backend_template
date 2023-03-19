const BillingInformation = require("../../Models/billingInformation.model");
const respHandler = require("../../Handlers");
const Order = require("../../Models/order.model");
const TradeAccount = require("../../Models/tradeaccount.model");
const SellOrder = require("../../Models/sellorder.model");
const {
  OrderStep,
  SellOrderStep,
  PaymentStatus,
} = require("../../Helper/Enum");
const { PayuPaymentController } = require("../Payment");
const AdsType = require("../../Models/adstype.model");
const Page = require("../../Models/page.model");
const Transaction = require("../../Models/transaction.model");
const AddBillingDetails = async (req, res) => {
  try {
    let {
      fullName,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      email,
      phoneNo,
      type,
      companyName,
      additionalInformation = "",
    } = req.body;

    let newBillingDetail = {
      userId: req.user.id,
      fullName,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      email,
      phoneNo,
      type,
      companyName,
      additionalInformation,
    };

    let [billingDetail, created] = await BillingInformation.findOrCreate({
      where: { userId: req.user.id, type },
      defaults: newBillingDetail,
    });
    await UpdateOrderDetails(req, res);
    let payuData = await PayuPaymentController.CreateOrder(req, res);
    if (!payuData.status) {
      return respHandler.error(res, { msg: payuData.msg, status: false });
    }
    return respHandler.success(res, {
      status: true,
      msg: "Billing details created successfully!!",
      data: [{...billingDetail.dataValues,...payuData.data}],
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: err.message,
      error: [err.message],
    });
  }
};
const GetBillingDetails = async (req, res) => {
  try {
    let userId = req.user.id;
    let { type } = req.params;
    let filter = {};
    if (type) {
      filter.type = type;
      filter.userId = userId;
    }

    let billingDetail = await BillingInformation.findOne({
      where: filter,
      attributes: {
        exclude: ["updatedAt"],
      },
    });
    if (!billingDetail) {
      return respHandler.error(res, { status: false, msg: "No data found!!" });
    }

    return respHandler.success(res, {
      status: true,
      msg: " Billing details fetch successfully!!",
      data: [billingDetail],
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

const UpdateBillingDetails = async (req, res) => {
  try {
    let userId = req.user.id;
    let { type } = req.params;

    let billingDetail = await BillingInformation.findOne({
      where: {
        type,
        userId,
      },
    });
    if (!billingDetail) {
      return respHandler.error(res, {
        status: false,
        msg: "No data found!!",
        error: [],
      });
    }
    let payload = req.body;
    let data = {};
    if (!payload.orderId || !payload.paymentGateway) {
      return respHandler.error(res, {
        msg: "Order id and Paymentgateway type is required",
        status: false,
      });
    }
    await UpdateOrderDetails(req, res);
    data.fullName = payload.fullName;
    data.addressLine1 = payload.addressLine1;
    data.addressLine2 = payload.addressLine2;
    data.city = payload.city;
    data.postalCode = payload.postalCode;
    data.email = payload.email;
    data.phoneNo = payload.phoneNo;
    data.type = payload.type;
    data.companyName = payload.companyName;
    data.additionalInformation = payload.additionalInformation ? payload.additionalInformation : "";

    await BillingInformation.update(data, {
      where: {
        type,
        userId,
      },
    });
    let payuData = await PayuPaymentController.CreateOrder(req, res);
    if (!payuData.status) {
      return respHandler.error(res, { msg: payuData.msg, status: false });
    }

    return respHandler.success(res, {
      status: true,
      msg: "Billing details updated successfully!!",
      data: [{...billingDetail.dataValues,...payuData.data}],
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: err.message,
      error: [err.message],
    });
  }
};

const UpdateOrderDetails = async (req, res) => {
  let payload = req.body;
  let order = {};
  let transaction = await Transaction.findOne({
    where: {
      orderId: payload.orderId,
      status: PaymentStatus.ACCEPTED,
    },
  });

  if (payload.type == "promotion") {
    order = await Order.findOne({
      where: {
        orderId: payload.orderId,
      },
      include: [
        {
          model: AdsType,
          attributes: [["price", "amount"]],
        },
        {
          model: Page,
          attributes: ["accountName"],
        },
      ],
    });
    if (!order) throw new Error("No data found!!");
    order.paymentGateway = payload.paymentGateway;
    req.body.amount = order.dataValues?.adstype?.dataValues?.amount;
    req.body.productInfo = order.dataValues?.page?.dataValues?.accountName;
  } else {
    order = await SellOrder.findOne({
      where: {
        orderId: payload.orderId,
      },
      include: [
        {
          model: TradeAccount,
          attributes: [["price", "amount"], "pageName"],
        },
      ],
    });
    if (!order) throw new Error("No data found!!");
    order.paymentGateway = payload.paymentGateway;
    req.body.amount = order.dataValues?.tradeaccount?.dataValues?.amount;
    req.body.productInfo = order.dataValues?.tradeaccount?.dataValues?.pageName;
  }
  await order.save();
  if (transaction) {
    throw new Error("You have already done payment!!");
  }
  console.log("in update ", req.body);
  return true;
};
module.exports = {
  AddBillingDetails,
  GetBillingDetails,
  UpdateBillingDetails,
};
