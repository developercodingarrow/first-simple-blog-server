const User = require("../models/userModel");
const Factory = require("../utils/handlerFactory");

// User Details
exports.userDetail = Factory.getOneByID(User);
exports.updateUserProfile = Factory.updateOneByBody(User);
