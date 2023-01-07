const express = require("express");
const app = express();
const serverConfig = require("./configs/server.config");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const dbConfig = require("./configs/db.config");
const User = require("./models/userSchema");
const bcrypt = require("bcryptjs");
const constants = require("./utils/constants");

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({ extended: true })); //extended:true  accept  other  Datatype also  beside string

mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;

db.on("error", () => {
  console.log("Error while connected to mongodb");
});

db.once("open", () => {
  console.log("connected to mongodb");
  init();
});
async function init() {
  try {
    await User.collection.drop();

    const users = await User.insertMany([
      {
        userId: "admin",
        password: bcrypt.hashSync("welcome", 8),
        email: "admin@gmail.com",
        userStatus: constants.userStatus.inActive,
        userType: constants.userTypes.admin,
      },
      {
        userId: "user01",
        password: bcrypt.hashSync("welcome", 8),
        email: "user01@gmail.com",
        userStatus: constants.userStatus.inActive,
        userType: constants.userTypes.user,
      },
      {
        userId: "user02",
        password: bcrypt.hashSync("welcome", 8),
        email: "user02@gmail.com",
        userStatus: constants.userStatus.inActive,
        userType: constants.userTypes.user,
      },
      {
        userId: "user03",
        password: bcrypt.hashSync("welcome", 8),
        email: "user03@gmail.com",
        userStatus: constants.userStatus.inActive,
        userType: constants.userTypes.user,
      },
    ]);

    console.log(users);
  } catch (err) {
    console.log("err in db initialization", err.message);
  }
}

require("./routes/auth.route")(app);
require("./routes/user.route")(app);

console.log(serverConfig);
app.listen(serverConfig.PORT, () => {
  console.log("Started the server on the PORT number :", serverConfig.PORT);
});
