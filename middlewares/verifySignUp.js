const User = require("../models/userSchema");
const constants = require("../utils/constants");

const isValidEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validateSignUpRequestBody = async (req, res, next) => {
  if (!req.body.userId) {
    return res.status(400).send({
      message: "Failed UserId is not provided",
    });
  } else {
    try {
      const user = await User.findOne({ userId: req.body.userId });
      if (user) {
        return res.status(400).send({
          message: "Failed UserId is already taken",
        });
      }
    } catch (err) {
      console.log("Some Err happend", err.message);
      res.status(500).send({
        message: "Some Internal server error",
      });
    }
  }

  if (!req.body.password) {
    return res.status(400).send({
      message: "Failed Password is not provided",
    });
  }

  if (!req.body.email) {
    return res.status(400).send({
      message: "Failed email is not provided",
    });
  }

  if (!isValidEmail(req.body.email)) {
    return res.status(400).send({
      message: "Failed Not a valid email Id ",
    });
  } else {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).send({
          message: "Failed EmailId is already taken",
        });
      }
    } catch (err) {
      console.log("Some Err happend", err.message);
      res.status(500).send({
        message: "Some Internal server error",
      });
    }
  }

  if (!req.body.userType) {
    return res.status(400).send({
      message: "Failed ! User type is not passed",
    });
  }

  if (req.body.userType == constants.userTypes.admin) {
    return res.status(400).send({
      message: "ADMIN registartion is not allowed",
    });
  }
  const userTypes = [constants.userTypes.user, constants.userTypes.guest];

  if (!userTypes.includes(req.body.userType)) {
    return res.status(400).send({
      message:
        "UserType provided is not correct. Possible correct values : GUEST | USER",
    });
  }

  next();
};

const validateSignInRequestBody = async (req, res, next) => {
  // Validate if the userId is present
  if (!req.body.userId) {
    return res.status(400).send({
      message: "Failed ! UserId is not provided",
    });
  }

  if (!req.body.password) {
    return res.status(400).send({
      message: "Failed ! Password is not provided",
    });
  }

  next();
};

const validateUserUpdateBody = async (req, res, next) => {
  if (req.body.email && !isValidEmail(req.body.email)) {
    return res.status(400).send({
      message: "Failed! Not a valid email id",
    });
  }

  const allowedUserTypes = [
    constants.userTypes.user,
    constants.userTypes.guest,
  ];
  if (req.body.userType && !allowedUserTypes.includes(req.body.userType)) {
    return res.status(400).send({
      message: "Failed! UserType provided is not valid",
    });
  }

  if (req.body.status) {
    return res.status(400).send({
      message: "Failed! UserStatus can not changed ",
    });
  }

  next();
};

const verifyRequestBodiesForAuth = {
  validateSignUpRequestBody: validateSignUpRequestBody,
  validateSignInRequestBody: validateSignInRequestBody,
  validateUserUpdateBody: validateUserUpdateBody,
};

module.exports = verifyRequestBodiesForAuth;
