const User = require("../models/userModel");
const Factory = require("../utils/handlerFactory");
const Blogs = require("../models/blogModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// CREATE BLOG WITH IMAGE
exports.createBlogWithImg = Factory.createOneWithImg(Blogs, "blogThumblin");

exports.createBlog = catchAsync(async (req, res, next) => {
  const userId = req.user._id; // Assuming the user is authenticated and `req.user` holds the user data

  // Create a new blog instance with default values
  const newBlog = await Blogs.create({
    user: userId,
    blogTitle: "Untitled Blog", // Default title
    metaDescription: "", // Default empty string for metaDescription
    blogDescreption: "",
  });

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

  // Save the updated blog, which will trigger the pre('save') hook to update the slug if necessary
  await blog.save();

  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

// ALL BLOGS
exports.allBlogs = Factory.getAll(Blogs);

// UPDATE BLOG THUMBLIN
exports.updateBlogThumblin = Factory.updateImageByIdAndField(
  Blogs,
  "blogThumblin"
);

// GET SINGLE DATA BY PARAM ID
exports.getSingleDataByParamID = Factory.getOneByID(Blogs);

exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blogs.findOne({ slug: req.params.slug })
      .populate({
        path: "comments",
        select: "comment blog ",
      })
      .exec();

    await Blogs.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { viewCount: 1 } }, // Increment viewCount by 1
      { new: true } // Return the updated document
    );
    res.status(200).json({
      status: "success",
      result: blog,
    });
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleBlogforUpdate = async (req, res) => {
  const { blogId } = req.params;
  try {
    const blog = await Blogs.findById(blogId);

    res.status(200).json({
      status: "success",
      result: blog,
    });
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ message: error.message });
  }
};

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
  await blog.save();

  res.status(200).json({
    status: "success",
    data: {
      likeCount: blog.likes.length,
    },
  });
});

//
exports.getAlPublishedlBlogsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all blogs where the user field matches the provided user ID
    const blogs = await Blogs.find({ user: req.user._id, status: "published" });

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No blogs found for this user",
      });
    }

    res.status(200).json({
      success: true,
      count: blogs.length,
      status: "success",
      result: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs by user:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getAllDraftBlogsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all blogs where the user field matches the provided user ID
    const blogs = await Blogs.find({ user: req.user._id, status: "draft" });

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No blogs found for this user",
      });
    }

    res.status(200).json({
      success: true,
      count: blogs.length,
      status: "success",
      result: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs by user:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.updateBlogToDraft = async (req, res) => {
  try {
    const blogId = req.body.blogId;

    // Find the blog by its ID
    const blog = await Blogs.findById(blogId);

    // If blog not found, return a 404 response
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Update the blog status to "draft"
    blog.status = "draft";

    // Save the updated blog
    await blog.save();

    // Return a success response
    res.status(200).json({
      success: true,
      message: "Blog status updated to draft",
      data: blog,
    });
  } catch (error) {
    console.error("Error updating blog status to draft:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.updateBlogToPublished = async (req, res) => {
  try {
    const blogId = req.body.blogId;

    // Find the blog by its ID
    const blog = await Blogs.findById(blogId);

    // If blog not found, return a 404 response
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Update the blog status to "draft"
    blog.status = "published";

    // Save the updated blog
    await blog.save();

    // Return a success response
    res.status(200).json({
      success: true,
      message: "Blog status updated to draft",
      data: blog,
    });
  } catch (error) {
    console.error("Error updating blog status to draft:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.deleteBlogById = async (req, res) => {
  try {
    const blogId = req.body.blogId;

    // Ensure a blog ID is provided
    if (!blogId) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    // Find the blog by ID and delete it
    const deletedBlog = await Blogs.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res
      .status(200)
      .json({ status: "success", message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
