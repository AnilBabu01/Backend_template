const respHandler = require("../Handlers");
const User = require("../Models/user.model");
const UserInformation = require("../Models/userInformation.model");

const UpdateUserInfo = async (req, res) => {
  try {
    let userId = req.user.id;
    let {
        language,
        country,
        DOB,
        gender,
        accountType,
        facebookProfileLink,
        description,
        instagramProfileLink,
        twitterProfileLink,
        name,
      } = req.body,
      userInformation = {},
      user = {};

    if (req.files && req.files?.profileImage) {
      userInformation.profileImage = req.files?.profileImage[0].path;
    }
    userInformation.userId = userId;
    userInformation.language = language ? language : "";
    userInformation.country = country ? country : "";
    if (DOB) userInformation.DOB = DOB;
    userInformation.gender = gender ? gender : "";
    userInformation.accountType = accountType ? accountType : "";
    userInformation.description = description ? description : "";
    userInformation.facebookProfileLink = facebookProfileLink
      ? facebookProfileLink
      : "";
    userInformation.instagramProfileLink = instagramProfileLink
      ? instagramProfileLink
      : "";
    userInformation.twitterProfileLink = twitterProfileLink
      ? twitterProfileLink
      : "";
    user.name = name;
    await User.update(user,{
      where : {
        id : userId
      }
    });

    let [userInfo,created] = await UserInformation.findOrCreate({
      where: { userId: userId },
      defaults: userInformation,
    });

    if(!created){
      let updated = await UserInformation.update(userInformation,{
        where : {
          userId : userId
        }
      });
      if(!updated[0]){
        return respHandler.error(res,{msg : "Something went wrong!!",status : false});
      }
    }
    return respHandler.success(res,{msg : "Profile updated successfully!!",status : true});

  } catch (err) {
    return respHandler.error(res, {
      msg: "Something went wrong!!",
      status: false,
      error: [err.message],
    });
  }
};

const GetUserInformation = async ( req,res )=>{
  try{
    let userId = req.user.id;
    let userDetails = await User.findOne({
      where : {
        id : userId
      },
      attributes : ["name","mnumber","email"],
      include : [
        {
          model : UserInformation
        }
      ]
    });
    return respHandler.success(res,{msg : "User details listed successfully!!",status : true,data : [userDetails]})
  } catch (err) {
    return respHandler.error(res, {
      msg: "Something went wrong!!",
      status: false,
      error: [err.message],
    });
  }
}

module.exports = {
  UpdateUserInfo,
  GetUserInformation
};
