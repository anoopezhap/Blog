const express = require("express");
const verifyToken = require("../utils/verifyToken");
const postController = require("./../controllers/post.controller");

const router = express.Router();

router.post("/create", verifyToken, postController.create);
router.get("/getPosts", postController.getPosts);

module.exports = router;
