const User = require("../models/userModel");
const Factory = require("../utils/handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Blogs = require("../models/blogModel");

// User Details
exports.userPublishedBlogs = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  // Fetch blogs by the user's username (case-insensitive)
  const blogs = await Blogs.find({ status: "published" })
    .populate({
      path: "user", // Populate the user field
      match: { userName: { $regex: new RegExp("^" + slug + "$", "i") } }, // Match userName with the slug
    })
    .exec();

  // Filter out any blogs where the user does not match (in case populate returned null)
  const userBlogs = blogs.filter((blog) => blog.user !== null);

  if (userBlogs.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "No blogs found for this user.",
    });
  }

  res.status(200).json({
    status: "success",
    total: userBlogs.length,
    result: userBlogs,
  });
});

exports.userDetail = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const user = await User.findOne({ userName: slug }).select(
    "userImg _id name createdAt updatedAt userName  businessWebsite bio __v facebook twitter instagram"
  );

  if (!user) {
    return next(new AppError("This is not found"), 401);
  }

  res.status(200).json({
    status: "success",
    result: user,
  });
});

// exports.userDetail = Factory.userDeatils(User);
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
