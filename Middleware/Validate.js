const { check, body } = require("express-validator");
const { Validate } = require("./Validation");
const joi = require("joi");

const Validation = async (req, res, next) => {
  const schema = joi.object().keys({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    wnumber: joi.string().max(12).min(10).required().messages({
      "any.required": "wnumber field is required",
      "any.min": "wnumber min length must be 10 ",
      "any.max": "wnumber max length must be 12 ",
    }),
  });
  await Validate(req, res, next, schema);
};

const ValidateName = async (req, res, next) => {
  const schema = joi.object().keys({
    name: joi.string().required(),
    name: joi
      .string()
      .trim()
      .max(20)
      .required()
      .messages({ "any.max": "name's maximum length is 20 character." }),
  });
  await Validate(req, res, next, schema);
};

const LoginValidation = async (req, res, next) => {
  const schema = joi.object().keys({
    wnumber: joi.string().max(12).min(10).required().messages({
      "any.required": "wnumber field is required",
      "any.min": "wnumber min length must be 10 ",
      "any.max": "wnumber max length must be 12 ",
    }),
    password: joi.string().min(6).required(),
  });
  await Validate(req, res, next, schema);
};

const Addaccountdata = async (req, res, next) => {
  const schema = joi.object().keys({
    name: joi
      .string()
      .required()
      .messages({ "any.required": "Please enter your account name" }),
    category_id: joi
      .string()
      .required()
      .messages({ "any.required": "Please select any category" }),
    post_type: joi
      .string()
      .required()
      .messages({ "any.required": "Please select you post type" }),
  });
  await Validate(req, res, next, schema);
};

const AddPageValidation = async (req, res, next) => {
  const schema = joi.object().keys({
    accountName: joi
      .string()
      .required()
      .messages({ "any.required": "Account name is required" }),
    userName: joi
      .string()
      .required()
      .messages({ "any.required": "username is required" }),
    intrest: joi
      .string()
      .required()
      .messages({ "any.required": "Please select intrest" }),
    ageOfAudience: joi
      .string()
      .required()
      .messages({ "any.required": "ageOfAudience is required" }),
    profileLink: joi
      .string()
      .required()
      .messages({ "any.required": "profileLink is required" }),
    targetLocation: joi
      .string()
      .required()
      .messages({ "any.required": "targetLocation is required" }),
    pageNiche: joi
      .string()
      .required()
      .messages({ "any.required": "Please select pageNiche" }),
  });
  await Validate(req, res, next, schema);
};

const AddPageFAQValidation = async (req, res, next) => {
  const schema = joi.object().keys({
    pageId: joi
      .number()
      .integer()
      .required()
      .messages({ "any.required": "PageId is required" }),
    title: joi
      .string()
      .required()
      .messages({ "any.required": "title is required" }),
    description: joi
      .string()
      .required()
      .messages({ "any.required": "Description is required" }),
  });
  await Validate(req, res, next, schema);
};

//type means post,reel and story
const AddAdsTypeValidation = async (req, res, next) => {
  const schema = joi.object().keys({
    pageId: joi
      .number()
      .integer()
      .required()
      .messages({ "any.required": "PageId is required" }),
    title: joi
      .string()
      .required()
      .messages({ "any.required": "title is required" }),
    description: joi
      .string()
      .required()
      .messages({ "any.required": "Description is required" }),
    price: joi
      .number()
      .integer()
      .required()
      .messages({ "any.required": "price is required" }),
    type: joi
      .string()
      .required()
      .messages({ "any.required": "type is required" }),
  });
  await Validate(req, res, next, schema);
};

const UpdatePageValidation = async (req, res, next) => {
  const schema = joi.object().keys({
    follower: joi
      .number()
      .integer()
      .required()
      .messages({ "any.required": "follower is required" }),
    reach: joi
      .number()
      .integer()
      .required()
      .messages({ "any.required": "reach is required" }),
    engagement: joi
      .number()
      .integer()
      .required()
      .messages({ "any.required": "engagement is required" }),
  });
  await Validate(req, res, next, schema);
};

