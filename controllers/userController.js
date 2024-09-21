const User = require("../models/userModel");
const Factory = require("../utils/handlerFactory");

// User Details
exports.userDetail = Factory.userDeatils(User);
exports.updateUserProfile = Factory.updateOneByFillterdFiled(User, [
  "name",
  "userName",
  "bio",
  "businessWebsite",
  "facebook",
  "twitter",
  "instagram",
]);
exports.updateUserImg = Factory.uplodsingleImg(User, "userImg");
