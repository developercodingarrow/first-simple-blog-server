const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/authController");
const sideBannerController = require("../../controllers/adminController/sideBannerController");
const { sideBannerMidelwear } = require("../../utils/multerUploadMiddleware");

router.get("/get-side-banner", sideBannerController.getSideBanner);
router.use(
  AuthController.protect,
  AuthController.restricTO("user", "superAdmin")
);

router.post(
  "/publish-side-banner",
  sideBannerMidelwear,
  sideBannerController.publishSideBanner
);

router.patch("/update-side-banner-url", sideBannerController.updateBannerUrl);

module.exports = router;
