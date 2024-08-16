const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/authController");
const blogDeatilsController = require("../../controllers/adminController/blogDeatilsController");

router.use(AuthController.protect, AuthController.restricTO("superAdmin"));

router.get("/all-blogs", blogDeatilsController.allBlogs);

module.exports = router;
