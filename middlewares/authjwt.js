const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");
const User = require("../models/userSchema");
const constants = require("../utils/constants");
const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "NO token provided ! Access prohibited",
    });
  }
  jwt.verify(token, authConfig.secret, async (err, decoded) => {
    if (err) {
      await User.findOneAndUpdate(
        { userId: req.userId },
        { userStatus: constants.userStatus.inActive }
      );
      return res.status(401).send({
        message: "UnAuthorized",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  const user = await User.findOne({ userId: req.userId });
  if (user && user.userType == constants.userTypes.admin) {
    next();
  } else {
    res.status(400).send({
      message: "Only Admin users are able to access these end point",
    });
  }
};

const isAdminOrUser = async (req, res, next) => {
  const curUser = await User.findOne({ userId: req.userId });
  const user = await User.findOne({ userId: req.params.id });
  console.log(user);
  if (
    user &&
    (curUser.userType == constants.userTypes.admin ||
      user.userId == curUser.userId)
  ) {
    next();
  } else {
    res.status(400).send({
      message: "Only Admin or Same User are able to access these end point",
    });
  }
};

const isCuruserisAdminOrUser = async (req, res, next) => {
  const curUser = await User.findOne({ userId: req.userId });

  if (
    curUser.userType == constants.userTypes.admin ||
    curUser.userType == constants.userTypes.user
  ) {
    next();
  } else {
    res.status(400).send({
      message: "Only Admin or  User are able to access these end point",
    });
  }
};

const isValidUserIdInRequestParam = async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.params.id });

    if (!user) {
      return res.status(400).send({
        message: "UserId passed doesn't exist",
      });
    }
    next();
  } catch (err) {
    console.log("Error while reading the user info", err.message);
    return res.status(500).send({
      message: "Some Internal server error",
    });
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isValidUserIdInRequestParam: isValidUserIdInRequestParam,
  isAdminOrUser: isAdminOrUser,
  isCuruserisAdminOrUser: isCuruserisAdminOrUser,
};

module.exports = authJwt;
