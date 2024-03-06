const express = require("express");
const userController = require("../controllers/user.controller");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Api is working" });
});

router.put("/update/:userId", verifyToken, userController.updateUser);

module.exports = router;
