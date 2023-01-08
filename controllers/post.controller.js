const Post = require("../models/postSchema");
const { find } = require("../models/userSchema");
const User = require("../models/userSchema");
const sendNotification = require("../utils/notificationClient");

exports.createPost = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.userId });
    const post = {
      postId: req.body.postId,
      user: user._id,
      caption: req.body.caption,
      tags: req.body.tags,
    };
    const postCreated = await Post.create(post);
    user.posts.push(postCreated._id);
    const updatedUser = await user.save();
    console.log("here");
    console.log(updatedUser);
    const recepients = await User.find({ _id: { $in: updatedUser.followers } });
    const recepientsEmails = recepients.map((recepient) => {
      return recepient.email;
    });
    console.log(recepientsEmails);

    sendNotification(
      `Post Added by ${user.userId}`,
      `checkout ${user.userId} is posted ${post.caption} interested `,
      `${recepientsEmails}`,
      "no-reply-SocioPost@gmail.com",
      "SocioPostApp"
    );
    res.status(201).send(postCreated);
  } catch (err) {
    console.log("Some Err happend", err.message);
    res.status(500).send({
      message: "Some Internal server error",
    });
  }
};

exports.likePost = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.userId });
    const post = await Post.findOne({ postId: req.params.id });
    if (post.likes.includes(user._id)) {
      res.status(403).send({
        msg: "You already like this post",
        post,
      });
    }
    post.likes.push(user._id);

    const updatedPost = await post.save();
    const postCreatedby = await User.findOne({ _id: updatedPost.user });
    if (postCreatedby._id !== user._id) {
      sendNotification(
        `Post like by ${user.userId}`,
        `checkout ${user.userId} is like Your post ${post.caption} `,
        `${postCreatedby.email}`,
        "no-reply-SocioPost@gmail.com",
        "SocioPostApp"
      );
    }
    res.status(201).send(post);
  } catch (err) {
    console.log("Some Err happend", err.message);
    res.status(500).send({
      message: "Some Internal server error",
    });
  }
};

exports.commentOnPost = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.userId });
    const post = await Post.findOne({ postId: req.params.id });
    const commentData = {
      user: user._id,
      text: req.body.text,
    };
    post.comments.push(commentData);
    const updatedPost = await post.save();
    const postCreatedby = await User.findOne({ _id: updatedPost.user });
    if (postCreatedby._id !== user._id) {
      sendNotification(
        `${user.userId} comment on your Post`,
        `checkout ${user.userId} is comment Your post ${post._id} `,
        `${postCreatedby.email}`,
        "no-reply-SocioPost@gmail.com",
        "SocioPostApp"
      );
    }
    res.status(201).send(post);
  } catch (err) {
    console.log("Some Err happend", err.message);
    res.status(500).send({
      message: "Some Internal server error",
    });
  }
};
