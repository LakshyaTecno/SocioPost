const userController = require("../controllers/users.controller");
const { authJwt } = require("../middlewares");

module.exports = (app) => {
  app.get(
    "/sociopost/api/v1/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.findAll
  );
  app.get(
    "/sociopost/api/v1/users/topFiveActiveUsers",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.topFiveActiveUsers
  );
  app.get(
    "/sociopost/api/v1/users/:id",
    [
      authJwt.verifyToken,
      authJwt.isValidUserIdInRequestParam,
      authJwt.isAdminOrUser,
    ],
    userController.findUserById
  );

  app.put(
    "/sociopost/api/v1/users/:id",
    [
      authJwt.verifyToken,
      authJwt.isValidUserIdInRequestParam,
      authJwt.isAdminOrUser,
    ],
    userController.update
  );
  app.put(
    "/sociopost/api/v1/users/:id/follow",
    [authJwt.verifyToken, authJwt.isValidUserIdInRequestParam],
    userController.followUser
  );
  app.put(
    "/sociopost/api/v1/users/:id/unfollow",
    [authJwt.verifyToken, authJwt.isValidUserIdInRequestParam],
    userController.unFollowUser
  );
};
