const Post = require("../models/postSchema");
const User = require("../models/userSchema");

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
    await user.save();
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
      });
    }
    post.likes.push(user._id);
    await post.save();
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
    await post.save();
    res.status(201).send(post);
  } catch (err) {
    console.log("Some Err happend", err.message);
    res.status(500).send({
      message: "Some Internal server error",
    });
  }
};
