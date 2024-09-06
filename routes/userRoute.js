const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { userImgMidelwear } = require("../utils/multerUploadMiddleware");

router.use(
  AuthController.protect,
  AuthController.restricTO("user", "superAdmin")
);
router.get("/my-details-users/:slug", userController.userDetail);
router.post("/update-user-profile", userController.updateUserProfile);
router.patch(
  "/update-user-profile-pic",
  userImgMidelwear,
  userController.updateUserImg
);

module.exports = router;
