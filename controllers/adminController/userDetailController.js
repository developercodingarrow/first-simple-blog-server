const User = require("../../models/userModel");
const catchAsync = require("../../utils/catchAsync");
const Factory = require("../../utils/handlerFactory");

// 1) GET ALL Users
exports.allUsers = catchAsync(async (req, res, next) => {
  const user = await User.find({ role: "user" });

  res.status(200).json({
    status: "success",
    total: user.length,
    result: user,
  });
});

exports.userDetail = Factory.userDeatils(User);
