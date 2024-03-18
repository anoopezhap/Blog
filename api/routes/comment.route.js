const express = require("express");
const commentController = require("../controllers/comment.controller");
const verifyToken = require("../utils/verifyToken");

const router = express.Router();

router.post("/create", verifyToken, commentController.createComment);
router.get("/getPostComments/:postId", commentController.getPostCommentsById);
router.put(
  "/likeComment/:commentId",
  verifyToken,
  commentController.likeComment
);
router.put(
  "/editComment/:commentId",
  verifyToken,
  commentController.editComment
);

router.delete(
  "/deleteComment/:commentId",
  verifyToken,
  commentController.deleteComment
);

router.get("/getComments", verifyToken, commentController.getComments);

module.exports = router;
