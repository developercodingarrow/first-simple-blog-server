const User = require("../models/userModel");
const Factory = require("../utils/handlerFactory");

// User Details
exports.userDetail = Factory.userDeatils(User);
exports.updateUserProfile = Factory.updateOneByBody(User);
exports.updateUserImg = Factory.uplodsingleImg(User, "userImg");
