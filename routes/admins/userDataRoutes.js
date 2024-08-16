const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/authController");
const userDetailController = require("../../controllers/adminController/userDetailController");

// repace user  to superAdmin

router.use(AuthController.protect, AuthController.restricTO("superAdmin"));
router.get("/all-users", userDetailController.allUsers);
module.exports = router;
