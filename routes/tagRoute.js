const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const tagController = require("../controllers/tagController");

// ALL TAGS
router.get("/all-tags", tagController.getAllTags);

router.use(
  AuthController.protect,
  AuthController.restricTO("user", "superAdmin")
);

router.post("/create-tag", tagController.createTag);

module.exports = router;
