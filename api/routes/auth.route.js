const express = require("express");
const router = express.Router();
const authController = require("./../controllers/auth.controller");

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/google", authController.google);
module.exports = router;
