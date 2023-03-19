const axios = require("axios");
const { config } = require("dotenv");
const { diskStorage, memoryStorage } = require("multer");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
var cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const hbs = require("nodemailer-express-handlebars");
const Page = require("../Models/page.model");
const PageDetail = require("../Models/pagedetail.model");
config();
const CLOUD_NAME = process.env.CLOUDINARY_CLOUDNAME;
const API_KEY = process.env.CLOUDINARY_APIKEY;
const SECRETKEY = process.env.CLOUDINARY_SECRETKEY;

const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: SECRETKEY,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "InstaPhantomImages",
  },
});
const uploadFile = multer({ storage: storage });

const sendEmail = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      let { slug, subject, to, body } = data;
      let template = "";
      console.log("slug------------>", slug);
      const transporter = nodemailer.createTransport({
        service: EMAIL_SERVICE,
        auth: {
          user: EMAIL_USERNAME,
          pass: EMAIL_PASSWORD,
        },
      });
      console.log(path.resolve("views"));
      transporter.use(
        "compile",
        hbs({
          viewEngine: {
            partialsDir: path.resolve("./views/"),
            defaultLayout: false,
          },
          viewPath: path.resolve("views"),
        })
      );
      let isSendEmail = false;
      let options = {};
      switch (slug) {
        case "approve-page":
          template = "approve-page";
          options = {
            from: `Instaphantom <${EMAIL_USERNAME}>`,
            to: to,
            subject: subject,
            template: template,
          };
          isSendEmail = true;
          break;
        case "reject-page":
          template = "reject-page";
          options = {
            from: `Instaphantom <${EMAIL_USERNAME}>`,
            to: to,
            subject: subject,
            template,
          };
          isSendEmail = true;
          break;
        default:
          break;
      }
      if (isSendEmail) {
        options.context = body;
        transporter.sendMail(options, function (error, info) {
          if (error) throw Error(error);
          console.log("Email Sent Successfully");
          console.log(info);
        });
        return resolve(true);
      }
      return resolve(false);
    } catch (err) {
      console.log(err);
      return resolve(false);
    }
  });
};

const profileCompletePercentage = async (pageId,pageDetail)=>{
  let array = ["accountName","userName","intrest","ageOfAudience","postUrl","targetLocation","insightImage","pageNiche","profileImage","coverImage","tagline","description","shortDescription","tags","mostLikedImage"];
  let eachColumnPercent = (100 / 19).toFixed(2);
  let data = await Page.findOne({
    where: { id:pageId },
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
      "profileImage",
    ],
    include: [
      {
        model: PageDetail
      },
    ],
  });
  let percentage = 0;
  for (let index = 0; index < array.length; index++) {
    if(((data[array[index]] || pageDetail[array[index]]) || (data.pagedetail[array[index]] || pageDetail.pagedetail[array[index]])) && array[index] != "mostLikedImage"){
      percentage +=1;
    }
    if(array[index] == "mostLikedImage" && (data.pagedetail?.mostLikedImage || pageDetail.pagedetail?.mostLikedImage)){
      percentage += !pageDetail.pagedetail?.mostLikedImage  ? data.pagedetail?.mostLikedImage.length : JSON.parse(pageDetail.pagedetail?.mostLikedImage).length;
    } 
  }
  console.log("profile Percentage ===========>",Math.ceil(percentage * eachColumnPercent));
  console.log("data ===========>",data.dataValues); 
  console.log("pageDetail ===========>",pageDetail);
  return Math.ceil(percentage * eachColumnPercent);
}

module.exports = {
  uploadFile,
  sendEmail,
  profileCompletePercentage
};
