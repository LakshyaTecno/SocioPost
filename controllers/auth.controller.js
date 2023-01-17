const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const secretConfig = require("../configs/auth.config");
const constants = require("../utils/constants");
const objectConverter = require("../utils/objectConverter");
exports.signup = async (req, res) => {
  const userObj = {
    userId: req.body.userId,
    email: req.body.email,
    userType: req.body.userType,
    password: bcrypt.hashSync(req.body.password),
  };
  try {
    const userCreated = await User.create(userObj);

    res.status(201).send(objectConverter.userResponse([userCreated]));
  } catch (err) {
    console.log("Some Err happend while Signup user", err.message);
    res.status(500).send({
      message: "Some Internal server error",
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.body.userId });

    if (!user) {
      return res.status(400).send({
        message: "Failed! UserId passed is not correct Please pass valid ID",
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Wrong Password",
      });
    }

    const token = jwt.sign(
      {
        id: user.userId,
      },
      secretConfig.secret,
      {
        expiresIn: 600,
      }
    );
    console.log(user);
    user.userStatus = constants.userStatus.active;
    user.startTime = Date.now();
    const user1 = await user.save();

    res.status(200).send({
      name: user1.name,
      userId: user1.userId,
      email: user1.email,
      userType: user1.userType,
      userStatus: user1.userStatus,
      accessToken: token,
    });
  } catch (err) {
    console.log("Some Err happend while Signin User", err.message);
    res.status(500).send({
      message: "Some Internal server error",
    });
  }
};

exports.signout = async (req, res) => {
  try {
    const usr = await User.findOne({ userId: req.params.id });
    usr.userStatus = constants.userStatus.inActive;
    usr.endTime = Date.now();
    usr.totalActiveTime = !usr.totalActiveTime
      ? Math.floor(usr.endTime / 1000) - Math.floor(usr.startTime / 1000)
      : usr.totalActiveTime +
        Math.floor(usr.endTime / 1000) -
        Math.floor(usr.startTime / 1000);

    const user = await usr.save();
    res.status(200).send({
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      userStatus: user.userStatus,
    });
  } catch (err) {
    console.log("Some Err happend  while signout user", err.message);
    res.status(500).send({
      message: "Some Internal server error",
    });
  }
};
