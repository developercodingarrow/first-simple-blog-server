const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/authController");
const adminAuthController = require("../../controllers/adminController/adminAuthController");

router.post("/protected-registration", adminAuthController.adminsRegisteraion);

router.post("/protected-login", adminAuthController.adminsLogin);

router.post("/reset-password/", adminAuthController.resetPassword);

module.exports = router;
