const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/authController");
const blogDeatilsController = require("../../controllers/adminController/blogDeatilsController");

router.use(AuthController.protect, AuthController.restricTO("superAdmin"));

router.get("/all-blogs", blogDeatilsController.allBlogs);
router.post("/blog-featured-toggle", blogDeatilsController.togglefeaturedBlog);
router.get("/get-repoted-blogs", blogDeatilsController.getReportedBlogs);
router.delete(
  "/delete-suspended-blog",
  blogDeatilsController.deleteSuspendedBlogById
);

router.patch("/blog-report-action", blogDeatilsController.blogReviewAction);
module.exports = router;
