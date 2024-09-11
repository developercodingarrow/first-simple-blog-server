const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const Blogs = require("../../models/blogModel");
const Tags = require("../../models/tagsModel");
const User = require("../../models/userModel");
const Comments = require("../../models/blogcommentModel");

exports.webDataStats = catchAsync(async (req, res) => {
  const totalBlogs = await Blogs.countDocuments();

  // Total number of published blogs
  const publishedBlogs = await Blogs.countDocuments({ status: "published" });

  // Total number of users
  const totalUsers = await User.countDocuments();

  // Total number of tags
  const totalTags = await Tags.countDocuments();

  // Number of verified tags
  const verifiedTags = await Tags.countDocuments({ Verification: true });

  // Number of featured tags
  const featuredTags = await Tags.countDocuments({ featured: true });

  // Number of featured blogs
  const featuredBlogs = await Blogs.countDocuments({ featured: true });

  // Number of draft blogs
  const draftBlogs = await Blogs.countDocuments({ status: "draft" });

  // Total view count
  const totalViewCount = await Blogs.aggregate([
    { $group: { _id: null, totalViewCount: { $sum: "$viewCount" } } },
  ]);

  // Total number of comments
  const totalComments = await Comments.countDocuments();

  // Total number of replies
  const totalReplies = await Comments.aggregate([
    { $unwind: "$replies" },
    { $count: "totalReplies" },
  ]);

  res.status(201).json({
    status: "success",
    results: {
      totalBlogs,
      publishedBlogs,
      totalUsers,
      totalTags,
      verifiedTags,
      featuredTags,
      featuredBlogs,
      draftBlogs,
      totalViewCount: totalViewCount[0] ? totalViewCount[0].totalViewCount : 0,
      totalComments,
      totalReplies: totalReplies[0] ? totalReplies[0].totalReplies : 0,
    },
  });
});
