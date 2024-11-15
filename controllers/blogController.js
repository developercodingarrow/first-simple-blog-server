const User = require("../models/userModel");
const Factory = require("../utils/handlerFactory");
const Blogs = require("../models/blogModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// CREATE BLOG WITH IMAGE this Api Doesn't use
exports.createBlogWithImg = Factory.createOneWithImg(Blogs, "blogThumblin");

// ALL BLOGS
exports.allBlogs = Factory.getAll(Blogs);

// UPDATE BLOG THUMBLIN
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
    message: "Update Your Tags Successfully",
    result: blog,
  });
});

// Re Factor Code step by step
// 1) GET BLOG BY TAG AND SORT BY VARIOUS FIELDS :-

exports.createBlog = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  // Create a new blog instance with default values
  if (!userId) {
    return next(new AppError("Your are not logIn Please login to acces"), 401);
  }
  const newBlog = await Blogs.create({
    user: userId,
    blogTitle: "Untitled Blog", // Default title
    metaDescription: "", // Default empty string for metaDescription
    blogDescreption: "",
    status: "draft",
  });

  // Step 2: Update the user by adding the blog ID to the user's blogs array
  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { blogs: newBlog._id } }, // Push the new blog ID to the user's blogs array
    { new: true, useFindAndModify: false }
  );

  res.status(201).json({
    status: "success",
    result: newBlog,
  });
});

exports.updateBlogContent = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;
  const { blogTitle, metaDescription, blogDescreption } = req.body;

  // Find the blog by ID
  const blog = await Blogs.findById(blogId);

  if (!blog) {
    return res.status(404).json({
      status: "fail",
      message: "Blog not found",
    });
  }

  // Update the relevant fields
  blog.blogTitle = blogTitle || blog.blogTitle;
  blog.metaDescription = metaDescription || blog.metaDescription;
  blog.blogDescreption = blogDescreption || blog.blogDescreption;
  blog.status = "published";

  // Save the updated blog, which will trigger the pre('save') hook to update the slug if necessary
  await blog.save();

  res.status(200).json({
    status: "success",
    message: "Update your content successfully",
    result: blog,
  });
});

exports.getSingleBlogforUpdate = Factory.getOneByID(Blogs);

// API to like a blog post
exports.likeBlog = catchAsync(async (req, res, next) => {
  const { blogId } = req.body; // Get blogId from the request body
  const userId = req.user._id;

  const blog = await Blogs.findById(blogId);

  if (!blog) {
    return res.status(404).json({ status: "fail", message: "Blog not found" });
  }

  if (blog.likes.includes(userId)) {
    return res.status(400).json({ status: "fail", message: "Already liked" });
  }

  blog.likes.push(userId);
  blog.rankingPoint = blog.viewCount + blog.likes.length * 10; // Update rankingPoint
  await blog.save();

  res.status(200).json({
    status: "success",
    data: {
      likeCount: blog.likes.length,
    },
  });
});

// API to unlike a blog post
exports.unlikeBlog = catchAsync(async (req, res, next) => {
  const { blogId } = req.body; // Get blogId from the request body
  const userId = req.user._id;

  const blog = await Blogs.findById(blogId);

  if (!blog) {
    return res.status(404).json({ status: "fail", message: "Blog not found" });
  }

  if (!blog.likes.includes(userId)) {
    return res.status(400).json({ status: "fail", message: "Not liked yet" });
  }

  blog.likes = blog.likes.filter((id) => !id.equals(userId));
  blog.rankingPoint = blog.viewCount + blog.likes.length * 10; // Update rankingPoint
  await blog.save();

  res.status(200).json({
    status: "success",
    data: {
      likeCount: blog.likes.length,
    },
  });
});

// USER PUBLISHED BLOGS
exports.getAlPublishedlBlogsByUser = Factory.getByUserAndModelStatus(
  Blogs,
  "published"
);

exports.getAllDraftBlogsByUser = Factory.getByUserAndModelStatus(
  Blogs,
  "draft"
);

exports.updateBlogToDraft = Factory.updateStatus(Blogs, "draft");
exports.updateBlogToPublished = Factory.updateStatus(Blogs, "published");

exports.deleteBlogById = Factory.deleteOneByBody(Blogs);

// SSR API FOR FILLTERED BLOGD
exports.getFilteredBlogs = async (req, res) => {
  try {
    const tag = req.query.tag;
    const pagelimit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * pagelimit;

    // Build the filter object based on the provided tag
    const filter = {
      status: "published",
      reportContent: "no-action",
    };

    if (tag) {
      filter["blogTags.tagSlug"] = tag;
    }

    const blogs = await Blogs.find(filter)
      .populate({
        path: "comments",
        select: "comment blog ",
      })
      .populate({
        path: "user",
        select: "name userName userImg",
      })
      .sort([
        ["featured", -1],
        ["rankingPoint", -1],
      ])
      .exec();

    res.status(200).json({
      status: "success",
      total: blogs.length,
      result: blogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SSR API FOR SINGLR BLOG
exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blogs.findOne({ slug: req.params.slug })
      .populate({
        path: "comments",
        select: "comment blog ",
      })
      .populate({
        path: "user", // Populate the user who created the blog
        select: "name userName userImg", // Selecting specific fields from the User model
      })
      .exec();

    if (!blog) {
      return next(new AppError("There is no Content Found"), 401);
    }

    if (blog) {
      blog.viewCount += 1;
      blog.rankingPoint = blog.viewCount + blog.likes.length * 10;
      await blog.save();
    }
    res.status(200).json({
      status: "success",
      result: blog,
    });
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ message: error.message });
  }
};

exports.getFeaturedblogByTags = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;
  const filter = {
    status: "published",
    "blogTags.tagSlug": slug,
  };

  const blogs = await Blogs.find(filter)
    .populate({
      path: "comments",
      select: "comment blog ",
    })
    .populate({
      path: "user",
      select: "name userName userImg",
    })
    .sort([
      ["featured", -1],
      ["rankingPoint", -1],
    ])
    .exec();

  res.status(200).json({
    status: "success",
    total: blogs.length,
    result: blogs,
  });
});

exports.repotContentAction = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { id, filedContent } = req.body;

  // Find the blog by ID and update it, returning the updated document
  const doc = await Blogs.findByIdAndUpdate(
    id,
    {
      reportAction: filedContent,
      reportedBy: userId,
    },
    { new: true } // This option returns the updated document
  );

  res.status(201).json({
    success: true,
    status: "success",
    message: "Your action has been updated",
    result: doc,
  });
});
