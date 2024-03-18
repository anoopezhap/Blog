const Comment = require("../models/comment.model");
const errorHandler = require("../utils/error");

const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to make this comment")
      );
    }

    const newComment = new Comment({ content, postId, userId });

    await newComment.save();

    res.status(200).json({ newComment });
  } catch (error) {
    next(error);
  }
};

const getPostCommentsById = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ postId }).sort({ createComment: -1 });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      next(errorHandler(404, "Comment not found"));
    }

    const userIndex = comment.likes.indexOf(req.user.id);

    //to add like
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    }
    //to remove like
    else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

module.exports = { createComment, getPostCommentsById, likeComment };
