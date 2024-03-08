const bcryptjs = require("bcryptjs");
const User = require("./../models/user.model");
const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    //return res.status(400).json({ message: "All fields are required" });
    return next(errorHandler(400, "All fileds are mandatory"));
  }

  const hashedPasssword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPasssword });

  try {
    await newUser.save();
    return res.json({ message: "Signup successfull" });
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    //check if use exists
    if (!validUser) {
      return next(errorHandler(404, "user not found"));
    }

    //check if entered password is valid
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid username or password"));
    }

    //if everything good, assign token

    const accessToken = jwt.sign(
      {
        id: validUser._id,
        isAdmin: validUser.isAdmin,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", accessToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: "None", //cross-site cookie
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.ACCESS_TOKEN_SECRET
      );

      const { password, ...rest } = user._doc;

      res
        .status(200)
        .cookie("access_token", accessToken, {
          httpOnly: true, //accessible only by web server
          secure: true, //https
          sameSite: "None", //cross-site cookie
        })
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPasssword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPasssword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();
      const accessToken = jwt.sign(
        {
          id: newUser._id,
          isAdmin: newUser.isAdmin,
        },
        process.env.ACCESS_TOKEN_SECRET
      );
      const { password, ...rest } = newUser._doc;

      res
        .status(200)
        .cookie("access_token", accessToken, {
          httpOnly: true, //accessible only by web server
          secure: true, //https
          sameSite: "None", //cross-site cookie
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, signin, google };
