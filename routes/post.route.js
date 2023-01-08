const postController = require("../controllers/post.controller");
const { authJwt, verifyPostRequestBodies } = require("../middlewares");

module.exports = (app) => {
  app.post(
    "/sociopost/api/v1/posts",
    [authJwt.verifyToken, verifyPostRequestBodies.validateCreatePostBody],
    postController.createPost
  );
  app.put(
    "/sociopost/api/v1/posts/:id/like",
    [
      authJwt.verifyToken,
      authJwt.isCuruserisAdminOrUser,
      verifyPostRequestBodies.isValidPostIdInRequestParam,
    ],
    postController.likePost
  );
  app.put(
    "/sociopost/api/v1/posts/:id/comment",

    [
      authJwt.verifyToken,
      authJwt.isCuruserisAdminOrUser,
      verifyPostRequestBodies.isValidPostIdInRequestParam,
      verifyPostRequestBodies.isCommentHavingData,
    ],
    postController.commentOnPost
  );
  app.get(
    "/sociopost/api/v1/posts/most-liked",

    [authJwt.verifyToken],
    postController.posthavingMostLike
  );
};
