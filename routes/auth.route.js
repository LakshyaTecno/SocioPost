const authcontroller = require("../controllers/auth.controller");
const { authJwt } = require("../middlewares");
const { verifySignUp } = require("../middlewares");
module.exports = (app) => {
  app.post(
    "/sociopost/api/v1/auth/signup",
    [verifySignUp.validateSignUpRequestBody],
    authcontroller.signup
  );

  app.post(
    "/sociopost/api/v1/auth/signin",
    [verifySignUp.validateSignInRequestBody],
    authcontroller.signin
  );
  app.post(
    "/sociopost/api/v1/auth/signout",
    [authJwt.isValidUserIdInRequestParam],
    authcontroller.signout
  );
};
