const User = require("../../models/userModel");
const Factory = require("../../utils/handlerFactory");

// 1) GET ALL Users
exports.allUsers = Factory.getAll(User);
exports.userDetail = Factory.userDeatils(User);
