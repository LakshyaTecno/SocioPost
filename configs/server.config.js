if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); // here we are basically get the key, values pair  from .env files and store it into process.env which is the part of global obj
}
module.exports = {
  PORT: process.env.PORT,
};
