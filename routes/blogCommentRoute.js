const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const blogCommentController = require("../controllers/blogCommentController");

router.get("/all-comments", blogCommentController.getAllComments);
router.use(
  AuthController.protect,
  AuthController.restricTO("user", "superAdmin")
);

router.post("/create-new-blog-comment", blogCommentController.createComment);
router.post("/comment-reply", blogCommentController.replyCooment);

router.delete("/delete-comments", blogCommentController.deleteComment);

// Route for deleting a reply
router.delete(
  "/delete-comments-reply",
  blogCommentController.deleteCommentReply
);

module.exports = router;
