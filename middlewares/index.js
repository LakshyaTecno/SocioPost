const verifySignUp = require("./verifySignUp");
const authJwt = require("./authjwt");
const verifyPostRequestBodies = require("./verifyPostRequsetbodies");
/**
 * I can add more middleware here as the project grows
 */

module.exports = {
  verifySignUp,
  authJwt,
  verifyPostRequestBodies,
};
