const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { userImgMidelwear } = require("../utils/multerUploadMiddleware");

router.get("/user-details/:slug", userController.userDetail);
router.get("/user-blogs/:slug", userController.userPublishedBlogs);

router.use(
  AuthController.protect,
  AuthController.restricTO("user", "superAdmin")
);

router.post("/update-user-profile", userController.updateUserProfile);
router.patch(
  "/update-user-profile-pic",
  userImgMidelwear,
  userController.updateUserImg
);



module.exports = router;
