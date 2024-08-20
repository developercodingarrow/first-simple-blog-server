const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Please provide a reply"],
    },
    replyBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const blogCommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Please provide a comment"],
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blogs",
      required: true,
    },
    commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    replies: [replySchema], // Embedding replySchema to handle replies
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

blogCommentSchema.virtual("parentCommentInfo", {
  ref: "BlogComments",
  foreignField: "_id",
  localField: "parentComment",
});

blogCommentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "blog",
    select: "title",
  })
    .populate({
      path: "commentBy",
      select: "name",
    })
    .populate({
      path: "replies",
      populate: { path: "replyBy", select: "name" }, // Populate 'replies.replyBy' with user's 'name'
    })
    .populate({
      path: "replies",
      populate: { path: "commentBy", select: "name" }, // Populate 'replies.commentBy' with user's 'name'
    });
  next();
});

const Comments = mongoose.model("BlogComments", blogCommentSchema);

module.exports = Comments;