const ResendOtpValidation = async (req, res, next) => {
  const schema = joi.object().keys({
    wnumber: joi.string().max(12).min(10).required().messages({
      "any.required": "wnumber field is required",
      "any.min": "wnumber min length must be 10 ",
      "any.max": "wnumber max length must be 12 ",
    }),
  });
  await Validate(req, res, next, schema);
};

const AddOrderValidation = async (req, res, next) => {
  const schema = joi.object().keys({
    pageId: joi
      .string()
      .required()
      .messages({ "any.required": "pageId is required" }),
    creatorUserId: joi
      .string()
      .required()
      .messages({ "any.required": "creatorUserId is required" }),
    adsTypeId: joi
      .string()
      .required()
      .messages({ "any.required": "adsTypeId is required" }),
    companyName: joi
      .string()
      .required()
      .messages({ "any.required": "companyName is required" }),
    productName: joi
      .string()
      .required()
      .messages({ "any.required": "productName is required" }),
    description: joi
      .string()
      .required()
      .messages({ "any.required": "description is required" }),
    videoUrl: joi.string().messages({ "any.required": "videoUrl is required" }),
    specificDate: joi
      .date()
      .required()
      .messages({ "any.required": "specificDate is required" }),
    sendProduct: joi
      .boolean()
      .required()
      .messages({ "any.required": "sendProduct is required" }),
  });
  await Validate(req, res, next, schema);
};

const BillingDetailValidation = async (req, res, next) => {
  const schema = joi.object().keys({
    companyName: joi
      .string()
      .required()
      .messages({ "any.required": "companyName is required" }),
    fullName: joi
      .string()
      .required()
      .messages({ "any.required": "fullName is required" }),
    addressLine1: joi
      .string()
      .required()
      .messages({ "any.required": "addressLine1 is required" }),
    addressLine2: joi
      .string()
      .required()
      .messages({ "any.required": "addressLine2 is required" }),
    city: joi
      .string()
      .required()
      .messages({ "any.required": "city is required" }),
    postalCode: joi
      .string()
      .required()
      .messages({ "any.required": "postalCode is required" }),
    email: joi
      .string()
      .required()
      .messages({ "any.required": "email is required" }),
    phoneNo: joi
      .string()
      .required()
      .messages({ "any.required": "phoneNo is required" }),
    additionalInformation: joi
      .string()
      .messages({ "any.required": "additionalInformation is required" }),
    type: joi
      .string()
      .required()
      .valid("promotion", "trade")
      .messages({ "any.required": "type is required" }),
    paymentGateway: joi
      .string()
      .required()
      .valid("payu", "paypal")
      .messages({ "any.required": "paymentGateway is required" }),
    orderId: joi
      .string()
      .required()
      .messages({ "any.required": "orderId is required" }),
  });
  await Validate(req, res, next, schema);
};

const AddOrderReviewValidation = async (req, res, next) => {
  const schema = joi.object().keys({
    orderId: joi
      .string()
      .required()
      .messages({ "any.required": "orderId is required" }),
    engagementRate: joi
      .number()
      .integer()
      .max(5)
      .required()
      .messages({ "any.required": "engagementRate is required" }),
    leadResponseRating: joi
      .number()
      .integer()
      .max(5)
      .required()
      .messages({ "any.required": "leadResponseRating is required" }),
    targetAudienceRating: joi
      .number()
      .integer()
      .max(5)
      .required()
      .messages({ "any.required": "targetAudienceRating is required" }),
    description: joi
      .string()
      .required()
      .messages({ "any.required": "description is required" }),
  });
  await Validate(req, res, next, schema);
};

