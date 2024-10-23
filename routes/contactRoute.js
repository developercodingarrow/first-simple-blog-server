const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const AuthController = require("../controllers/authController");
// Send contact Enquirey
router.post("/send-contact-info", contactController.contactEnquiremail);

router.use(
  AuthController.protect,
  AuthController.restricTO("user", "superAdmin")
);
router.get("/get-contact-enqure-list", contactController.getAllContactList);

module.exports = router;
