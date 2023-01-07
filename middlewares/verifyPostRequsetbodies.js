const Post = require("../models/postSchema");
const validateCreatePostBody = async (req, res, next) => {
  if (!req.body.postId) {
    return res.status(400).send({
      message: "Failed postId is not provided",
    });
  } else {
    try {
      const post = await Post.findOne({ postId: req.body.postId });
      if (post) {
        return res.status(400).send({
          message: "Failed postId is already taken",
        });
      }
    } catch (err) {
      console.log("Some Err happend", err.message);
      res.status(500).send({
        message: "Some Internal server error",
      });
    }
  }

  if (!req.body.caption) {
    return res.status(400).send({
      message: "Failed caption is not provided",
    });
  }
  next();
};

const isValidPostIdInRequestParam = async (req, res, next) => {
  try {
    const post = await Post.findOne({ postId: req.params.id });

    if (!post) {
      return res.status(400).send({
        message: "PostId passed doesn't exist",
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

const verifyPostRequestBodies = {
  validateCreatePostBody: validateCreatePostBody,
  isValidPostIdInRequestParam: isValidPostIdInRequestParam,
};

module.exports = verifyPostRequestBodies;
