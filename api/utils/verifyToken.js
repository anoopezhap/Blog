const jwt = require("jsonwebtoken");
const errorHandler = require("./error");

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  //console.log("tokem", token);

  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "unauthorized"));
    }

    req.user = user;
    next();
  });
};

module.exports = verifyToken;
