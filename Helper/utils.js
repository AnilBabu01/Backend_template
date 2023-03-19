const axios = require("axios");
const { config } = require("dotenv");
const { diskStorage, memoryStorage } = require("multer");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
var cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const hbs = require("nodemailer-express-handlebars");

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

module.exports = {
  uploadFile,
  sendEmail,
};