const AddTradeValidation = async (req, res, next) => {
  const schema = joi.object().keys({
    price: joi
      .number()
      .integer()
      .required()
      .messages({ "any.required": "Price is required" }),
    type: joi
      .string()
      .valid("sell")
      .required()
      .messages({ "any.required": "Type is required" }),
    follower: joi
      .string()
      .required()
      .messages({ "any.required": "Follower is required" }),
    userName: joi
      .string()
      .required()
      .messages({ "any.required": "UserName is required" }),
    pageName: joi
      .string()
      .required()
      .messages({ "any.required": "pageName is required" }),
    averageLike: joi
      .number()
      .integer()
      .required()
      .messages({ "any.required": "averageLike is required" }),
    engagement: joi
      .number()
      .integer()
      .required()
      .messages({ "any.required": "engagement is required" }),
    description: joi
      .string()
      .required()
      .messages({ "any.required": "description is required" }),
    category: joi
      .string()
      .required()
      .messages({ "any.required": "category is required" }),
    isearning: joi
      .boolean()
      .required()
      .messages({ "any.required": "isearning is required" }),
  });
  await Validate(req, res, next, schema);
};

const UpdateTradeAccountStatusValidation = async (req, res, next) => {
  const schema = joi.object().keys({
    status: joi
      .number()
      .integer()
      .required()
      .valid(1, 2)
      .messages({ "any.required": "status is required" }),
    comment: joi.string().messages({ "any.required": "comment is required" }),
  });
  await Validate(req, res, next, schema);
};

const AddSellOrderValidation = async (req, res, next) => {
  const schema = joi.object().keys({
    sellerUserId: joi
      .number()
      .integer()
      .required()
      .messages({ "any.required": "sellerUserId is required" }),
    accountId: joi
      .number()
      .integer()
      .required()
      .messages({ "any.required": "accountId is required" }),
  });
  await Validate(req, res, next, schema);
};

const UpdateSellOrderValidation = async (req, res, next) => {
  const schema = joi.object().keys({
    accountUserName: joi
      .string()
      .required()
      .messages({ "any.required": "accountUserName is required" }),
    accountPassword: joi
      .string()
      .required()
      .messages({ "any.required": "accountPassword is required" }),
  });
  await Validate(req, res, next, schema);
};

const VerifyAccountLoginCredentialValidation = async (req, res, next) => {
  const schema = joi.object().keys({
    orderStatus: joi
      .number()
      .integer()
      .required()
      .valid(1, 2)
      .messages({ "any.required": "orderStatus is required" }),
  });
  await Validate(req, res, next, schema);
};

const UpdateUserProfileValidation = async (req, res, next) => {
  const schema = joi.object().keys({
    name: joi
      .string()
      .required()
      .messages({ "any.required": "Name is required" }),
    language: joi
      .string()
      .valid("Hindi", "English")
      .messages({ "any.required": "Language is required" }),
    country: joi.string().messages({ "any.required": "Country is required" }),
    DOB: joi.string().messages({ "any.required": "Date of birth is required" }),
    gender: joi
      .string()
      .valid("Male", "Female")
      .messages({ "any.required": "Gender is required" }),
    accountType: joi
      .string()
      .valid("Creator", "Advertiser")
      .messages({ "any.required": "AccountType is required" }),
    description: joi
      .string()
      .messages({ "any.required": "Description is required" }),
    facebookProfileLink: joi
      .string()
      .messages({ "any.required": "Facebook url is required" }),
    twitterProfileLink: joi
      .string()
      .messages({ "any.required": "Twitter url is required" }),
    instagramProfileLink: joi
      .string()
      .messages({ "any.required": "Instagram url is required" }),
  });
  await Validate(req, res, next, schema);
};

module.exports = {
  LoginValidation,
  Validation,
  Addaccountdata,
  ValidateName,
  AddPageValidation,
  AddPageFAQValidation,
  AddAdsTypeValidation,
  UpdatePageValidation,
  ResendOtpValidation,
  AddOrderValidation,
  BillingDetailValidation,
  AddOrderReviewValidation,
  AddTradeValidation,
  UpdateTradeAccountStatusValidation,
  AddSellOrderValidation,
  UpdateSellOrderValidation,
  VerifyAccountLoginCredentialValidation,
  UpdateUserProfileValidation,
};
