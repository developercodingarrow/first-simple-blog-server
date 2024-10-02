const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Comments = require("../models/blogcommentModel");
const Factory = require("../utils/handlerFactory");
// CREATE COMMENT ON BLOG
exports.createComment = catchAsync(async (req, res, next) => {
  const { comment, blog } = req.body;
  const newComment = await Comments.create({
    comment,
    blog,
    commentBy: req.user,
  });
  res.status(200).json({
    status: "Success",
    newComment,
  });
});

exports.replyCooment = catchAsync(async (req, res, next) => {
  const { commentId, comment } = req.body;
  const replyBy = req.user;

  const commentToUpdate = await Comments.findById(commentId);

  if (!commentToUpdate) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  // Add the new reply to the comment
  commentToUpdate.replies.push({ comment, replyBy });

  // Save the updated comment
  await commentToUpdate.save();

  res.status(200).json({
    status: "Success",
    commentToUpdate,
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.body; // Get the comment ID from the URL parameters

  // Find and delete the comment
  const result = await Comments.findByIdAndDelete(commentId);

  if (!result) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  res.status(200).json({
    status: "success",
    message: "Comment deleted successfully",
  });
});

// Delete Comment Reply API
exports.deleteCommentReply = catchAsync(async (req, res, next) => {
  const { commentId, replyId } = req.body; // Get the comment ID and reply ID from the Body

  // Find the comment
  const commentToUpdate = await Comments.findById(commentId);

  if (!commentToUpdate) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  // Remove the reply
  const replyIndex = commentToUpdate.replies.findIndex(
    (reply) => reply._id.toString() === replyId
  );

  if (replyIndex === -1) {
    return res.status(404).json({ success: false, message: "Reply not found" });
  }

  // Remove the reply from the array
  commentToUpdate.replies.splice(replyIndex, 1);

  // Save the updated comment
  await commentToUpdate.save();

  res.status(200).json({
    status: "Success",
    message: "Reply deleted successfully",
  });
});

// Refactor
exports.getAllComments = Factory.getAll(Comments);
