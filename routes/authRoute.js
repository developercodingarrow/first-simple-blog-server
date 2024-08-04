const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

router.post("/sing-up", AuthController.userRegisteraion);

module.exports = router;
