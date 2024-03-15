const User = require("../models/user.model");
const errorHandler = require("../utils/error");
const bcryptjs = require("bcryptjs");

const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be atleast 6 characters"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 and 20 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username must not contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be in lower case"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
  }

  try {
    const upsatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );

    const { password, ...rest } = upsatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "you are not authorized to delete this account")
    );
  }

  console.log("userid", req.params);

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    next(error);
  }
};

const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token", {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: "None", //cross-site cookie
      })
      .status(200)
      .json({ message: "user have been signed out" });
  } catch (error) {
    next(errorHandler(error));
  }
};

const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to access all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res
      .status(200)
      .json({ users: usersWithoutPassword, totalUsers, lastMonthUsers });
  } catch (error) {
    next(error);
  }
};

const getCommentUsers = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "user not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    return next(error);
  }
};

module.exports = { updateUser, deleteUser, signout, getUsers, getCommentUsers };
