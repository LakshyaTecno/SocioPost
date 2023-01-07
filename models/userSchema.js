const mongoose = require("mongoose");
const constants = require("../utils/constants");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    minLength: 10,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    default: constants.userTypes.user,
    enum: [
      constants.userTypes.admin,
      constants.userTypes.user,
      constants.userTypes.guest,
    ],
  },
  userStatus: {
    type: String,
    default: constants.userStatus.inActive,
    enum: [constants.userStatus.active, constants.userStatus.inActive],
  },
  followers: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "User",
  },
  following: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "User",
  },
  posts: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Post",
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => {
      return Date.now();
    },
  },
  updatedAt: {
    type: Date,
    default: () => {
      return Date.now();
    },
  },
});

module.exports = mongoose.model("user", userSchema);
