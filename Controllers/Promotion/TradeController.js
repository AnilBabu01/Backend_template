const TradeAccount = require("../../Models/tradeaccount.model");
const SellOrder = require("../../Models/sellorder.model");
const respHandler = require("../../Handlers");
const { v4: uuidv4 } = require("uuid");
const { SortBy, FollowerRange, SellOrderStep } = require("../../Helper/Enum");
const { Op } = require("sequelize");
const AddTradeAccount = async (req, res) => {
  try {
    if (!req.files?.images) {
      return respHandler.error(res, {
        status: false,
        msg: "Error in file uploading",
      });
    }
    let getImages = req.files.images.map((file) => file.path);
    let images = JSON.stringify(getImages);
    let {
      pageName,
      averageLike,
      engagement,
      description,
      category,
      isearning,
      userName,
      follower,
      type = "sell",
      price,
    } = req.body;

    let data = {
      pageName,
      averageLike,
      userId: req.user.id,
      engagement,
      userName,
      images,
      description,
      category,
      isearning,
      follower,
      type,
      price,
    };

    let [tradeAccount, created] = await TradeAccount.findOrCreate({
      where: { userName: userName },
      defaults: data,
    });
    if (!created) {
      return respHandler.error(res, {
        status: false,
        msg: `Account with username ${userName} already exist!!`,
      });
    }
    return respHandler.success(res, {
      status: true,
      msg: "Trade account added successfully!!",
      data: [tradeAccount],
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

const GetTradeAccount = async (req, res) => {
  try {
    let userId = req.user.id;
    let filter = {};
    let { accountId } = req.params;

    if (accountId) {
      filter.id = accountId;
    }
    if (req.user.userType != "admin") {
      filter.userId = userId;
    }
    let tradeAccounts = await TradeAccount.findAll({
      where: filter,
    });

    if (accountId) {
      if (!tradeAccounts.length)
        return respHandler.error(res, {
          msg: "No data found!!",
          status: false,
        });
    }

    return respHandler.success(res, {
      status: true,
      msg: "Trade account fetched successfully!!",
      data: tradeAccounts,
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

const DeleteTradeAccount = async (req, res) => {
  try {
    const { id } = req.params;
    let tradeAccount = await TradeAccount.destroy({
      where: {
        id,
      },
    });

    if (!tradeAccount) {
      return respHandler.error(res, { status: false, msg: "No Data Found!!" });
    }
    return respHandler.success(res, {
      status: true,
      msg: "Trade account deleted successfully!!",
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

const UpdateTradeAccount = async (req, res) => {
  try {
    const { id } = req.params;
    let payload = req.body;
    let data = {};
    if (payload.pageName) {
      data.pageName = payload.pageName;
    }
    if (payload.userName) {
      data.userName = payload.userName;
    }
    if (payload.price) {
      data.price = payload.price;
    }
    if (payload.averageLike) {
      data.averageLike = payload.averageLike;
    }
    if (payload.follower) {
      data.follower = payload.follower;
    }
    if (payload.engagement) {
      data.engagement = payload.engagement;
    }

    if (payload.description) {
      data.description = payload.description;
    }

    if (payload.category) {
      data.category = payload.category;
    }

    if (payload.isearning) {
      data.isearning = payload.isearning;
    }

    if (req.files && req.files?.images) {
      let getImages = req.files.images.map((file) => file.path);
      data.images = JSON.stringify(getImages);
    }

    await TradeAccount.update(data, {
      where: {
        id,
      },
    });

    return respHandler.success(res, {
      status: true,
      msg: "Trade account updated successfully!!",
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

const Accounts = async (req, res) => {
  try {
    let {
      search,
      limit = 20,
      offset = 0,
      niche,
      sortBy = 1,
      follower,
      accountId,
    } = req.body;
    let filter = { status: 1 };
    let orderby = [];
    switch (sortBy) {
      case SortBy.POPULARITY:
        orderby.push(["follower", "DESC"]);
        break;
      case SortBy.LATEST:
        orderby.push(["createdAt", "DESC"]);
        break;
      case SortBy.LOWTOHIGH:
        orderby.push(["price", "ASC"]);
        break;
      case SortBy.HIGHTOLOW:
        orderby.push(["price", "DESC"]);
        break;
      default:
        break;
    }

    if (niche) {
      filter.category = niche;
    }

    if (search) {
      filter = {
        [Op.or]: [
          {
            pageName: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            userName: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      };
    }

    if (follower || follower == 0) {
      switch (follower) {
        case 100000:
          filter.follower = {
            [Op.gte]: [follower],
          };
          break;
        default:
          filter.follower = {
            [Op.between]: [follower, FollowerRange[follower]],
          };
          break;
      }
    }

    if (accountId) {
      filter = { id: accountId };
      orderby = [];
    }
    let accounts = await TradeAccount.findAll({
      where: filter,
      order: orderby,
      attributes: {
        exclude: ["updatedAt", "type"],
      },
      limit,
      offset,
    });
    return respHandler.success(res, {
      msg: "Accounts fetched successfully!!",
      status: true,
      data: accounts,
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

const RelatedAccount = async (req, res) => {
  try {
    let { niche, title, accountId } = req.query;
    let limit = 5;
    if (!niche || !title || !accountId) {
      return respHandler.error(res, {
        msg: "accountId,niche and title are required! ",
        status: false,
      });
    }
    let accounts = await TradeAccount.findAll({
      where: {
        category: niche,
        id: {
          [Op.ne]: accountId,
        },
      },
      limit,
    });

    if (!accounts.length) {
      let titleArr = title.split(" ");
      let filter = [];
      titleArr.forEach((element) => {
        let filterObj = {
          pageName: {
            [Op.like]: `%${element}%`,
          },
        };
        filter.push(filterObj);
      });
      accounts = await TradeAccount.findAll({
        where: {
          [Op.or]: {
            [Op.or]: filter,
          },
          id: {
            [Op.ne]: accountId,
          },
        },
        limit,
      });
    }

    return respHandler.success(res, {
      msg: "Accounts listed successfully!!",
      status: true,
      data: accounts,
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

const GetNotVerifiedAccount = async (req, res) => {
  try {
    let { limit = 10, offset = 0 } = req.query;
    const accounts = await TradeAccount.findAll({
      where: {
        status: 0,
      },
      limit,
      offset,
    });
    if (!accounts) {
      return respHandler.error(res, {
        status: false,
        msg: "No data found",
        error: [],
      });
    }

    return respHandler.success(res, {
      msg: "Trade accounts fetched successfully!!",
      status: true,
      data: accounts,
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

const UpdateStatus = async (req, res) => {
  try {
    let { id } = req.params;
    let payload = req.body;
    let data = {};
    data.status = payload.status;
    if (payload.comment && payload.status === 2) {
      data.comment = payload.comment;
    }
    await TradeAccount.update(data, {
      where: {
        id,
      },
    });
    return respHandler.success(res, {
      status: true,
      msg: "Trade account status updated successfully!!",
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

const AddSellOrder = async (req, res) => {
  try {
    let { sellerUserId, accountId } = req.body;
    console.log(req.body);
    let orderId = uuidv4();
    let data = {
      buyerUserId: req.user.id,
      orderId,
      sellerUserId,
      accountId,
    };

    let sellorder = await SellOrder.create(data);

    return respHandler.success(res, {
      status: true,
      msg: "Order created successfully!!",
      data: [sellorder],
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

const UpdateAccountCredential = async (req, res) => {
  try {
    const { orderId } = req.params;
    let payload = req.body;
    let data = {};
    let userId = req.user.id;
    let sellorder = await SellOrder.findOne({ where: { orderId } });
    if (sellorder.buyerUserId != userId && sellorder.sellerUserId != userId) {
      return respHandler.error(res, {
        msg: "You don't have right to access these detail!!",
        status: false,
      });
    }
    if (
      sellorder.orderStep != SellOrderStep.Billing &&
      sellorder.orderStep != SellOrderStep.SellerLoginCredential
    ) {
      return respHandler.error(res, {
        msg: "You are not eligible for this step!!",
        status: false,
      });
    }
    data.accountUserName = payload.accountUserName;
    data.accountPassword = payload.accountPassword;
    data.orderStep = SellOrderStep.SellerLoginCredential;

    await SellOrder.update(data, {
      where: {
        orderId,
      },
    });

    return respHandler.success(res, {
      status: true,
      msg: "Sellorder status changed successfully!!",
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

const VerifyAccountLoginCredential = async (req, res) => {
  try {
    const { orderId } = req.params;
    let payload = req.body;
    let data = {};
    let sellorder = await SellOrder.findOne({ where: { orderId } });

    if (
      sellorder.orderStep != SellOrderStep.AdminVerifyCredential &&
      sellorder.orderStep != SellOrderStep.SellerLoginCredential
    ) {
      return respHandler.error(res, {
        msg: "You are not eligible for this step!!",
        status: false,
      });
    }
    switch (payload.orderStatus) {
      case 1:
        data.orderStatus = payload.orderStatus;
        data.orderStep = SellOrderStep.AdminVerifyCredential;
        break;
      case 2:
        data.orderStatus = payload.orderStatus;
        break;
      default:
        break;
    }
    await SellOrder.update(data, {
      where: {
        orderId,
      },
    });

    return respHandler.success(res, {
      status: true,
      msg: "Account credential verified successfully!!",
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
const BuyerConfirmLoginCredential = async (req, res) => {
  try {
    const { orderId } = req.params;
    let payload = req.body;
    let sellorder = await SellOrder.findOne({ where: { orderId } });

    if (!sellorder) {
      return respHandler.error(res, { msg: "No data found!!", status: false });
    }

    if (
      sellorder.orderStep != SellOrderStep.AdminVerifyCredential &&
      sellorder.orderStep != SellOrderStep.BuyerConfirmation
    ) {
      return respHandler.error(res, {
        msg: "You are not eligible for this step!!",
        status: false,
      });
    }
    switch (payload.orderStatus) {
      case 1:
        sellorder.orderStatus = payload.orderStatus;
        sellorder.orderStep = SellOrderStep.BuyerConfirmation;
        break;
      case 2:
        sellorder.orderStatus = payload.orderStatus;
        break;
      default:
        break;
    }

    sellorder.save();

    return respHandler.success(res, {
      status: true,
      msg: "Status changed successfully!!",
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

const GetOrderDetailByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log(orderId);
    const order = await SellOrder.findOne({
      orderId,
    });
    if (!order) {
      return respHandler.error(res, {
        status: false,
        msg: "No data found",
        error: [],
      });
    }

    return respHandler.success(res, {
      msg: "order details fetched successfully!!",
      status: true,
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

module.exports = {
  AddTradeAccount,
  GetTradeAccount,
  DeleteTradeAccount,
  UpdateTradeAccount,
  Accounts,
  RelatedAccount,
  GetNotVerifiedAccount,
  UpdateStatus,
  AddSellOrder,
  UpdateAccountCredential,
  VerifyAccountLoginCredential,
  BuyerConfirmLoginCredential,
  GetOrderDetailByOrderId,
};
