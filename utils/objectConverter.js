exports.userResponse = (users) => {
  userResult = [];

  users.forEach((user) => {
    userResult.push({
      userId: user.userId,
      email: user.email,
      userTypes: user.userType,
      userStatus: user.userStatus,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
    });
  });
  return userResult;
};
