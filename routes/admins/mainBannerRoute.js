const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/authController");
const mainBannerController = require("../../controllers/adminController/mainBannerController");
const { mainBannerMidelwear } = require("../../utils/multerUploadMiddleware");

router.get("/get-main-banner", mainBannerController.getMainBanner);
router.use(
  AuthController.protect,
  AuthController.restricTO("user", "superAdmin")
);

router.post(
  "/publish-banner",
  mainBannerMidelwear,
  mainBannerController.publishBanner
);

module.exports = router;
