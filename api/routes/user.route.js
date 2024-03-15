const express = require("express");
const userController = require("../controllers/user.controller");
const verifyToken = require("../utils/verifyToken");
const { verify } = require("jsonwebtoken");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Api is working" });
});

router.put("/update/:userId", verifyToken, userController.updateUser);
router.delete("/delete/:userId", verifyToken, userController.deleteUser);
router.post("/signout", userController.signout);
router.get("/getusers", verifyToken, userController.getUsers);
router.get("/:userId", userController.getCommentUsers);

module.exports = router;
