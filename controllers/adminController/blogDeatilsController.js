const Blogs = require("../../models/blogModel");
const Factory = require("../../utils/handlerFactory");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

// 1) GET ALL BLOGS
exports.allBlogs = Factory.getAll(Blogs);
exports.togglefeaturedBlog = Factory.toggleBooleanField(Blogs, "featured");

exports.getReportedBlogs = catchAsync(async (req, res, next) => {
  // Get blogs with reportAction as "Harassment", "Rules Violation", or "Spam" (case-insensitive)
  const doc = await Blogs.find({
    reportAction: { $in: ["Harassment", "Rules Violation", "Spam"] },
  })
    .collation({ locale: "en", strength: 2 }) // Case-insensitive collation
    .populate("reportedBy", "name email"); // Populate the user details who reported

  res.status(200).json({
    status: "success",
    total: doc.length,
    result: doc,
  });
});

exports.deleteSuspendedBlogById = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  // Find the blog by ID and check if its reportContent is "suspension"
  const blog = await Blogs.findById(id);

  // If the blog is not found or reportContent is not "suspension", send an error response
  if (!blog) {
    return res.status(404).json({
      status: "fail",
      message: "Blog not found",
    });
  }

  if (blog.reportContent !== "suspension") {
    return res.status(400).json({
      status: "fail",
      message: "This blog is not marked for suspension",
    });
  }

  // If the blog is found and marked for suspension, delete it
  await Blogs.findByIdAndDelete(id);

  // Send a success response
  res.status(200).json({
    status: "success",
    message: "Blog with 'suspension' reportContent has been deleted",
  });
});

exports.blogReviewAction = catchAsync(async (req, res, next) => {
  const { id, filedContent } = req.body; // Get blog ID and new action from request body

  // Validate the action
  const validActions = ["moderation_review", "no-action", "suspension"];
  if (!validActions.includes(filedContent)) {
    return res.status(400).json({
      status: "fail",
      message:
        "Invalid action. Allowed values are: moderation_review, no-action, suspension.",
    });
  }

  // Find and update the blog
  const updatedBlog = await Blogs.findByIdAndUpdate(
    id,
    { reportContent: filedContent },
    { new: true, runValidators: true } // Return the updated document and run schema validators
  );

  // Handle cases where the blog is not found
  if (!updatedBlog) {
    return res.status(404).json({
      status: "fail",
      message: "Blog not found.",
    });
  }

  // Respond with the updated blog
  res.status(200).json({
    status: "success",
    data: {
      blog: updatedBlog,
    },
  });
});
