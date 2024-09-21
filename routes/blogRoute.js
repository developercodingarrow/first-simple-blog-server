const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const blogController = require("../controllers/blogController");
const { blogThumblinMidelwear } = require("../utils/multerUploadMiddleware");

router.get("/get-blog/:slug", blogController.getSingleBlog);
router.get("/fllterd-tag-blogs", blogController.getFilteredBlogs);

router.use(
  AuthController.protect,
  AuthController.restricTO("user", "superAdmin")
);
// GET SINGLE BLOG BY ID
router.get("/get-single-blog/:slug", blogController.getSingleBlogforUpdate);
router.get("/my-published-blogs", blogController.getAlPublishedlBlogsByUser);
router.get("/my-draft-blogs", blogController.getAllDraftBlogsByUser);

router.post(
  "/create-blog",
  blogThumblinMidelwear,
  blogController.createBlogWithImg
);

router.post("/first-action-create-blog", blogController.createBlog);
router.post("/update-blog-content/:blogId", blogController.updateBlogContent);

router.post("/update-blog-tags/:_id", blogController.updateBlogTag);

router.patch(
  "/update-blog-thumblin/:_id",
  blogThumblinMidelwear,
  blogController.updateBlogThumblin
);

router.post("/update-to-draft", blogController.updateBlogToDraft);
router.post("/update-to-published", blogController.updateBlogToPublished);
router.post("/report-content", blogController.repotContentAction);
router.delete("/delete-blog", blogController.deleteBlogById);

router.delete("/delete-blog-thumblin/:id", blogController.deleteBlogThumblin);

// Refactor Routes
router.post("/like", blogController.likeBlog);
router.post("/unlike", blogController.unlikeBlog);

module.exports = router;
