const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const blogController = require("../controllers/blogController");
const { blogThumblinMidelwear } = require("../utils/multerUploadMiddleware");

router.use(
  AuthController.protect,
  AuthController.restricTO("user", "superAdmin")
);
// GET SINGLE BLOG BY ID
router.get("/get-single-blog/:slug", blogController.getSingleDataByParamID);

router.post(
  "/create-blog",
  blogThumblinMidelwear,
  blogController.createBlogWithImg
);

router.post("/update-blog-tags/:_id", blogController.updateBlogTag);

router.patch(
  "/update-blog-thumblin/:_id",
  blogThumblinMidelwear,
  blogController.updateBlogThumblin
);

router.delete("/delete-blog-thumblin/:id", blogController.deleteBlogThumblin);

module.exports = router;
