const User = require("./models/userSchema");
const Post = require("./models/postSchema");
const constants = require("./utils/constants");
const bcrypt = require("bcryptjs");
module.exports = async () => {
  try {
    await User.collection.drop();

    await Post.collection.drop();

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
        email: "lakshyanbd0@gmail.com",
        userStatus: constants.userStatus.inActive,
        userType: constants.userTypes.user,
      },
      {
        userId: "user02",
        password: bcrypt.hashSync("welcome", 8),
        email: "lakshyatecno@gmail.com",
        userStatus: constants.userStatus.inActive,
        userType: constants.userTypes.user,
      },
      {
        userId: "user03",
        password: bcrypt.hashSync("welcome", 8),
        email: "nlakshya6@gmail.com",
        userStatus: constants.userStatus.inActive,
        userType: constants.userTypes.user,
      },
    ]);
    const [admin, user1, user2, user3] = users;

    const posts = await Post.insertMany([
      {
        postId: "post01",
        user: user1._id,
        caption: "I like javascipt",
        tags: ["#coding"],
        likes: [user2._id, user3._id],
        comments: [
          { user: user2._id, text: "we are js developers" },
          { user: user3._id, text: "yes we are developers" },
        ],
      },
      {
        postId: "post02",
        user: user2._id,
        caption: "I like c++",
        tags: ["#coding"],
        likes: [user1._id, user3._id],
        comments: [
          { user: user1._id, text: "we are c++ developers" },
          { user: user3._id, text: "yes we are c++ developers" },
        ],
      },
      {
        postId: "post03",
        user: user3._id,
        caption: "I like javascipt",
        tags: ["#coding"],
        likes: [user2._id, user1._id],
        comments: [
          { user: user2._id, text: "we are java developers" },
          { user: user1._id, text: "yes we  java are developers" },
        ],
      },
    ]);

    const [post1, post2, post3] = posts;

    user1.posts.push(post1._id);
    user1.followers.push(user2._id);
    user1.followers.push(user3._id);
    await user1.save();

    user2.followers.push(user1._id);
    user2.followers.push(user3._id);
    user2.posts.push(post2._id);
    await user2.save();

    user3.followers.push(user1._id);
    user3.followers.push(user2._id);
    user3.posts.push(post3._id);
    await user3.save();

    console.log(users, posts);
  } catch (err) {
    console.log("err in db initialization", err.message);
  }
};
