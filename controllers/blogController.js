const User = require("../models/userModel");
const Factory = require("../utils/handlerFactory");
const Blogs = require("../models/blogModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// CREATE BLOG WITH IMAGE
exports.createBlogWithImg = Factory.createOneWithImg(Blogs, "blogThumblin");
exports.allBlogs = Factory.getAll(Blogs);

exports.updateBlogThumblin = Factory.updateImageByIdAndField(
  Blogs,
  "blogThumblin"
);

// GET SINGLE DATA BY PARAM ID
exports.getSingleDataByParamID = Factory.getOneByID(Blogs);

exports.deleteBlogThumblin = Factory.deleteSingleImage(
  Blogs,
  "blogThumblin",
  "blogthumblin"
);

exports.updateBlogTag = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  console.log(req.body);
  const { tagName } = req.body;

  const blog = await Blogs.findById(_id);

  if (!blog) {
    return next(new AppError("Blog post not found"));
  }

  if (!Array.isArray(tagName)) {
    return next(new AppError("tagName must be an array"));
  }

  const existingTags = blog.blogTags.map((tag) => tag.tagName);

  const newTags = [];

  for (let name of tagName) {
    if (!existingTags.includes(name)) {
      newTags.push(name);
    }
  }

  newTags.forEach((name) => {
    blog.blogTags.push({ tagName: name });
  });

  await blog.save();

  res.status(200).json({
    status: "success",
    result: blog,
  });
});
