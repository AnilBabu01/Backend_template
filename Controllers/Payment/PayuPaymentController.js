var sha512 = require("js-sha512");
const respHandler = require("../../Handlers");
const { v4: uuidv4 } = require("uuid");
const { config } = require("dotenv");
const Transaction = require("../../Models/transaction.model");
const Order = require("../../Models/order.model");
const SellOrder = require("../../Models/sellorder.model");
config();

const {
  OrderStep,
  SellOrderStep,
  PaymentStatus,
  ProposalStatus,
} = require("../../Helper/Enum");
const { Op } = require("sequelize");
const MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY;
const MERCHANT_SALT = process.env.PAYU_SALT;
const { allowedIPs } = require("../../Helper/Constant");

const CreateOrder = async (req, res) => {
  try {
    let { orderId, fullName, email, type, productInfo, amount } = req.body;
    let transactionId = uuidv4();
    let hashingValues = `${MERCHANT_KEY}|${transactionId}|${amount}|${productInfo}|${fullName}|${email}|||||||||||${MERCHANT_SALT}`;
    let hash = sha512.sha512(hashingValues);
    let data = { transactionId, orderId, type, amount, userId: req.user.id };
    await Transaction.create(data);
    return {
      status: true,
      data: {
        transactionId,
        productinfo: productInfo,
        firstname: fullName,
        amount,
        email,
        hash,
      },
    };
  } catch (err) {
    return {
      status: false,
      msg: err.message,
    };
  }
};

const PayuWebHookSuccessResponse = async (req, res) => {
  try {
    let ip = req.socket.remoteAddress;
    console.log("=-=-=-=-=ip-=-=-", ip);
    if (!allowedIPs.includes(ip)) {
      return respHandler.error(res, {
        msg: "You don't have access to this route!!",
        status: false,
      });
    }
    let {
      customerName,
      paymentMode,
      hash,
      status,
      error_Message,
      paymentId,
      productInfo,
      customerEmail,
      merchantTransactionId,
      amount,
    } = req.body;
    let hashingValues = `${MERCHANT_SALT}|${status}|||||||||||${customerEmail}|${customerName}|${productInfo}|${amount}|${merchantTransactionId}|${MERCHANT_KEY}`;
    let newHash = sha512.sha512(hashingValues);
    if (hash != newHash) {
      return respHandler.error(res, {
        msg: "Hash value mismatched!!",
        status: false,
      });
    }
    let transaction = await Transaction.findOne({
      where: {
        transactionId: merchantTransactionId,
        status: PaymentStatus.PENDING,
      },
    });
    if (!transaction) {
      return respHandler.error(res, {
        msg: "No pending transaction found!!",
        status: false,
      });
    }
    let order = {};
    if (transaction.type == "promotion") {
      order = await Order.findOne({
        where: {
          orderId: transaction.orderId,
        },
      });
      if (status == "success") order.orderStep = OrderStep.Billing;
    } else {
      order = await SellOrder.findOne({
        where: {
          orderId: transaction.orderId,
        },
      });
      if (status == "success") order.orderStep = SellOrderStep.Billing;
    }
    await order.save();
    transaction.status =
      status == "success" ? PaymentStatus.ACCEPTED : PaymentStatus.REJECTED;
    transaction.payuId = paymentId;
    await transaction.save();
    console.log(req.body);
    return respHandler.success(res, {
      msg: "Transaction status changed successfully!!",
    });
  } catch (err) {
    return respHandler.error(res, {
      msg: "Something went wrong!!",
      status: false,
      error: [err.message],
    });
  }
};

const PayuWebHookRefundResponse = async (req, res) => {
  try {
    let ip = req.socket.remoteAddress;
    console.log("=-=-=-=-=ip-=-=-", ip);
    if (!allowedIPs.includes(ip)) {
      return respHandler.error(res, {
        msg: "You don't have access to this route!!",
        status: false,
      });
    }
    let {
      customerName,
      paymentMode,
      hash,
      status,
      error_Message,
      paymentId,
      productInfo,
      customerEmail,
      merchantTransactionId,
      amount,
    } = req.body;
    let hashingValues = `${MERCHANT_SALT}|${status}|||||||||||${customerEmail}|${customerName}|${productInfo}|${amount}|${merchantTransactionId}|${MERCHANT_KEY}`;
    let newHash = sha512.sha512(hashingValues);
    if (hash != newHash) {
      return respHandler.error(res, {
        msg: "Hash value mismatched!!",
        status: false,
      });
    }
    let transaction = await Transaction.findOne({
      where: {
        transactionId: merchantTransactionId,
        status: PaymentStatus.ACCEPTED,
      },
    });
    if (!transaction) {
      return respHandler.error(res, {
        msg: "No pending transaction found!!",
        status: false,
      });
    }
    let order = {};
    if (transaction.type == "promotion") {
      order = await Order.findOne({
        where: {
          orderId: transaction.orderId,
        },
      });
      order.proposal = ProposalStatus.IGNORE;
    } else {
      order = await SellOrder.findOne({
        where: {
          orderId: transaction.orderId,
        },
      });
      order.orderStep = SellOrderStep.Billing;
    }
    await order.save();
    transaction.status = PaymentStatus.REFUND;
    transaction.payuId = paymentId;
    await transaction.save();
    console.log(req.body);
    return respHandler.success(res, {
      msg: "Transaction status changed successfully!!",
    });
  } catch (err) {
    return respHandler.error(res, {
      msg: "Something went wrong!!",
      status: false,
      error: [err.message],
    });
  }
};

module.exports = {
  CreateOrder,
  PayuWebHookSuccessResponse,
  PayuWebHookRefundResponse,
};
