const User = require("../models/userSchema");
const constants = require("../utils/constants");
const objectConverter = require("../utils/objectConverter");
exports.findAll = async (req, res) => {
  const queryObj = {};
  const userTypeQP = req.query.userType;
  const userStatusQp = req.query.userStatus;

  if (userTypeQP) {
    queryObj.userType = userTypeQP;
  }
  if (userStatusQp) {
    queryObj.userStatus = userStatusQp;
  }

  try {
    const users = await User.find(queryObj);
    res.status(200).send(objectConverter.userResponse(users));
  } catch (err) {
    console.log("Some Err happend", err.message);
    res.status(500).send({
      message: "Some Internal server error",
    });
  }
};

exports.findUserById = async (req, res) => {
  try {
    const user = await User.find({ userId: req.params.id });

    return res.status(200).send(objectConverter.userResponse(user));
  } catch (err) {
    console.log("Some Err happend", err.message);
    res.status(500).send({
      message: "Some Internal server error",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id });
    user.password = req.body.password
      ? bcrypt.hashSync(req.body.password, 8)
      : user.password;
    user.email = req.body.email ? req.body.email : user.email;

    user.userType =
      req.body.userType != undefined ? req.body.userType : user.userType;

    const updatedUser = await user.save();
    res.status(200).send({
      userId: updatedUser.userId,
      email: updatedUser.email,
      userType: updatedUser.userType,
    });
  } catch (err) {
    console.log("Error whileDB operation", err.message);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

exports.followUser = async (req, res) => {
  if (req.userId !== req.params.id) {
    try {
      const user = await User.findOne({ userId: req.params.id });
      const currentUser = await User.findOne({ userId: req.userId });
      console.log(currentUser);

      if (!user.followers.includes(req.userId)) {
        user.followers.push(currentUser._id);
        currentUser.following.push(user._id);
        const updatedUser = await user.save();
        const updatedCurrentUser = await currentUser.save();
        res.status(200).send({
          CurrentUser: updatedCurrentUser.userId,
          CurrentUserFollowing: updatedCurrentUser.following,
          User: updatedUser.userId,
          UserFollwers: updatedUser.followers,
        });
      } else {
        res.status(403).send("You allready follow this user");
      }
    } catch (err) {
      console.log("Error while Follow an user", err.message);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  } else {
    res.status(403).send("you cant follow yourself");
  }
};

exports.unFollowUser = async (req, res) => {
  if (req.userId !== req.params.id) {
    try {
      const user = await User.findOne({ userId: req.params.id });
      const currentUser = await User.findOne({ userId: req.userId });
      if (user.followers.includes(currentUser._id)) {
        console.log("heere");
        await User.updateOne(
          { _id: user._id },
          { $pull: { followers: currentUser._id } }
        );
        await User.updateOne(
          { _id: currentUser._id },
          { $pull: { following: user._id } }
        );

        const updatedUser = await User.findOne({ userId: req.params.id });
        const updatedCurrentUser = await User.findOne({ userId: req.userId });
        console.log(updatedUser, updatedCurrentUser);
        res.status(200).send({
          CurrentUser: updatedCurrentUser.userId,
          CurrentUserFollowing: updatedCurrentUser.following,
          User: updatedUser.userId,
          UserFollwers: updatedUser.followers,
        });
      } else {
        res.status(403).send("You dont follow this user");
      }
    } catch (err) {
      console.log("Error while UnFollow an user", err.message);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
};
