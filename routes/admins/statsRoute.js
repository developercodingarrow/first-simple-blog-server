const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/authController");
const statsController = require("../../controllers/adminController/statsController");

// router.use(
//   AuthController.protect,
//   AuthController.restricTO("user", "superAdmin")
// );

router.get("/web-stats", statsController.webDataStats);

module.exports = router;
