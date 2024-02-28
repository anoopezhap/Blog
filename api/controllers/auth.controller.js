const bcryptjs = require("bcryptjs");
const User = require("./../models/user.model");
const errorHandler = require("../utils/error");

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
    res.json({ message: "Signup successfull" });
  } catch (err) {
    next(err);
  }

  await newUser.save();
  res.json({ message: "Signup successfull" });
};

module.exports = { signup };
