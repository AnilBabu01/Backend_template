const { Op } = require("sequelize");
const AdsType = require("../../Models/adstype.model");
const Page = require("../../Models/page.model");
const PageDetail = require("../../Models/pagedetail.model");
const PageFAQ = require("../../Models/pagefaq.model");
const { PageStatus, AgeRange } = require("../../Helper/Enum");
const User = require("../../Models/user.model");
const utils = require("../../Helper/utils");
const { Sequelize } = require("sequelize");
const respHandler = require("../../Handlers");

const AddPage = async (req, res) => {
  try {
    req.body.reach = 0;
    req.body.engagement = 0;
    req.body.follower = 0;
    console.log(req.files);
    if (!req.files.file || !req.files.insightImage) {
      return respHandler.error(res, {
        status: false,
        msg: "Error in file uploading",
      });
    }

    let {
      accountName,
      userName,
      intrest,
      ageOfAudience,
      profileLink,
      targetLocation,
      pageNiche,
      engagement,
      follower,
      reach,
    } = req.body;

    let newPage = {
      userId: req.user.id,
      reach,
      engagement,
      follower,
      accountName,
      intrest,
      ageOfAudience,
      postUrl: req.files.file[0].path,
      insightImage: req.files.insightImage[0].path,
      profileUrl: profileLink,
      targetLocation,
      pageNiche,
    };

    let eachColumnPercent = (100 / 19).toFixed(2);
    let percentage = 8 * eachColumnPercent;
    newPage.profilePercentage = percentage;
    let [page, created] = await Page.findOrCreate({
      where: { userName: userName },
      defaults: newPage,
    });
    if (!created) {
      return respHandler.error(res, {
        status: false,
        msg: `Page with username ${userName} already exist!!`,
      });
    }
    let [pagedetails, pageDetailsCreated] = await PageDetail.findOrCreate({
      where: { pageId: page.id },
    });
    return respHandler.success(res, {
      status: true,
      msg: "Page Added Successfully!!",
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const UpdatePage = async (req, res) => {
  try {
    console.log("req.file------------->", req.files);
    var payload = req.body;
    var pageId = req.params.id;
    var data = {};
    var pageData = {};
    if (req.files.upload) {
      data.coverImage = req.files.upload[0].path;
    }

    if (req.files?.profileImage) {
      pageData.profileImage = req.files.profileImage[0].path;
    }

    if (req.files?.mostLikedImage) {
      let mostLikedImage = JSON.stringify(
        req.files.mostLikedImage.map((file) => file.path)
      );
      data.mostLikedImage.push(mostLikedImage);
    }
    if (payload.intrest) {
      pageData.intrest = payload.intrest;
    }
    if (payload.ageOfAudience) {
      pageData.ageOfAudience = payload.ageOfAudience;
    }
    if (payload.targetLocation) {
      pageData.targetLocation = payload.targetLocation;
    }
    if (payload.pageNiche) {
      pageData.pageNiche = payload.pageNiche;
    }
    if (payload.tagline) {
      data.tagline = payload.tagline;
    }
    if (payload.description) {
      data.description = payload.description;
    }
    if (payload.shortDescription) {
      data.shortDescription = payload.shortDescription;
    }
    if (payload.tags) {
      data.tags = payload.tags;
    }

    let pageDetail = { ...pageData };
    pageDetail.pagedetail = data;
    let percentage = await utils.profileCompletePercentage(pageId, pageDetail);
    pageData.profilePercentage = percentage;
    await PageDetail.update(data, {
      where: {
        pageId: pageId,
      },
    });
    await Page.update(pageData, {
      where: {
        id: pageId,
      },
    });
    return respHandler.success(res, {
      status: true,
      msg: "Page Detail Updated Successfully!!",
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const DeletePage = async (req, res) => {
  try {
    let { id } = req.params;
    await PageFAQ.destroy({
      where: {
        pageId: id,
      },
    });
    await AdsType.destroy({
      where: {
        pageId: id,
      },
    });
    await PageDetail.destroy({
      where: {
        pageId: id,
      },
    });
    let page = await Page.destroy({
      where: {
        id,
      },
    });
    console.log("page----------->", page);
    if (!page) {
      return respHandler.error(res, { status: false, msg: "No Data Found!!" });
    }
    return respHandler.success(res, {
      status: true,
      msg: "Page Deleted successfully!!",
    });
  } catch (err) {
    console.log(err);
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const GetPages = async (req, res) => {
  try {
    console.log(req.user);
    let userId = req.user.id;
    let {limit=10,offset=0} = req.query;
    let filter = {};
    let { pageId } = req.params;

    if (pageId) {
      filter.id = pageId;
    }
    if (req.user.userType != "admin") {
      filter.userId = userId;
    }
    let pages = await Page.findAll({
      where: filter,
      nest: true,
      attributes: [
        "id",
        "userId",
        "accountName",
        "userName",
        "intrest",
        "ageOfAudience",
        "postUrl",
        "profileUrl",
        "targetLocation",
        "pageNiche",
        "insightImage",
        "engagement",
        "reach",
        "follower",
        "level",
        "rating",
        ["status", "verification"],
        "profileImage",
        "profilePercentage",
        [Sequelize.literal("0"), "pendingOrder"],
        [Sequelize.literal("0"), "completedOrder"],
      ],
      include: [
        {
          model: PageDetail,
        },
      ],
      limit,
      offset
    });
    if (pageId) {
      if (!pages.length)
        return respHandler.error(res, {
          msg: "No data found!!",
          status: false,
        });
    }
    return respHandler.success(res, {
      status: true,
      msg: "Pages listed successfully!!",
      data: pages,
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const GetFaq = async (req, res) => {
  try {
    let pageId = req.params.pageId;
    let faqs = await PageFAQ.findAll({
      where: {
        pageId: pageId,
      },
    });
    return respHandler.success(res, {
      status: true,
      msg: "PageFAQ listed successfully!!",
      data: faqs,
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const AddFAQ = async (req, res) => {
  try {
    const { pageId, title, description } = req.body;
    let faq = await PageFAQ.create({ pageId, title, description });
    if (faq) {
      return respHandler.success(res, {
        status: true,
        msg: "PageFAQ Added successfully!!",
      });
    }
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const UpdateFAQ = async (req, res) => {
  try {
    let id = req.params.id;
    let { pageId, title, description } = req.body;
    let faq = await PageFAQ.update(
      { title, description },
      {
        where: {
          id,
          pageId,
        },
      }
    );
    return respHandler.success(res, {
      status: true,
      msg: "Page Detail Updated Successfully!!",
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const DeleteFAQ = async (req, res) => {
  try {
    let { id, pageId } = req.params;
    let faq = await PageFAQ.destroy({
      where: {
        id,
        pageId,
      },
    });
    console.log("faq----------->", faq);
    if (!faq) {
      return respHandler.error(res, {
        status: false,
        msg: "No data found!!",
      });
    }
    return respHandler.success(res, {
      status: true,
      msg: "Page FAQ Deleted successfully!!",
    });
  } catch (err) {
    console.log(err);
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const GetAdsType = async (req, res) => {
  try {
    let pageId = req.params.pageId;
    let adstypes = await AdsType.findAll({
      where: {
        pageId: pageId,
      },
    });
    return respHandler.success(res, {
      status: true,
      msg: "AdsType listed successfully!!",
      data: adstypes,
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const AddAdsType = async (req, res) => {
  try {
    let { pageId, title, description, price, type } = req.body;
    let [adstype, created] = await AdsType.findOrCreate({
      where: { type: type, pageId: pageId },
      defaults: {
        pageId,
        title,
        description,
        price,
        type,
      },
    });
    if (!created) {
      return respHandler.error(res, {
        status: false,
        msg: `AdsType with type ${type} already exists!!`,
      });
    }

    return respHandler.success(res, {
      status: true,
      msg: "AdsType Added successfully!!",
    });

    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const UpdateAdsType = async (req, res) => {
  try {
    let id = req.params.id;
    let { pageId, title, description, price, type } = req.body;
    let adstype = await AdsType.update(
      { title, description, price, type },
      {
        where: {
          id,
          pageId,
        },
      }
    );
    console.log("adstype-------->", adstype);
    return respHandler.success(res, {
      status: true,
      msg: "AdsType updated successfully!!",
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const DeleteAdsType = async (req, res) => {
  try {
    let { id, pageId } = req.params;
    let adstype = await AdsType.destroy({
      where: {
        id,
        pageId,
      },
    });
    console.log("adstype----------->", adstype);
    if (!adstype) {
      return res.status(404).json({ status: false, msg: "No Data Found!!" });
    }
    return respHandler.success(res, {
      status: true,
      msg: "AdsType Deleted successfully!!",
    });
  } catch (err) {
    console.log(err);
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const ApproveOrRejectPage = async (req, res) => {
  try {
    let id = req.params.id;
    let { status } = req.body;
    let dataToSendEmail = {
      slug: "",
      subject: "",
      to: "",
      body: { name: "", userName: "" },
    };
    let isSendEmail = false;
    switch (status) {
      case 0:
        status = PageStatus.PENDING;
        break;
      case 1:
        status = PageStatus.APPROVED;
        dataToSendEmail.slug = "approve-page";
        dataToSendEmail.subject = "Page Approved";
        isSendEmail = true;
        break;
      case 2:
        status = PageStatus.REJECTED;
        dataToSendEmail.slug = "reject-page";
        dataToSendEmail.subject = "Page Rejected";
        isSendEmail = true;
        break;
      default:
        break;
    }
    let page = await Page.update(
      { status },
      {
        where: {
          id,
          status: {
            [Op.notIn]: [PageStatus.APPROVED, PageStatus.REJECTED],
          },
        },
      }
    );
    if (!page[0]) {
      return respHandler.error(res, {
        status: false,
        msg: "Page status has been already changed Or Page Not Found!!",
      });
    }

    page = await Page.findByPk(id);
    let user = await User.findByPk(page.userId);
    if (isSendEmail) {
      dataToSendEmail.body.name = page.accountName;
      dataToSendEmail.body.userName = user.name;
      dataToSendEmail.to = user.email;
      // send email
      await utils.sendEmail(dataToSendEmail);
      return respHandler.success(res, {
        status: true,
        msg: "Page insight updated successfully!!",
      });
    }
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const UpdatePageInsight = async (req, res) => {
  try {
    let data = req.body;
    let { id } = req.params;
    let page = await Page.update(data, {
      where: {
        id,
      },
    });
    console.log("page----------->", page);
    req.body.status =
      req.body.follower || req.body.reach || req.body.engagement ? 1 : 2;
    if (!page[0]) {
      return respHandler.error(res, {
        status: false,
        msg: "No data updated!!",
      });
    }
    return await ApproveOrRejectPage(req, res);
  } catch (err) {
    console.log(err);
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const FilterPage = async (req, res) => {
  try {
    const {
      search,
      limit = 20,
      offset = 0,
      age,
      state,
      pageNiche,
      minBudget,
      maxBudget,
      type,
    } = req.body;
    let orderby = ["createdAt", "ASC"];
    if (type == "newcreator") {
      orderby = ["createdAt", "DESC"];
    }
    let filter = {
      profilePercentage: {
        [Op.gte]: 70,
      },
    };
    let endage;
    let budgetFilter = {};

    if (age) {
      endage = AgeRange[age];
    }

    if (minBudget && maxBudget) {
      budgetFilter.required = true;
      budgetFilter.where = {
        price: {
          [Op.between]: [minBudget, maxBudget],
        },
      };
    }

    if (search) {
      filter = {
        ["userName"]: {
          [Op.regexp]: `${search}`,
        },
      };
    }

    if (age) {
      filter = {
        ageOfAudience: {
          [Op.and]: {
            [Op.gte]: age,
            [Op.lte]: endage,
          },
        },
      };
    }

    if (state) {
      filter = {
        targetLocation: state,
      };
    }

    if (pageNiche) {
      filter = {
        pageNiche: pageNiche,
      };
    }
    filter.status = PageStatus.APPROVED;

    let pages = await Page.findAll({
      where: { profilePercentage: { [Op.gte]: 70 } },
      order: [orderby],
      attributes: [
        "id",
        "userId",
        "accountName",
        "userName",
        "intrest",
        "ageOfAudience",
        "postUrl",
        "profileUrl",
        "targetLocation",
        "insightImage",
        "pageNiche",
        ["status", "verification"],
        "engagement",
        "reach",
        "follower",
        "createdAt",
        "level",
        "rating",
        "profileImage",
        "profilePercentage",
      ],
      include: [
        {
          model: PageDetail,
          where: {
            shortDescription: {
              [Op.ne]: null,
            },
          },
          required: true,
        },
        {
          model: AdsType,
          ...budgetFilter,
        },
      ],
      limit: limit,
      offset: offset,
    });

    return respHandler.success(res, {
      status: true,
      msg: "Filter successfully!!",
      data: pages,
    });
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const GetCreaterProfile = async (req, res) => {
  try {
    const { pageId } = req.params;
    const profile = await Page.findByPk(pageId, {
      attributes: [
        "id",
        "userId",
        "accountName",
        "userName",
        "intrest",
        "ageOfAudience",
        "postUrl",
        "profileUrl",
        "targetLocation",
        "insightImage",
        "pageNiche",
        ["status", "verification"],
        "engagement",
        "reach",
        "follower",
        "createdAt",
        "level",
        "rating",
        "profileImage",
        "profilePercentage",
      ],
      include: [
        {
          model: User,
          attributes: ["id", "userType", "name", "mnumber", "email", "amount"],
        },
        {
          model: PageDetail,
        },
        {
          model: AdsType,
          attributes: [
            "id",
            "socialMediaType",
            "type",
            "title",
            "description",
            "price",
          ],
        },
        {
          model: PageFAQ,
          attributes: ["id", "title", "description"],
        },
      ],
    });
    if (!profile) {
      return respHandler.error(res, {
        status: false,
        msg: "no data found",
        error: [],
      });
    }
    if (profile) {
      return respHandler.success(res, {
        status: true,
        msg: "Creator profile listed successfully!!",
        data: [profile],
      });
    }
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something went wrong!!",
      error: [err.message],
    });
  }
};

module.exports = {
  AddPage,
  UpdatePage,
  DeletePage,
  GetPages,
  GetFaq,
  AddFAQ,
  UpdateFAQ,
  DeleteFAQ,
  GetAdsType,
  AddAdsType,
  UpdateAdsType,
  DeleteAdsType,
  ApproveOrRejectPage,
  UpdatePageInsight,
  FilterPage,
  GetCreaterProfile,
};
