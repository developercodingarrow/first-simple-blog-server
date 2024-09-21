const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const tagController = require("../controllers/tagController");

// ALL TAGS
router.get("/all-tags", tagController.getAllTags);
router.get("/featured-tags", tagController.getFeaturedTags);
router.get("/verified-tags", tagController.getFeaturedverifiedTags);

router.use(
  AuthController.protect,
  AuthController.restricTO("user", "superAdmin")
);

router.post("/create-tag", tagController.createTag);
router.post("/tag-vrification", tagController.tagverfification);
router.post("/tag-featured", tagController.tagFeatured);
router.delete("/delete-single-tag", tagController.deleteTag);

module.exports = router;
